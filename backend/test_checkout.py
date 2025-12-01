import requests
import json

# Simular datos del carrito como los enviaría el frontend
checkout_data = {
    "user_id": 2,  # Admin user ID
    "total": 150.00,
    "items": [
        {
            "product_id": 1,
            "product_type": "productos",
            "quantity": 2,
            "price": 50.00,
            "title": "Proteína Whey"
        },
        {
            "product_id": 3,
            "product_type": "creatinas",
            "quantity": 1,
            "price": 50.00,
            "title": "Creatina Monohidrato"
        }
    ]
}

print("Datos a enviar:")
print(json.dumps(checkout_data, indent=2))
print("\n" + "="*60)

try:
    response = requests.post(
        "http://localhost:8000/api/v1/boletas",
        json=checkout_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✓ CHECKOUT EXITOSO!")
        data = response.json()
        print(f"Boleta ID: {data.get('boleta_id')}")
    else:
        print("\nCHECKOUT FALLO")
        try:
            error_detail = response.json()
            with open("checkout_error_details.json", "w") as f:
                json.dump(error_detail, f, indent=2)
            print("Detalles del error guardados en checkout_error_details.json")
        except:
            print("No se pudo parsear el error")
except Exception as e:
    print(f"\n✗ Error de conexión: {e}")
