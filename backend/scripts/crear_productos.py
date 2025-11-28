# MOVIDO desde backend/backend/crear_productos.py
from backend.database import get_db, inicializar_db

def crear_proteinas_ejemplo():
    inicializar_db()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM productos")
    if cursor.fetchone()[0] > 0:
        print("Ya hay proteínas en la base de datos")
        conn.close()
        return
    proteinas = [
        {"title": "Whey Protein Gold Standard", "description": "...", "price": 120.00, "images": "...", "category": "Whey Protein"},
    ]
    for p in proteinas:
        cursor.execute(
            """
            INSERT INTO productos (title, description, price, images, category)
            VALUES (?, ?, ?, ?, ?)
            """,
            (p["title"], p["description"], p["price"], p["images"], p["category"]),
        )
    conn.commit()
    conn.close()
    print("¡Proteínas de ejemplo creadas exitosamente!")

if __name__ == "__main__":
    crear_proteinas_ejemplo()
