import sqlite3

conn = sqlite3.connect('proteinas.db')
cursor = conn.cursor()

print('=== PROTEÍNAS ===')
cursor.execute('SELECT id, title, price FROM proteinas')
proteinas = cursor.fetchall()
print(f'Total: {len(proteinas)}')
for p in proteinas:
    print(f'ID {p[0]}: {p[1]} - S/{p[2]}')

print('\n=== CREATINAS ===')
cursor.execute('SELECT id, title, price FROM creatinas')
creatinas = cursor.fetchall()
print(f'Total: {len(creatinas)}')
for c in creatinas:
    print(f'ID {c[0]}: {c[1]} - S/{c[2]}')

print('\n=== PRE-ENTRENOS ===')
cursor.execute('SELECT id, title, price FROM preentrenos')
preentrenos = cursor.fetchall()
print(f'Total: {len(preentrenos)}')
for p in preentrenos:
    print(f'ID {p[0]}: {p[1]} - S/{p[2]}')

conn.close()
