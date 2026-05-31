from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db
import pytest


client = TestClient(app)


@pytest.fixture
def auth_token():
    client.post(
        "/users",
        json={
            "first_name": "Zack",
            "last_name": "Valavanis",
            "email": "zval321@gmail.com",
            "password": "password123",
        },
    )

    login_response = client.post(
        "/auth/login", json={"email": "zval321@gmail.com", "password": "password123"}
    )

    token = login_response.json()["access_token"]

    client.post(
        "/p_tables",
        json={
            "rating": 1.2,
            "location": "Chicago",
            "table_size": 1.2,
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    yield token

    db = next(get_db())
    from app.models.user import User
    from app.models.p_table import P_Table

    user = db.query(User).filter(User.email == "zval321@gmail.com").first()
    db.query(P_Table).filter(P_Table.user_id == user.id).delete()
    db.query(User).filter(User.email == "zval321@gmail.com").delete()
    db.commit()


def test_get_p_tables(auth_token):

    response = client.get(
        "/p_tables", headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_p_table(auth_token):
    new_table = client.post(
        "/p_tables",
        json={"rating": 1.2, "location": "Chicago", "table_size": 1.2},
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    table_id = new_table.json()["id"]

    response = client.get(
        f"/p_tables/{table_id}", headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_delete_pool_table(auth_token):
    table_id = client.get(
        "/p_tables", headers={"Authorization": f"Bearer {auth_token}"}
    ).json()[0]["id"]

    response = client.delete(
        f"/p_tables/{table_id}", headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 200
