import sqlite3
conn = sqlite3.connect('c:/Users/josen/OneDrive/Desktop/-POWER-DACH-master/backend/power_dach.db')
c = conn.cursor()

# Crear registro en proteinas para producto 23
c.execute('''INSERT INTO proteinas (producto_id, tipo_proteina, proteina_por_porcion, calorias_por_porcion, porciones) 
             VALUES (23, 'Whey', 25, 120, 30)''')
conn.commit()
print('Registro creado en proteinas para producto ID:23')

# Verificar
c.execute('SELECT * FROM proteinas WHERE producto_id = 23')
print('Verificacion:', c.fetchone())

conn.close()
