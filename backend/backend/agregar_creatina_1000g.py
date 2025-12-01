#!/usr/bin/env python3
"""Script para agregar CREATINA MONOHIDRATADA 5G - 1000G NUTREX a la base de datos"""

import sqlite3
from backend.database import get_db

# Datos de la nueva creatina
nueva_creatina = {
    "title": "CREATINA MONOHIDRATADA 5G - 1000G NUTREX",
    "description": """La Creatina Monohidratada 5G - 1000G de Nutrex Research es un suplemento de creatina monohidrato ultra pura y micronizada, diseñado para aumentar significativamente la fuerza, la potencia y el rendimiento muscular. Cada envase de 1 kg ofrece aproximadamente 200 servicios, con 5 gramos de creatina por servicio.

Características y Beneficios Principales:
• Pureza y Calidad: Contiene 100% monohidrato de creatina pura de alta calidad. Es uno de los suplementos más estudiados y efectivos para atletas y entusiastas del fitness.
• Micronización: El polvo es micronizado, lo que reduce el tamaño de las partículas para una mejor solubilidad y una absorción más rápida por parte del organismo, minimizando la posibilidad de malestar estomacal.
• Aumento del Rendimiento Físico: Ayuda a regenerar el ATP, la molécula de energía celular, permitiendo entrenamientos más intensos, explosivos y duraderos, y mejorando la resistencia.
• Crecimiento Muscular Magro: El uso constante, combinado con ejercicio de resistencia, apoya la ganancia de masa muscular y acelera los tiempos de recuperación.
• Versátil y Sin Sabor: Es un polvo sin sabor, lo que facilita su mezcla con agua, jugos, o tus batidos pre o post-entrenamiento favoritos sin alterar su gusto.
• Libre de Aditivos: No contiene azúcares, carbohidratos ni grasas, lo que la hace compatible con dietas específicas para definir o aumentar masa muscular magra.

Uso Sugerido:
• Dosis: Una porción típica es de 5 gramos (equivalente a 1 scoop o cucharada).
• Instrucciones: Mezclar 1 scoop en 8 a 12 onzas de agua (aproximadamente 240-350 ml) u otra bebida y consumir inmediatamente.
• Momento de Consumo: Se puede tomar antes o después del entrenamiento. En días de descanso, se puede tomar una porción por la mañana. La consistencia diaria es clave para saturar los músculos y obtener beneficios óptimos.""",
    "price": 145.00,
    "images": "http://127.0.0.1:8000/assets/productos/157947-1600-auto.webp,http://127.0.0.1:8000/assets/productos/157948-1600-auto.webp",
    "category": "Monohidrato"
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
