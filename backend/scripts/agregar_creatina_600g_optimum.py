# MOVIDO desde backend/backend/agregar_creatina_600g_optimum.py
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "backend" / "proteinas.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

titulo = "CREATINA 600G - OPTIMUM NUTRITION"
precio = 239.0
categoria = "Creatina"
descripcion = "..."
imagenes = "http://127.0.0.1:8000/assets/productos/158105-1600-auto.png,http://127.0.0.1:8000/assets/productos/158106-1600-auto.png"

cursor.execute(
    """
    INSERT INTO creatinas (title, description, price, category, images)
    VALUES (?, ?, ?, ?, ?)
    """,
    (titulo, descripcion, precio, categoria, imagenes),
)

conn.commit()
print(f"✓ Creatina agregada: {titulo} - S/{precio}")

cursor.execute("SELECT id, title, price FROM creatinas ORDER BY id")
for row in cursor.fetchall():
    print(f"  ID {row[0]}: {row[1]} - S/{row[2]}")

conn.close()
