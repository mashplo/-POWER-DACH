import sqlite3

conn = sqlite3.connect('proteinas.db')
cursor = conn.cursor()

# Ver todas las tablas
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tablas = cursor.fetchall()
print("Tablas en la base de datos:")
for tabla in tablas:
    print(f"  - {tabla[0]}")

# Ver contenido de preentrenos si existe
try:
    cursor.execute("SELECT COUNT(*) FROM preentrenos")
    count = cursor.fetchone()[0]
    print(f"\nTabla 'preentrenos' tiene {count} registros")
    
    if count > 0:
        cursor.execute("SELECT id, title, price FROM preentrenos")
        productos = cursor.fetchall()
        print("\nProductos pre-entrenos:")
        for p in productos:
            print(f"  ID: {p[0]}, Título: {p[1]}, Precio: ${p[2]}")
except Exception as e:
    print(f"\nError al consultar preentrenos: {e}")

conn.close()
