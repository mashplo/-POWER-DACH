"""
Script para inicializar el entorno de desarrollo local.
Crea las tablas y agrega datos de prueba.

Ejecutar con: python init_local.py
"""
import os
import sys

# Asegurar que estamos usando SQLite local
os.environ.pop("DATABASE_URL", None)

from src.database import engine, metadata, inicializar_db, get_conn
from sqlalchemy import text
import bcrypt

def crear_admin():
    """Crear usuario administrador por defecto."""
    email = "admin@powertech.com"
    password = "admin123"
    nombre = "Administrador"
    
    # Hash del password
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    with get_conn() as conn:
        # Verificar si ya existe
        result = conn.execute(text("SELECT id FROM usuarios WHERE email = :email"), {"email": email}).first()
        if result:
            print(f"⚠️ Usuario admin ya existe (ID: {result.id})")
            return
        
        conn.execute(
            text("INSERT INTO usuarios (nombre, email, password, role) VALUES (:nombre, :email, :password, :role)"),
            {"nombre": nombre, "email": email, "password": hashed, "role": "admin"}
        )
        conn.commit()
        print(f"✅ Usuario administrador creado: {email} / {password}")

def crear_usuario_prueba():
    """Crear usuario de prueba."""
    email = "usuario@test.com"
    password = "test123"
    nombre = "Usuario Prueba"
    
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    with get_conn() as conn:
        result = conn.execute(text("SELECT id FROM usuarios WHERE email = :email"), {"email": email}).first()
        if result:
            print(f"⚠️ Usuario de prueba ya existe (ID: {result.id})")
            return
        
        conn.execute(
            text("INSERT INTO usuarios (nombre, email, password, role) VALUES (:nombre, :email, :password, :role)"),
            {"nombre": nombre, "email": email, "password": hashed, "role": "user"}
        )
        conn.commit()
        print(f"✅ Usuario de prueba creado: {email} / {password}")

def seed_productos():
    """Insertar productos de ejemplo."""
    productos = [
        {
            "title": "Whey Protein Gold Standard 5lb",
            "description": "Proteína de suero de leche premium con 24g de proteína por porción. Sabor chocolate.",
            "price": 159900,
            "images": "/assets/productos/whey-gold.png",
            "category": "Proteína Whey"
        },
        {
            "title": "ISO 100 Dymatize 3lb",
            "description": "Proteína aislada de suero hidrolizada. Ultra pura y de rápida absorción.",
            "price": 189900,
            "images": "/assets/productos/iso100.png",
            "category": "Proteína Isolada"
        },
        {
            "title": "Mass Gainer Serious Mass 12lb",
            "description": "Ganador de masa con 1250 calorías y 50g de proteína por porción.",
            "price": 199900,
            "images": "/assets/productos/serious-mass.png",
            "category": "Ganador de Masa"
        },
        {
            "title": "Casein Gold Standard 4lb",
            "description": "Proteína de liberación lenta ideal para antes de dormir.",
            "price": 169900,
            "images": "/assets/productos/casein-gold.png",
            "category": "Proteína Caseína"
        }
    ]
    
    with get_conn() as conn:
        # Verificar si ya hay productos
        count = conn.execute(text("SELECT COUNT(*) FROM productos")).scalar()
        if count > 0:
            print(f"⚠️ Ya existen {count} productos en la base de datos")
            return
        
        for producto in productos:
            conn.execute(
                text("INSERT INTO productos (title, description, price, images, category) VALUES (:title, :description, :price, :images, :category)"),
                producto
            )
        conn.commit()
        print(f"✅ {len(productos)} productos insertados")

def seed_creatinas():
    """Insertar creatinas de ejemplo."""
    creatinas = [
        {
            "title": "Creatina Monohidrato 300g",
            "description": "Creatina pura micronizada. 5g por porción para máxima fuerza.",
            "price": 89900,
            "images": "/assets/productos/creatina-mono.png",
            "category": "Monohidrato"
        },
        {
            "title": "Creatina HCL 120 caps",
            "description": "Creatina hidroclórica de alta absorción sin retención de líquidos.",
            "price": 119900,
            "images": "/assets/productos/creatina-hcl.png",
            "category": "HCL"
        },
        {
            "title": "Cell Tech Creatine 3lb",
            "description": "Creatina con sistema de transporte de carbohidratos.",
            "price": 149900,
            "images": "/assets/productos/cell-tech.png",
            "category": "Con Transporte"
        }
    ]
    
    with get_conn() as conn:
        count = conn.execute(text("SELECT COUNT(*) FROM creatinas")).scalar()
        if count > 0:
            print(f"⚠️ Ya existen {count} creatinas en la base de datos")
            return
        
        for creatina in creatinas:
            conn.execute(
                text("INSERT INTO creatinas (title, description, price, images, category) VALUES (:title, :description, :price, :images, :category)"),
                creatina
            )
        conn.commit()
        print(f"✅ {len(creatinas)} creatinas insertadas")

def seed_preentrenos():
    """Insertar pre-entrenos de ejemplo."""
    preentrenos = [
        {
            "title": "C4 Original Pre-Workout",
            "description": "Energía explosiva con beta-alanina y cafeína. 30 porciones.",
            "price": 129900,
            "images": "/assets/productos/c4-original.png",
            "category": "Pre-Entreno"
        },
        {
            "title": "Pre JYM Advanced",
            "description": "Fórmula completa con citrulina, beta-alanina y BCAAs.",
            "price": 169900,
            "images": "/assets/productos/pre-jym.png",
            "category": "Pre-Entreno Avanzado"
        },
        {
            "title": "Pump Extreme NO2",
            "description": "Máximo bombeo muscular con arginina y citrulina.",
            "price": 99900,
            "images": "/assets/productos/pump-extreme.png",
            "category": "Pump"
        }
    ]
    
    with get_conn() as conn:
        count = conn.execute(text("SELECT COUNT(*) FROM preentrenos")).scalar()
        if count > 0:
            print(f"⚠️ Ya existen {count} pre-entrenos en la base de datos")
            return
        
        for preentreno in preentrenos:
            conn.execute(
                text("INSERT INTO preentrenos (title, description, price, images, category) VALUES (:title, :description, :price, :images, :category)"),
                preentreno
            )
        conn.commit()
        print(f"✅ {len(preentrenos)} pre-entrenos insertados")

def main():
    print("=" * 50)
    print("🚀 INICIALIZANDO ENTORNO DE DESARROLLO LOCAL")
    print("=" * 50)
    print()
    
    # Paso 1: Crear tablas
    print("📊 Paso 1: Creando tablas...")
    inicializar_db()
    print()
    
    # Paso 2: Crear usuarios
    print("👤 Paso 2: Creando usuarios...")
    crear_admin()
    crear_usuario_prueba()
    print()
    
    # Paso 3: Insertar datos de prueba
    print("📦 Paso 3: Insertando productos de prueba...")
    seed_productos()
    seed_creatinas()
    seed_preentrenos()
    print()
    
    print("=" * 50)
    print("✅ INICIALIZACIÓN COMPLETADA")
    print("=" * 50)
    print()
    print("Credenciales de prueba:")
    print("  Admin: admin@powertech.com / admin123")
    print("  Usuario: usuario@test.com / test123")
    print()
    print("Para iniciar el servidor:")
    print("  cd backend")
    print("  uvicorn backend.app:app --reload")

if __name__ == "__main__":
    main()
