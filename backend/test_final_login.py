import requests

print("=" * 60)
print("TEST: Login con credenciales correctas de la DB recreada")
print("=" * 60)

# Test admin
url = "http://localhost:8000/api/v1/auth/login"
payload = {
    "email": "admin@test.com",
    "password": "admin"
}

try:
    response = requests.post(url, json=payload)
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ LOGIN EXITOSO!")
        print(f"Token: {data['access_token'][:30]}...")
        
        # Test /me endpoint
        me_resp = requests.get(
            "http://localhost:8000/api/v1/auth/me",
            headers={"Authorization": f"Bearer {data['access_token']}"}
        )
        if me_resp.status_code == 200:
            user = me_resp.json()
            print(f"✓ Usuario: {user['nombre']} ({user['email']})")
            print(f"✓ Rol: {user.get('role', 'N/A')}")
        else:
            print(f"✗ Error al obtener perfil: {me_resp.status_code}")
    else:
        print(f"✗ LOGIN FALLÓ")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"✗ Error de conexión: {e}")

# Test usuario regular
print("\n" + "=" * 60)
print("TEST: Login con usuario regular (test@test.com)")
print("=" * 60)

payload2 = {
    "email": "test@test.com",
    "password": "1234"
}

try:
    response = requests.post(url, json=payload2)
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        print("✓ LOGIN EXITOSO con usuario regular!")
    else:
        print(f"✗ LOGIN FALLÓ")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"✗ Error de conexión: {e}")
