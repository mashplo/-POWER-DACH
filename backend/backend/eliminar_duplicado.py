import sqlite3
from pathlib import Path

# Ruta a la base de datos
DB_PATH = Path(__file__).parent / "proteinas.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Eliminar el duplicado ID 5 (mantener el ID 4)
cursor.execute("DELETE FROM preentrenos WHERE id = 5")
conn.commit()

print("✓ Duplicado eliminado (ID 5)")

# Mostrar pre-entrenos restantes
cursor.execute("SELECT id, title, price FROM preentrenos ORDER BY id")
print("\n✓ Pre-entrenos actualizados:")
for row in cursor.fetchall():
    print(f"  ID {row[0]}: {row[1]} - S/{row[2]}")

conn.close()
