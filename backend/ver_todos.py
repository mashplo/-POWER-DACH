import sqlite3

conn = sqlite3.connect('proteinas.db')
cursor = conn.cursor()

print('=== TODOS LOS PRODUCTOS (PROTEÍNAS) ===')
cursor.execute('SELECT id, title, price FROM productos')
productos = cursor.fetchall()
print(f'Total: {len(productos)}')
for p in productos:
    print(f'ID {p[0]}: {p[1]} - S/{p[2]}')

print('\n=== TODAS LAS CREATINAS ===')
cursor.execute('SELECT id, title, price FROM creatinas')
creatinas = cursor.fetchall()
print(f'Total: {len(creatinas)}')
for c in creatinas:
    print(f'ID {c[0]}: {c[1]} - S/{c[2]}')

print('\n=== TODOS LOS PRE-ENTRENOS ===')
cursor.execute('SELECT id, title, price FROM preentrenos')
preentrenos = cursor.fetchall()
print(f'Total: {len(preentrenos)}')
for p in preentrenos:
    print(f'ID {p[0]}: {p[1]} - S/{p[2]}')

conn.close()
