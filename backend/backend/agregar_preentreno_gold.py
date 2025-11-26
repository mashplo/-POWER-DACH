#!/usr/bin/env python3
"""Script para agregar GOLD STANDARD PRE ADVANCED 400G - OPTIMUM NUTRITION"""

import sqlite3
from backend.database import get_db

# Datos del nuevo pre-entreno
nuevo_preentreno = {
    "title": "GOLD STANDARD PRE ADVANCED 400G - OPTIMUM NUTRITION",
    "description": """Pre-entreno avanzado y diseñado para aumentar energía, enfoque y rendimiento muscular. Su fórmula avanzada combina estimulantes y compuestos ergogénicos para maximizar tus entrenamientos y potenciar la resistencia, fuerza y concentración desde la primera repetición. El suplemento GOLD STANDARD PRE ADVANCED 400G de Optimum Nutrition es una fórmula pre-entrenamiento avanzada diseñada para proporcionar energía intensa, concentración y mejorar el rendimiento muscular durante el ejercicio. La presentación de 400 g contiene aproximadamente 20 porciones.

Ingredientes Clave y Beneficios:
Este producto está formulado con ingredientes clave para potenciar los entrenamientos, con las siguientes cantidades por porción (aprox. 20g):
• L-citrulina micronizada (6 g): Favorece la vasodilatación para un mayor flujo sanguíneo y un bombeo muscular intenso.
• Monohidrato de creatina (5 g): Ayuda a aumentar el rendimiento y la fuerza muscular cuando se usa de manera constante a lo largo del tiempo.
• Beta-alanina (3,2 g): Contribuye a la resistencia y a entrenar más duro y durante más tiempo. Puede causar una sensación de hormigueo temporal e inofensiva.
• Cafeína (300 mg): Proveniente de fuentes naturales (hoja de té y/o grano de café), ayuda a mejorar la concentración y el estado de alerta.
• Mezcla de electrolitos (650 mg): Incluye citrato de sodio, óxido de magnesio y cloruro de potasio para apoyar la hidratación.
• Vitaminas C y D, Calcio, Magnesio y Sodio: Contribuyen al metabolismo energético normal y al bienestar general.

Modo de Uso y Precauciones:
• Uso Sugerido: Mezclar una cucharada medidora (aprox. 20 g) en 180-240 ml de agua fría y consumir de 15 a 30 minutos antes de hacer ejercicio.
• Advertencias: Es un producto de alta concentración y se recomienda probar la tolerancia. No exceder la dosis diaria recomendada ni combinar con otras fuentes de cafeína. No es apto para menores de 18 años, mujeres embarazadas o lactantes, ni personas sensibles a la cafeína o la beta-alanina.""",
    "price": 169.00,
    "images": "http://127.0.0.1:8000/assets/productos/158097-1600-auto.webp,http://127.0.0.1:8000/assets/productos/158098-1600-auto.webp",
    "category": "Pre-Entreno Avanzado"
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
    print(f"   Precio: ${nuevo_preentreno['price']}")
    print(f"   Categoría: {nuevo_preentreno['category']}")

# Mostrar total de pre-entrenos
cursor.execute("SELECT COUNT(*) FROM preentrenos")
total = cursor.fetchone()[0]
print(f"\n📊 Total de pre-entrenos en la base de datos: {total}")

conn.close()
