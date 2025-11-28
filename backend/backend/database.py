"""
Configuración de base de datos con SQLAlchemy.
Soporta MySQL (Railway) y SQLite (local development).
"""
import os
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float, Text

# Configurar DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")
# Usar archivo SQLite dentro de la carpeta `backend` para evitar ambigüedad
backend_dir = os.path.dirname(__file__)
default_db_path = os.path.abspath(os.path.join(backend_dir, '..', 'proteinas.db'))
FALLBACK_SQLITE_URL = f"sqlite:///{default_db_path.replace('\\', '/')}"

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
    Column('password', String(255), nullable=False),
    # Flag para controlar acceso de administrador (0 = no, 1 = sí)
    Column('is_admin', Integer, nullable=False, default=0)
)

# Tabla para boletas (ventas / pedidos) - opcionalmente persistidas en backend
boletas = Table(
    'boletas',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('usuario_id', Integer, nullable=False),
    Column('numeroPedido', String(100), nullable=False),
    Column('items', Text, nullable=False),
    Column('total', Float, nullable=False),
    Column('metodoPago', String(100), nullable=True),
    Column('fecha', String(100), nullable=False)
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
