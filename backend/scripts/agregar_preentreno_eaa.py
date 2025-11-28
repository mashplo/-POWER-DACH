# MOVIDO desde backend/backend/agregar_preentreno_eaa.py
from backend.database import get_db

nuevo_preentreno = {
    "title": "EAA XPRESS 400G - SCITEC NUTRITION",
    "description": "...",
    "price": 129.00,
    "images": "http://127.0.0.1:8000/assets/productos/156001-1600-auto.webp,http://127.0.0.1:8000/assets/productos/156188-1600-auto.webp",
    "category": "Aminoácidos EAA"
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
    print("✅ Pre-entreno EAA agregado")
else:
    print("⚠️ Ya existe")

conn.close()
