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
    print(login_response.status_code)
    print(login_response.json())
    token = login_response.json()["access_token"]
    yield token

    client.delete("users/me", headers={"Authorization": f"bearer{token}"})

    db = next(get_db())
    from app.models.user import User

    db.query(User).filter(User.email == "zval321@gmail.com").delete()
    db.commit()


def test_get_p_tables(auth_token):

    response = client.get(
        "/p_tables", headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)
