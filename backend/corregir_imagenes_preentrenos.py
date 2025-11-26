import sqlite3

conn = sqlite3.connect('proteinas.db')
cursor = conn.cursor()

# Actualizar las imágenes de los pre-entrenos para que usen .png en lugar de .webp
updates = [
    (1, "http://127.0.0.1:8000/assets/productos/158097-1600-auto.png,http://127.0.0.1:8000/assets/productos/158098-1600-auto.png"),
    (2, "http://127.0.0.1:8000/assets/productos/156001-1600-auto.png,http://127.0.0.1:8000/assets/productos/156188-1600-auto.png"),
    (3, "http://127.0.0.1:8000/assets/productos/155930-1600-auto.png,http://127.0.0.1:8000/assets/productos/156424-1600-auto.png")
]

for id_producto, nueva_imagen in updates:
    cursor.execute("UPDATE preentrenos SET images = ? WHERE id = ?", (nueva_imagen, id_producto))
    print(f"✓ Actualizado pre-entreno ID {id_producto}")

conn.commit()

# Verificar cambios
print("\nVerificación:")
cursor.execute("SELECT id, title, images FROM preentrenos")
for p in cursor.fetchall():
    print(f"\nID {p[0]}: {p[1]}")
    print(f"  Imágenes: {p[2]}")

conn.close()
print("\n✓ Base de datos actualizada correctamente")
