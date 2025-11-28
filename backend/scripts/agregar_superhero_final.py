import sqlite3

conn = sqlite3.connect('proteinas.db')
cursor = conn.cursor()

# Datos del nuevo pre-entreno con extensión .png
titulo = "SUPER HERO COLA-LIME 285G - SCITEC NUTRITION"
precio = 149.0
descripcion = """El suplemento SUPER HERO COLA-LIME 285G de Scitec Nutrition es un pre-entrenamiento avanzado, diseñado para proporcionar un enfoque mental intenso, energía explosiva y un excelente bombeo muscular sin un "bajón" posterior. El envase de 285 g rinde aproximadamente 30 dosis (basado en una dosis de 9,5g) o 60 porciones si se consume media dosis."""
categoria = "Pre-Entreno"
imagenes = "http://127.0.0.1:8000/assets/productos/157590-1600-auto.png,http://127.0.0.1:8000/assets/productos/157592-1600-auto.png"

# Insertar el pre-entreno
cursor.execute("""
    INSERT INTO preentrenos (title, description, price, category, images)
    VALUES (?, ?, ?, ?, ?)
""", (titulo, descripcion, precio, categoria, imagenes))

conn.commit()
nuevo_id = cursor.lastrowid

print(f"✓ Pre-entreno agregado exitosamente con ID: {nuevo_id}")
print(f"  Título: {titulo}")
print(f"  Precio: S/{precio}")

# Verificar todos los pre-entrenos
cursor.execute("SELECT id, title, price FROM preentrenos ORDER BY id")
print("\n✓ Todos los pre-entrenos en la base de datos:")
for p in cursor.fetchall():
    print(f"  ID {p[0]}: {p[1]} - S/{p[2]}")

conn.close()
