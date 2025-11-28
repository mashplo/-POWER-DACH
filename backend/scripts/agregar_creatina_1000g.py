# MOVIDO desde backend/backend/agregar_creatina_1000g.py
from backend.database import get_db

nueva_creatina = {
    "title": "CREATINA MONOHIDRATADA 5G - 1000G NUTREX",
    "description": "...",
    "price": 145.00,
    "images": "http://127.0.0.1:8000/assets/productos/157947-1600-auto.webp,http://127.0.0.1:8000/assets/productos/157948-1600-auto.webp",
    "category": "Monohidrato"
}

conn = get_db()
cursor = conn.cursor()

cursor.execute("SELECT * FROM creatinas WHERE title = ?", (nueva_creatina["title"],))
existe = cursor.fetchone()

if not existe:
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
    print("✅ Creatina agregada")
else:
    print("⚠️ Ya existe")

cursor.execute("SELECT COUNT(*) FROM creatinas")
print("Total:", cursor.fetchone()[0])

conn.close()
