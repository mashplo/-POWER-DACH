import sqlite3
from pathlib import Path

# Ruta a la base de datos
DB_PATH = Path(__file__).parent.parent / "proteinas.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Creatina 1: Scitec Nutrition 300G
titulo1 = "CREATINA MONOHIDRATADA 300G - SCITEC NUTRITION"
precio1 = 99.0
categoria1 = "Creatina"
descripcion1 = """Aumenta tu fuerza, potencia y rendimiento muscular con creatina micronizada de alta pureza. Más repeticiones, más resultados. Rendimiento real desde el primer ciclo. La CREATINA MONOHIDRATADA 300G de Scitec Nutrition es un suplemento de creatina monohidrato 100% pura, reconocida por mejorar el rendimiento deportivo, la fuerza y el crecimiento muscular. Es un producto popular y bien valorado por los atletas."""
imagenes1 = "http://127.0.0.1:8000/assets/productos/156666-1600-auto.png,http://127.0.0.1:8000/assets/productos/156668-1600-auto.png"

# Creatina 2: Ultimate Nutrition 120G
titulo2 = "CREATINA MONOHIDRATADA 120G - ULTIMATE NUTRITION"
precio2 = 89.0
categoria2 = "Creatina"
descripcion2 = """La forma más pura y estudiada de creatina. Aumenta tu fuerza, potencia y ayuda a ganar masa muscular magra. Esencial para cualquier deportista. La CREATINA MONOHIDRATADA 120G de Ultimate Nutrition es un suplemento de creatina monohidrato 100% pura y micronizada, diseñado para potenciar el rendimiento físico en actividades de alta intensidad."""
imagenes2 = "http://127.0.0.1:8000/assets/productos/157855-1600-auto.png,http://127.0.0.1:8000/assets/productos/157856-1600-auto.png"

# Creatina 3: Dymatize 300G
titulo3 = "CREATINA MONOHIDRATADA DYMATIZE 300G"
precio3 = 159.0
categoria3 = "Creatina"
descripcion3 = """Maximiza tu fuerza y rendimiento con nuestra creatina monohidratada de alta pureza. Cada porción de 3g te aporta la energía explosiva necesaria para entrenamientos intensos, mejorando tu capacidad de esfuerzo y recuperación muscular. Ideal para mezclar con tus bebidas favoritas, sin sabor, apta para veganos y libre de gluten y lactosa. La CREATINA MONOHIDRATADA DYMATIZE 300G es un suplemento de creatina monohidrato micronizada, conocida por su alta calidad y pureza. Es una opción popular entre los atletas que buscan mejorar su rendimiento deportivo, fuerza y masa muscular."""
imagenes3 = "http://127.0.0.1:8000/assets/productos/157834-1600-auto.png"

# Insertar las 3 creatinas
creatinas = [
    (titulo1, descripcion1, precio1, categoria1, imagenes1),
    (titulo2, descripcion2, precio2, categoria2, imagenes2),
    (titulo3, descripcion3, precio3, categoria3, imagenes3)
]

for creatina in creatinas:
    cursor.execute("""
        INSERT INTO creatinas (title, description, price, category, images)
        VALUES (?, ?, ?, ?, ?)
    """, creatina)
    print(f"✓ Creatina agregada: {creatina[0]} - S/{creatina[2]}")

conn.commit()

# Mostrar todas las creatinas
print("\n✓ Todas las creatinas en la base de datos:")
cursor.execute("SELECT id, title, price FROM creatinas ORDER BY id")
for row in cursor.fetchall():
    print(f"  ID {row[0]}: {row[1]} - S/{row[2]}")

conn.close()
