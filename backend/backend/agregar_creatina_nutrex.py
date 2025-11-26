#!/usr/bin/env python3
"""Script para agregar CREATINA MICRONIZADA -300G NUTREX a la base de datos"""

import sqlite3
from backend.database import get_db

# Datos de la nueva creatina
nueva_creatina = {
    "title": "CREATINA MICRONIZADA -300G NUTREX",
    "description": """La Creatina Monohidratada Micronizada de Nutrex Research (presentación 300 g) es un suplemento de creatina monohidrato ultra pura y de rápida absorción, diseñada para aumentar la fuerza, la potencia y el rendimiento muscular. 

Detalles y Beneficios del Producto:
• Pureza y Calidad: Contiene 100% monohidrato de creatina pura de alta calidad, un ingrediente ampliamente estudiado y de eficacia probada.
• Micronizada para Mejor Absorción: El proceso de micronización reduce el tamaño de las partículas del polvo, lo que mejora significativamente su solubilidad y absorción en el organismo, optimizando los resultados y reduciendo posibles molestias gastrointestinales o hinchazón.
• Aumento de Fuerza y Rendimiento: Ayuda a regenerar el ATP, la fuente de energía del organismo para los músculos, lo que permite realizar movimientos explosivos y series de ejercicio más intensas y duraderas.
• Promueve el Crecimiento Muscular: Favorece la ganancia de masa muscular magra y acelera los tiempos de recuperación muscular.
• Perfil Nutricional Limpio: Es un polvo sin sabor (unflavored), libre de azúcar y aditivos, lo que facilita su mezcla con cualquier bebida sin alterar su gusto.
• Versatilidad y Facilidad de Uso: Se mezcla fácilmente con agua, jugos o batidos de proteínas sin dejar una textura arenosa.

Uso Sugerido:
Para obtener mejores resultados, se recomienda un consumo constante y diario:
• Dosis: Una porción típica es de 5 gramos (equivalente a una cucharada). El envase de 300 g rinde aproximadamente 60 servicios.
• Instrucciones: Mezclar una cucharada con aproximadamente 8 onzas (unos 240 ml) de agua fría u otra bebida y consumir inmediatamente. Se disuelve rápidamente con solo agitarla o removerla.
• Momento de Consumo: Se puede tomar en cualquier momento del día. La consistencia es más importante que el momento exacto. Consumir al menos 8 vasos de agua al día mientras se usa creatina es recomendable.""",
    "price": 95.00,
    "images": "http://127.0.0.1:8000/assets/productos/158064-1600-auto.webp,http://127.0.0.1:8000/assets/productos/158066-1600-auto.webp,http://127.0.0.1:8000/assets/productos/158067-1600-auto.webp",
    "category": "Micronizada"
}

# Conectar a la base de datos
conn = get_db()
cursor = conn.cursor()

# Verificar si ya existe una creatina con el mismo título
cursor.execute("SELECT * FROM creatinas WHERE title = ?", (nueva_creatina["title"],))
existe = cursor.fetchone()

if existe:
    print(f"⚠️  Ya existe una creatina con el título: {nueva_creatina['title']}")
    print(f"   ID: {existe['id']}")
else:
    # Insertar la nueva creatina
    cursor.execute("""
        INSERT INTO creatinas (title, description, price, images, category)
        VALUES (?, ?, ?, ?, ?)
    """, (
        nueva_creatina["title"],
        nueva_creatina["description"],
        nueva_creatina["price"],
        nueva_creatina["images"],
        nueva_creatina["category"]
    ))
    
    conn.commit()
    nuevo_id = cursor.lastrowid
    
    print(f"✅ ¡Creatina agregada exitosamente!")
    print(f"   ID: {nuevo_id}")
    print(f"   Título: {nueva_creatina['title']}")
    print(f"   Precio: ${nueva_creatina['price']}")
    print(f"   Categoría: {nueva_creatina['category']}")

# Mostrar total de creatinas
cursor.execute("SELECT COUNT(*) FROM creatinas")
total = cursor.fetchone()[0]
print(f"\n📊 Total de creatinas en la base de datos: {total}")

conn.close()
