import sqlite3

conn = sqlite3.connect('proteinas.db')
cursor = conn.cursor()

print('=== CATEGORÍAS DE LOS PRODUCTOS ===')
cursor.execute('SELECT id, title, category FROM productos')
productos = cursor.fetchall()
for p in productos:
    print(f'ID {p[0]}: {p[1]}')
    print(f'  Categoría: "{p[2]}"')
    print()

conn.close()
