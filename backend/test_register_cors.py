import requests

print("=" * 60)
print("TEST DE REGISTRO CON CORS")
print("=" * 60)

# Datos de prueba
data = {
    'nombre': 'Usuario Test',
    'email': 'newuser@test.com',
    'password': 'Test123'
}

# Headers simulando request desde el frontend
headers = {
    'Origin': 'http://localhost:5173',
    'Content-Type': 'application/json'
}

print("\n1. Probando registro de nuevo usuario...")
print(f"Email: {data['email']}")
print(f"Password: {data['password']}")

try:
    resp = requests.post(
        'http://localhost:8000/api/v1/auth/register',
        json=data,
        headers=headers
    )
    
    print(f"\n📊 Status Code: {resp.status_code}")
    
    print("\n🔑 Headers CORS:")
    cors_origin = resp.headers.get('access-control-allow-origin', 'NOT PRESENT')
    vary = resp.headers.get('vary', 'NOT PRESENT')
    
    print(f"  Access-Control-Allow-Origin: {cors_origin}")
    print(f"  Vary: {vary}")
    
    if cors_origin != 'NOT PRESENT':
        print("\n✅ CORS headers presentes - CORS está funcionando")
    else:
        print("\n❌ CORS headers NO presentes - hay un problema")
    
    print(f"\n📝 Response Body:")
    try:
        response_json = resp.json()
        print(f"  {response_json}")
    except:
        print(f"  {resp.text[:300]}")
        
except Exception as e:
    print(f"\n❌ Error en la solicitud: {e}")

print("\n" + "=" * 60)
