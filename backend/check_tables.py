import sqlite3
conn = sqlite3.connect('proteinas.db')
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = c.fetchall()
print("=== TABLAS ACTUALES ===")
for t in tables:
    print(f"  - {t[0]}")
    c.execute(f"SELECT COUNT(*) FROM {t[0]}")
    count = c.fetchone()[0]
    print(f"    Registros: {count}")
print(f"\nTotal: {len(tables)} tablas")
conn.close()
