"""
Configuración de base de datos con SQLAlchemy.
Soporta MySQL (Railway) y SQLite (local development).
"""
import os
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float, Text

# Configurar DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")
FALLBACK_SQLITE_URL = "sqlite:///proteinas.db"

# Usar MySQL si está configurado, sino SQLite local
db_url = DATABASE_URL if DATABASE_URL else FALLBACK_SQLITE_URL

if '@' in db_url:
    prefix = db_url.split('@')[0]
    # Ej: mysql+pymysql://root:password -> ocultar password
    if '://' in prefix and ':' in prefix.rsplit('/',1)[-1]:
        creds_part = prefix.split('://',1)[1]
        if ':' in creds_part:
            user = creds_part.split(':',1)[0]
            print(f"📊 Usando base de datos: {db_url.split('://',1)[0]}://{user}:****@...")
        else:
            print(f"📊 Usando base de datos: {db_url.split('://',1)[0]}://{creds_part}@...")
    else:
        print("📊 Usando base de datos (credenciales ocultas)")
else:
    print(f"📊 Usando base de datos: {db_url}")

# Crear engine
engine = create_engine(db_url, echo=False)
metadata = MetaData()

# Definir tabla productos
productos = Table(
    'productos',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('title', String(255), nullable=False),
    Column('description', Text, nullable=False),
    Column('price', Float, nullable=False),
    Column('images', Text, nullable=False),
    Column('category', String(100), nullable=False)
)

# Definir tabla creatinas
creatinas = Table(
    'creatinas',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('title', String(255), nullable=False),
    Column('description', Text, nullable=False),
    Column('price', Float, nullable=False),
    Column('images', Text, nullable=False),
    Column('category', String(100), nullable=False)
)

# Definir tabla preentrenos
preentrenos = Table(
    'preentrenos',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('title', String(255), nullable=False),
    Column('description', Text, nullable=False),
    Column('price', Float, nullable=False),
    Column('images', Text, nullable=False),
    Column('category', String(100), nullable=False)
)

# Definir tabla usuarios
usuarios = Table(
    'usuarios',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('nombre', String(255), nullable=False),
    Column('email', String(255), nullable=False, unique=True),
<<<<<<< HEAD
    Column('password', String(255), nullable=False),
    Column('role', String(50), nullable=False, server_default='user')
)

# Definir tabla boletas
boletas = Table(
    'boletas',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, nullable=False),
    Column('total', Float, nullable=False),
    Column('fecha', String(100), nullable=False) # Guardaremos fecha como string por simplicidad
)

# Definir tabla boleta_items
boleta_items = Table(
    'boleta_items',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('boleta_id', Integer, nullable=False),
    Column('product_id', Integer, nullable=False),
    Column('product_type', String(50), nullable=False), # 'producto', 'creatina', 'preentreno'
    Column('product_title', String(255), nullable=False),
    Column('quantity', Integer, nullable=False),
    Column('price', Float, nullable=False)
=======
    Column('password', String(255), nullable=False)
>>>>>>> d2990279d9feed4f7900093199302bd4d1c9975f
)

def get_conn():
    """Obtener una conexión a la base de datos."""
    return engine.connect()

def get_db():
    """Alias para compatibilidad con código existente."""
    return get_conn()

def inicializar_db():
    """Crear todas las tablas si no existen."""
    metadata.create_all(engine)
    print("✅ Tablas inicializadas correctamente")
