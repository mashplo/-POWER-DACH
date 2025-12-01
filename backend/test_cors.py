import requests

# Primero, hacer una solicitud OPTIONS (preflight)
print("=" * 60)
print("PREFLIGHT REQUEST (OPTIONS)")
print("=" * 60)
resp_options = requests.options(
    'http://localhost:8000/api/v1/auth/login',
    headers={
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
    }
)
print(f'Status: {resp_options.status_code}')
print('\nHeaders:')
for k, v in resp_options.headers.items():
    print(f'  {k}: {v}')

# Luego, hacer una solicitud POST real
print("\n" + "=" * 60)
print("ACTUAL POST REQUEST")
print("=" * 60)
resp_post = requests.post(
    'http://localhost:8000/api/v1/auth/login',
    json={'email': 'admin@test.com', 'password': 'Admin123!'},
    headers={'Origin': 'http://localhost:5173'}
)
print(f'Status: {resp_post.status_code}')
print('\nHeaders:')
for k, v in resp_post.headers.items():
    print(f'  {k}: {v}')
print(f'\nResponse Body: {resp_post.text[:200]}')
