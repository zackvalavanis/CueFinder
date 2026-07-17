import pytest


@pytest.fixture
def auth_token(client):
    client.post(
        "/users",
        json={
            "first_name": "Test",
            "last_name": "Player",
            "email": "test.player@example.com",
            "password": "password123",
        },
    )

    login_response = client.post(
        "/auth/login",
        json={"email": "test.player@example.com", "password": "password123"},
    )

    token = login_response.json()["access_token"]

    client.post(
        "/p_tables",
        json={
            "rating": 1.2,
            "location": "Chicago",
            "table_size": 1.2,
            "place_id": "test-place-1",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    return token


def test_get_p_tables(client, auth_token):
    response = client.get(
        "/p_tables", headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_p_table(client, auth_token):
    new_table = client.post(
        "/p_tables",
        json={
            "rating": 1.2,
            "location": "Chicago",
            "table_size": 1.2,
            "place_id": "test-place-2",
        },
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    table_id = new_table.json()["id"]

    response = client.get(
        f"/p_tables/{table_id}", headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_delete_pool_table(client, auth_token):
    table_id = client.get(
        "/p_tables", headers={"Authorization": f"Bearer {auth_token}"}
    ).json()[0]["id"]

    response = client.delete(
        f"/p_tables/{table_id}", headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 200
