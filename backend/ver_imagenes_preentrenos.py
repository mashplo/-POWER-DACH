import sqlite3

conn = sqlite3.connect('proteinas.db')
cursor = conn.cursor()

cursor.execute('SELECT id, title, images FROM preentrenos')
preentrenos = cursor.fetchall()

print('Pre-entrenos y sus imágenes:')
for p in preentrenos:
    print(f'\nID {p[0]}: {p[1]}')
    print(f'  Imágenes: {p[2]}')

conn.close()
