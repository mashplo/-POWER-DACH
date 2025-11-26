import sqlite3

def actualizar_categorias():
    conn = sqlite3.connect('proteinas.db')
    cursor = conn.cursor()
    
    # Actualizar todas las proteínas a categoría "Proteína"
    cursor.execute('''
        UPDATE productos 
        SET category = 'Proteína' 
        WHERE category IN ('Whey Protein', 'Whey Isolate', 'Mass Gainer', 'Proteína Vegana')
    ''')
    
    # Actualizar todas las creatinas a categoría "Creatina"
    cursor.execute('''
        UPDATE creatinas 
        SET category = 'Creatina'
    ''')
    
    # Actualizar todos los pre-entrenos a categoría "Pre-Entreno"
    cursor.execute('''
        UPDATE preentrenos 
        SET category = 'Pre-Entreno'
    ''')
    
    conn.commit()
    
    print("✅ Categorías actualizadas correctamente\n")
    
    # Verificar productos
    print("=== PRODUCTOS (Proteínas) ===")
    cursor.execute("SELECT id, title, category FROM productos")
    for row in cursor.fetchall():
        print(f"ID {row[0]}: {row[1]} → {row[2]}")
    
    print(f"\nTotal proteínas: {cursor.rowcount}")
    
    # Verificar creatinas
    print("\n=== CREATINAS ===")
    cursor.execute("SELECT id, title, category FROM creatinas")
    for row in cursor.fetchall():
        print(f"ID {row[0]}: {row[1]} → {row[2]}")
    
    print(f"\nTotal creatinas: {cursor.rowcount}")
    
    # Verificar pre-entrenos
    print("\n=== PRE-ENTRENOS ===")
    cursor.execute("SELECT id, title, category FROM preentrenos")
    for row in cursor.fetchall():
        print(f"ID {row[0]}: {row[1]} → {row[2]}")
    
    print(f"\nTotal pre-entrenos: {cursor.rowcount}")
    
    conn.close()

if __name__ == "__main__":
    actualizar_categorias()
