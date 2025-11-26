"""
Script para migrar datos desde SQLite local a MySQL en Railway.
Ejecutar ANTES de hacer el primer deploy para preservar los datos existentes.
"""
import sqlite3
import os
from sqlalchemy import text
from backend.database import engine, get_conn

# Configuración temporal para desarrollo local
# En Railway, usar las variables de entorno directamente
MYSQL_CONFIG = {
    "host": "mysql.railway.internal",
    "port": 3306,
    "user": "root",
    "password": "gtUvNuzREiIaLwZvgspAXRxFLaKLsvSu",
    "database": "railway"
}

def conectar_sqlite():
    """Conecta a la base de datos SQLite local."""
    conn = sqlite3.connect('proteinas.db')
    conn.row_factory = sqlite3.Row
    return conn

def migrar_productos():
    """Migra productos de SQLite a MySQL."""
    sqlite_conn = conectar_sqlite()
    sqlite_cursor = sqlite_conn.cursor()
    
    sqlite_cursor.execute("SELECT * FROM productos")
    productos = sqlite_cursor.fetchall()
    
    with get_conn() as mysql_conn:
        for producto in productos:
            mysql_conn.execute(
                text("""
                    INSERT INTO productos (id, title, description, price, images, category)
                    VALUES (:id, :title, :description, :price, :images, :category)
                    ON DUPLICATE KEY UPDATE
                        title = :title,
                        description = :description,
                        price = :price,
                        images = :images,
                        category = :category
                """),
                {
                    "id": producto["id"],
                    "title": producto["title"],
                    "description": producto["description"],
                    "price": producto["price"],
                    "images": producto["images"],
                    "category": producto["category"]
                }
            )
        mysql_conn.commit()
    
    sqlite_conn.close()
    print(f"✓ {len(productos)} productos migrados")

def migrar_creatinas():
    """Migra creatinas de SQLite a MySQL."""
    sqlite_conn = conectar_sqlite()
    sqlite_cursor = sqlite_conn.cursor()
    
    sqlite_cursor.execute("SELECT * FROM creatinas")
    creatinas = sqlite_cursor.fetchall()
    
    with get_conn() as mysql_conn:
        for creatina in creatinas:
            mysql_conn.execute(
                text("""
                    INSERT INTO creatinas (id, title, description, price, images, category)
                    VALUES (:id, :title, :description, :price, :images, :category)
                    ON DUPLICATE KEY UPDATE
                        title = :title,
                        description = :description,
                        price = :price,
                        images = :images,
                        category = :category
                """),
                {
                    "id": creatina["id"],
                    "title": creatina["title"],
                    "description": creatina["description"],
                    "price": creatina["price"],
                    "images": creatina["images"],
                    "category": creatina["category"]
                }
            )
        mysql_conn.commit()
    
    sqlite_conn.close()
    print(f"✓ {len(creatinas)} creatinas migradas")

def migrar_preentrenos():
    """Migra pre-entrenos de SQLite a MySQL."""
    sqlite_conn = conectar_sqlite()
    sqlite_cursor = sqlite_conn.cursor()
    
    sqlite_cursor.execute("SELECT * FROM preentrenos")
    preentrenos = sqlite_cursor.fetchall()
    
    with get_conn() as mysql_conn:
        for preentreno in preentrenos:
            mysql_conn.execute(
                text("""
                    INSERT INTO preentrenos (id, title, description, price, images, category)
                    VALUES (:id, :title, :description, :price, :images, :category)
                    ON DUPLICATE KEY UPDATE
                        title = :title,
                        description = :description,
                        price = :price,
                        images = :images,
                        category = :category
                """),
                {
                    "id": preentreno["id"],
                    "title": preentreno["title"],
                    "description": preentreno["description"],
                    "price": preentreno["price"],
                    "images": preentreno["images"],
                    "category": preentreno["category"]
                }
            )
        mysql_conn.commit()
    
    sqlite_conn.close()
    print(f"✓ {len(preentrenos)} pre-entrenos migrados")

def migrar_usuarios():
    """Migra usuarios de SQLite a MySQL."""
    sqlite_conn = conectar_sqlite()
    sqlite_cursor = sqlite_conn.cursor()
    
    try:
        sqlite_cursor.execute("SELECT * FROM usuarios")
        usuarios = sqlite_cursor.fetchall()
        
        with get_conn() as mysql_conn:
            for usuario in usuarios:
                mysql_conn.execute(
                    text("""
                        INSERT INTO usuarios (id, nombre, email, password)
                        VALUES (:id, :nombre, :email, :password)
                        ON DUPLICATE KEY UPDATE
                            nombre = :nombre,
                            email = :email,
                            password = :password
                    """),
                    {
                        "id": usuario["id"],
                        "nombre": usuario["nombre"],
                        "email": usuario["email"],
                        "password": usuario["password"]
                    }
                )
            mysql_conn.commit()
        
        print(f"✓ {len(usuarios)} usuarios migrados")
    except sqlite3.OperationalError:
        print("⚠ No hay usuarios para migrar (tabla vacía o no existe)")
    
    sqlite_conn.close()

if __name__ == "__main__":
    print("🔄 Iniciando migración de SQLite a MySQL...")
    print(f"MySQL Host: {MYSQL_CONFIG['host']}")
    print(f"MySQL DB: {MYSQL_CONFIG['database']}\n")
    
    # Verificar que DATABASE_URL esté configurada
    if not os.getenv("DATABASE_URL"):
        db_url = f"mysql+pymysql://{MYSQL_CONFIG['user']}:{MYSQL_CONFIG['password']}@{MYSQL_CONFIG['host']}:{MYSQL_CONFIG['port']}/{MYSQL_CONFIG['database']}"
        print(f"⚠ DATABASE_URL no configurada. Usando: {db_url[:50]}...\n")
        os.environ["DATABASE_URL"] = db_url
    
    try:
        # Primero crear las tablas en MySQL
        print("📋 Creando tablas en MySQL...")
        from backend.database import inicializar_db
        inicializar_db()
        print("✓ Tablas creadas\n")
        
        print("📦 Migrando datos...")
        migrar_productos()
        migrar_creatinas()
        migrar_preentrenos()
        migrar_usuarios()
        
        print("\n✅ ¡Migración completada exitosamente!")
        print("\n📌 Próximos pasos:")
        print("1. Verifica los datos en MySQL")
        print("2. Configura DATABASE_URL en Railway:")
        print(f"   mysql+pymysql://root:gtUvNuzREiIaLwZvgspAXRxFLaKLsvSu@mysql.railway.internal:3306/railway")
        print("3. Haz deploy del backend en Railway")
        
    except Exception as e:
        print(f"\n❌ Error durante la migración: {e}")
        import traceback
        traceback.print_exc()
        raise
