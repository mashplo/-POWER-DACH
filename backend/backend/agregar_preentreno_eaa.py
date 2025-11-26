#!/usr/bin/env python3
"""Script para agregar EAA XPRESS 400G - SCITEC NUTRITION"""

import sqlite3
from backend.database import get_db

# Datos del nuevo pre-entreno
nuevo_preentreno = {
    "title": "EAA XPRESS 400G - SCITEC NUTRITION",
    "description": """Aminoácidos esenciales + electrolitos para recuperación, energía y rendimiento muscular. Ideal como intra o post entreno. Recuperación total en cada sorbo. El suplemento EAA Xpress 400g de Scitec Nutrition es una mezcla de aminoácidos esenciales diseñada para favorecer la recuperación y el crecimiento muscular, con la proporción ideal recomendada por la Organización Mundial de la Salud (OMS). El envase de 400 g proporciona 40 porciones de 10 g cada una.

Composición y Beneficios:
Este producto proporciona el espectro completo de los 9 aminoácidos esenciales (EAA, por sus siglas en inglés), que el cuerpo humano no puede sintetizar por sí mismo y que deben obtenerse a través de la dieta o suplementos.
• Espectro completo de EAA: Cada porción de 10 g contiene 7160 mg de EAA, de los cuales 3400 mg son BCAA (leucina, isoleucina, valina).
• Proporción recomendada por la OMS: La proporción de aminoácidos esenciales se ajusta a las directrices de la OMS, asegurando un aporte equilibrado para las necesidades de un estilo de vida activo.
• Beneficios musculares: Los EAA son los componentes básicos de las proteínas, por lo que su consumo apoya la construcción y reparación muscular, ayuda a prevenir el catabolismo y acelera la recuperación después del ejercicio intenso.
• Apto para dietas controladas: Es un suplemento sin gluten, sin azúcar y sin lactosa (en la bebida preparada).
• Electrolitos: Algunas versiones (como la tropical y sandía-fresa) pueden contener extracto de pimiento de cayena, y en general, el producto está ideado para ser utilizado con electrolitos para favorecer la hidratación.

Uso Recomendado y Opciones de Compra:
• Modo de uso: Mezcle 1 porción (10 g, equivalente a aproximadamente 3/4 de cucharada medidora) con 400 ml de agua fría.
• Momento de consumo: Se puede tomar antes o durante el entrenamiento para un rendimiento óptimo y prevención del catabolismo. En días de descanso, se sugiere consumir una dosis entre comidas para apoyar la recuperación continua.""",
    "price": 129.00,
    "images": "http://127.0.0.1:8000/assets/productos/156001-1600-auto.webp,http://127.0.0.1:8000/assets/productos/156188-1600-auto.webp",
    "category": "Aminoácidos EAA"
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
