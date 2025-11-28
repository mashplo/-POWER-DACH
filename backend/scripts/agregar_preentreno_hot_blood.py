# MOVIDO desde backend/backend/agregar_preentreno_hot_blood.py
from backend.database import get_db

nuevo_preentreno = {
    "title": "HOT BLOOD HARDCORE 700G - SCITEC NUTRITION",
    "description": "...",
    "price": 159.00,
    "images": "http://127.0.0.1:8000/assets/productos/155930-1600-auto.webp,http://127.0.0.1:8000/assets/productos/156424-1600-auto.webp",
    "category": "Pre-Entreno Termogénico"
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
    print("✅ Pre-entreno Hot Blood agregado")
else:
    print("⚠️ Ya existe")

conn.close()
