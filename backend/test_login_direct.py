import requests
import json

# Test login with a user that was registered via the frontend
url = "http://localhost:8000/api/v1/auth/login"

# Try with admin credentials first (known to exist)
print("=" * 60)
print("TEST 1: Login con admin (usuario pre-existente)")
print("=" * 60)
payload = {
    "email": "admin@test.com",
    "password": "admin"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 200:
        print("✓ Login con admin exitoso")
    else:
        print("✗ Login con admin falló")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n" + "=" * 60)
print("TEST 2: Login con usuario de prueba")
print("=" * 60)
# Test with the user registered in test_register.py
payload2 = {
    "email": "test_script@test.com",
    "password": "password123"
}

try:
    response = requests.post(url, json=payload2)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    if response.status_code == 200:
        print("✓ Login exitoso")
    else:
        print("✗ Login falló")
except Exception as e:
    print(f"✗ Error: {e}")
