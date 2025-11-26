import sqlite3
from pathlib import Path

# Ruta a la base de datos
DB_PATH = Path(__file__).parent.parent / "proteinas.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Mostrar todos los pre-entrenos
cursor.execute("SELECT id, title, price FROM preentrenos ORDER BY id")
print("Pre-entrenos en la base de datos:")
print("-" * 80)
for row in cursor.fetchall():
    print(f"ID {row[0]}: {row[1]} - S/{row[2]}")

conn.close()
