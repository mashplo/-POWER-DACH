# MOVIDO desde backend/backend/eliminar_duplicado.py
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "backend" / "proteinas.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("DELETE FROM preentrenos WHERE id = 5")
conn.commit()
print("✓ Duplicado eliminado (ID 5)")

cursor.execute("SELECT id, title, price FROM preentrenos ORDER BY id")
print("\n✓ Pre-entrenos actualizados:")
for row in cursor.fetchall():
    print(f"  ID {row[0]}: {row[1]} - S/{row[2]}")

conn.close()
