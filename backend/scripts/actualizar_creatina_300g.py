import sqlite3

conn = sqlite3.connect('proteinas.db')
cursor = conn.cursor()

# Verificar qué creatina es la de 300G
cursor.execute("SELECT id, title, price FROM creatinas")
creatinas = cursor.fetchall()
print("Creatinas actuales:")
for c in creatinas:
    print(f"  ID {c[0]}: {c[1]} - S/{c[2]}")

# Buscar la de 300G (probablemente ID 2 o 3)
cursor.execute("SELECT id FROM creatinas WHERE title LIKE '%300%'")
result = cursor.fetchone()

if result:
    id_300g = result[0]
    print(f"\n✓ Encontrada creatina 300G con ID: {id_300g}")
    
    nueva_descripcion = """La Creatina 100% 300 G de Optimum Nutrition es un suplemento popular de monohidrato de creatina micronizada pura, diseñado para apoyar el aumento de fuerza, potencia y rendimiento muscular durante ejercicios de alta intensidad. Es un polvo sin sabor que se mezcla fácilmente."""
    
    cursor.execute("UPDATE creatinas SET description = ? WHERE id = ?", (nueva_descripcion, id_300g))
    conn.commit()
    print(f"✓ Descripción actualizada para creatina ID {id_300g}")
else:
    print("\n⚠ No se encontró creatina de 300G")

conn.close()
