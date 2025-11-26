import sqlite3

conn = sqlite3.connect('proteinas.db')
cursor = conn.cursor()

print('=== TABLAS EN LA BASE DE DATOS ===')
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tablas = cursor.fetchall()
for tabla in tablas:
    print(f'- {tabla[0]}')
    cursor.execute(f'SELECT COUNT(*) FROM {tabla[0]}')
    count = cursor.fetchone()[0]
    print(f'  Total registros: {count}')

conn.close()
