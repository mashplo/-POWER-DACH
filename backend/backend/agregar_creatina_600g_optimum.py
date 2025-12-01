import sqlite3
from pathlib import Path

# Ruta a la base de datos
DB_PATH = Path(__file__).parent.parent / "proteinas.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Nueva creatina: Optimum Nutrition 600G
titulo = "CREATINA 600G - OPTIMUM NUTRITION"
precio = 239.0
categoria = "Creatina"
descripcion = """Mejora la fuerza, potencia y rendimiento muscular durante entrenamientos de moderada y alta intensidad. Su presentación micronizada facilita la disolución y absorción, optimizando los resultados sin aportar calorías. La CREATINA 600G de Optimum Nutrition es un suplemento de creatina monohidrato 100% pura y micronizada diseñada para aumentar la fuerza, la potencia y el rendimiento muscular."""
imagenes = "http://127.0.0.1:8000/assets/productos/158105-1600-auto.png,http://127.0.0.1:8000/assets/productos/158106-1600-auto.png"

# Insertar la creatina
cursor.execute("""
    INSERT INTO creatinas (title, description, price, category, images)
    VALUES (?, ?, ?, ?, ?)
""", (titulo, descripcion, precio, categoria, imagenes))

conn.commit()

print(f"✓ Creatina agregada: {titulo} - S/{precio}")

# Mostrar todas las creatinas
print("\n✓ Todas las creatinas en la base de datos:")
cursor.execute("SELECT id, title, price FROM creatinas ORDER BY id")
for row in cursor.fetchall():
    print(f"  ID {row[0]}: {row[1]} - S/{row[2]}")

conn.close()
