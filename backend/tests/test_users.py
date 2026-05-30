from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db

client = TestClient(app)


def test_get_users():
    response = client.get("/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_user():
    new_user_response = client.post(
        "/users",
        json={
            "first_name": "Steve",
            "last_name": "Rodgers",
            "email": "Steve@email.com",
            "password": "password123",
        },
    )

    assert new_user_response.status_code == 200
    assert new_user_response.json()["email"] == "Steve@email.com"

    from app.models.user import User

    db = next(get_db())
    db.query(User).filter(User.email == "Steve@email.com").delete()
    db.commit()
