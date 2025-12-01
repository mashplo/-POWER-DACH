#!/usr/bin/env python3
"""Script para agregar HOT BLOOD HARDCORE 700G - SCITEC NUTRITION"""

import sqlite3
from backend.database import get_db

# Datos del nuevo pre-entreno
nuevo_preentreno = {
    "title": "HOT BLOOD HARDCORE 700G - SCITEC NUTRITION",
    "description": """Pre-entreno termogénico con cafeína, beta alanina y creatina. Energía extrema, enfoque láser y más fuerza desde la primera toma. Tu nuevo ritual de poder. El suplemento Hot Blood Hardcore 700g de Scitec Nutrition es un potente pre-entrenamiento con una fórmula integral diseñada para maximizar la energía, la concentración y el rendimiento muscular durante entrenamientos de alta intensidad. El envase de 700 g ofrece aproximadamente 28 porciones (basado en un tamaño de porción de 25g, o 56 porciones si se usa la mitad de la dosis recomendada de 12.5g).

Ingredientes Clave y Beneficios:
La fórmula de Hot Blood Hardcore incluye una "matriz" de ingredientes activos para un efecto multifacético:
• Creatina Monohidratada (3 g por porción de 25 g): Mejora el rendimiento físico durante series cortas y repetitivas de ejercicio de alta intensidad, como el levantamiento de pesas.
• Beta-Alanina (1.6 g por porción de 25 g): Ayuda a retrasar la aparición de la fatiga muscular, lo que permite prolongar el entrenamiento y aumentar la resistencia.
• L-Citrulina y L-Arginina: Estos aminoácidos favorecen la producción de óxido nítrico, lo que mejora el flujo sanguíneo y el "bombeo" muscular (vascularización).
• Cafeína (300 mg por porción de 25 g): Proveniente de múltiples fuentes (anhidra, extracto de guaraná y té verde), proporciona un impulso de energía extremo y un enfoque mental "láser".
• Complejos Nootrópicos y Antioxidantes: Incluye vitaminas del grupo B, zinc, ginkgo biloba, vitaminas C y E, y extracto de pimienta negra (BioPerine®) para apoyar la función nerviosa, la función mental normal y proteger las células del estrés oxidativo.
• Mezcla de Electrolitos: Contiene calcio, sodio y magnesio para ayudar a reponer los minerales perdidos a través del sudor y prevenir los calambres musculares.

Uso Recomendado y Precauciones:
• Uso Sugerido: Mezclar una porción (25 g, aproximadamente 2 cacitos) con 400 ml de agua fría. La bebida es ligeramente carbonatada, así que se recomienda abrir la tapa del shaker cada 5 segundos al agitar para liberar la presión.
• Momento de Consumo: Consumir una porción 30 minutos antes del entrenamiento.
• Advertencias: No se recomienda para niños, mujeres embarazadas o en período de lactancia, ni personas con afecciones médicas conocidas o sensibilidad a la cafeína. No exceder la dosis diaria recomendada ni consumir con el estómago vacío.""",
    "price": 159.00,
    "images": "http://127.0.0.1:8000/assets/productos/155930-1600-auto.webp,http://127.0.0.1:8000/assets/productos/156424-1600-auto.webp",
    "category": "Pre-Entreno Termogénico"
}

# Conectar a la base de datos
conn = get_db()
cursor = conn.cursor()

# Verificar si ya existe un pre-entreno con el mismo título
cursor.execute("SELECT * FROM preentrenos WHERE title = ?", (nuevo_preentreno["title"],))
existe = cursor.fetchone()

if existe:
    print(f"⚠️  Ya existe un pre-entreno con el título: {nuevo_preentreno['title']}")
    print(f"   ID: {existe['id']}")
else:
    # Insertar el nuevo pre-entreno
    cursor.execute("""
        INSERT INTO preentrenos (title, description, price, images, category)
        VALUES (?, ?, ?, ?, ?)
    """, (
        nuevo_preentreno["title"],
        nuevo_preentreno["description"],
        nuevo_preentreno["price"],
        nuevo_preentreno["images"],
        nuevo_preentreno["category"]
    ))
    
    conn.commit()
    nuevo_id = cursor.lastrowid
    
    print(f"✅ ¡Pre-entreno agregado exitosamente!")
    print(f"   ID: {nuevo_id}")
    print(f"   Título: {nuevo_preentreno['title']}")
    print(f"   Precio: S/{nuevo_preentreno['price']}")
    print(f"   Categoría: {nuevo_preentreno['category']}")

# Mostrar total de pre-entrenos
cursor.execute("SELECT COUNT(*) FROM preentrenos")
total = cursor.fetchone()[0]
print(f"\n📊 Total de pre-entrenos en la base de datos: {total}")

conn.close()
