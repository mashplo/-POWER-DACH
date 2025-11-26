import requests

print("=== PROBANDO ENDPOINT SIN FILTROS ===")
response = requests.get("http://localhost:8000/api/v1/products")
data = response.json()
print(f"Total de productos devueltos: {len(data)}")
for p in data:
    print(f"ID {p['id']}: {p['title']} - S/{p['price']}")

print("\n=== PROBANDO CON FILTRO DE CATEGORÍA 'Proteína' ===")
response = requests.get("http://localhost:8000/api/v1/products?category=Proteína")
data = response.json()
print(f"Total de productos devueltos: {len(data)}")
for p in data:
    print(f"ID {p['id']}: {p['title']} - S/{p['price']}")
