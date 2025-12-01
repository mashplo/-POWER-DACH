import requests

# Test login with the just-registered user
url = "http://localhost:8000/api/v1/auth/login"
payload = {
    "email": "test_script@test.com",
    "password": "password123"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        print(f"\n✓ Login successful!")
        print(f"Token preview: {token[:30]}...")
        
        # Test /me endpoint
        me_response = requests.get(
            "http://localhost:8000/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"\n/me Status: {me_response.status_code}")
        print(f"/me Response: {me_response.text}")
except Exception as e:
    print(f"Error: {e}")
