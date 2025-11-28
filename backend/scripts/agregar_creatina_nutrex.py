# MOVIDO desde backend/backend/agregar_creatina_nutrex.py
from backend.database import get_db

nueva_creatina = {
    "title": "CREATINA MICRONIZADA -300G NUTREX",
    "description": "...",
    "price": 95.00,
    "images": "http://127.0.0.1:8000/assets/productos/158064-1600-auto.webp,http://127.0.0.1:8000/assets/productos/158066-1600-auto.webp,http://127.0.0.1:8000/assets/productos/158067-1600-auto.webp",
    "category": "Micronizada"
}

conn = get_db()
cursor = conn.cursor()

cursor.execute("SELECT * FROM creatinas WHERE title = ?", (nueva_creatina["title"],))
if not cursor.fetchone():
    cursor.execute(
        """
        INSERT INTO creatinas (title, description, price, images, category)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            nueva_creatina["title"],
            nueva_creatina["description"],
            nueva_creatina["price"],
            nueva_creatina["images"],
            nueva_creatina["category"],
        ),
    )
    conn.commit()
    print("✅ Creatina Nutrex agregada")
else:
    print("⚠️ Ya existe")

conn.close()
