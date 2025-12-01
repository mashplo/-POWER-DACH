"""
Script para poblar la base de datos MySQL en Railway con datos iniciales.
Ejecutar este script después del primer deploy para cargar productos.
"""
import os
from sqlalchemy import text
from backend.database import engine, get_conn

def seed_productos():
    """Inserta productos de ejemplo en la tabla productos."""
    productos = [
        {
            "title": "Whey Protein Gold Standard",
            "description": "Proteína de suero de leche premium, 24g de proteína por porción",
            "price": 159.90,
            "images": "http://localhost:8000/assets/productos/whey-gold.png",
            "category": "Proteína"
        },
        # Agrega más productos aquí
    ]
    
    with get_conn() as conn:
        for producto in productos:
            conn.execute(
                text("""
                    INSERT INTO productos (title, description, price, images, category)
                    VALUES (:title, :description, :price, :images, :category)
                """),
                producto
            )
        conn.commit()
    print(f"✓ {len(productos)} productos insertados")

def seed_creatinas():
    """Inserta creatinas de ejemplo."""
    creatinas = [
        {
            "title": "Creatina Monohidrato 300g",
            "description": "Creatina pura micronizada",
            "price": 89.90,
            "images": "http://localhost:8000/assets/productos/creatina-mono.png",
            "category": "Creatina"
        },
    ]
    
    with get_conn() as conn:
        for creatina in creatinas:
            conn.execute(
                text("""
                    INSERT INTO creatinas (title, description, price, images, category)
                    VALUES (:title, :description, :price, :images, :category)
                """),
                creatina
            )
        conn.commit()
    print(f"✓ {len(creatinas)} creatinas insertadas")

def seed_preentrenos():
    """Inserta pre-entrenos de ejemplo."""
    preentrenos = [
        {
            "title": "Pre-Entreno C4 Original",
            "description": "Energía explosiva para tus entrenamientos",
            "price": 129.90,
            "images": "http://localhost:8000/assets/productos/c4-original.png",
            "category": "Pre-Entreno"
        },
    ]
    
    with get_conn() as conn:
        for preentreno in preentrenos:
            conn.execute(
                text("""
                    INSERT INTO preentrenos (title, description, price, images, category)
                    VALUES (:title, :description, :price, :images, :category)
                """),
                preentreno
            )
        conn.commit()
    print(f"✓ {len(preentrenos)} pre-entrenos insertados")

if __name__ == "__main__":
    print("🌱 Poblando base de datos...")
    print(f"Conectando a: {os.getenv('DATABASE_URL', 'SQLite local')}")
    
    try:
        seed_productos()
        seed_creatinas()
        seed_preentrenos()
        print("\n✅ Base de datos poblada exitosamente!")
    except Exception as e:
        print(f"\n❌ Error al poblar base de datos: {e}")
        raise
