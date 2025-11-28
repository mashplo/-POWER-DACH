# MOVIDO desde backend/backend/agregar_preentreno_gold.py
from backend.database import get_db

nuevo_preentreno = {
    "title": "GOLD STANDARD PRE ADVANCED 400G - OPTIMUM NUTRITION",
    "description": "...",
    "price": 169.00,
    "images": "http://127.0.0.1:8000/assets/productos/158097-1600-auto.webp,http://127.0.0.1:8000/assets/productos/158098-1600-auto.webp",
    "category": "Pre-Entreno Avanzado"
}

conn = get_db()
cursor = conn.cursor()

cursor.execute("SELECT * FROM preentrenos WHERE title = ?", (nuevo_preentreno["title"],))
if not cursor.fetchone():
    cursor.execute(
        """
        INSERT INTO preentrenos (title, description, price, images, category)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            nuevo_preentreno["title"],
            nuevo_preentreno["description"],
            nuevo_preentreno["price"],
            nuevo_preentreno["images"],
            nuevo_preentreno["category"],
        ),
    )
    conn.commit()
    print("✅ Pre-entreno Gold agregado")
else:
    print("⚠️ Ya existe")

conn.close()
