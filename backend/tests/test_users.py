def test_get_users(client):
    response = client.get("/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_user(client):
    new_user_response = client.post(
        "/users",
        json={
            "first_name": "Steve",
            "last_name": "Rodgers",
            "email": "steve@example.com",
            "password": "password123",
        },
    )

    assert new_user_response.status_code == 200
    assert new_user_response.json()["email"] == "steve@example.com"
