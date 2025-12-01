"""
Script para inicializar las tablas en Railway MySQL.
Ejecutar: python init_railway_db.py
"""
import os
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float, Text

# Credenciales de Railway MySQL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:gtUvNuzREiIaLwZvgspAXRxFLaKLsvSu@mysql.railway.internal:3306/railway"
)

print(f"Conectando a: {DATABASE_URL.replace(':gtUvNuzREiIaLwZvgspAXRxFLaKLsvSu@', ':****@')}")

engine = create_engine(DATABASE_URL, echo=True)
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
    Column('password', String(255), nullable=False)
)

if __name__ == "__main__":
    try:
        print("\n🔧 Creando tablas en Railway MySQL...")
        metadata.create_all(engine)
        print("\n✅ ¡Tablas creadas exitosamente!")
        print("\nTablas creadas:")
        print("  - productos")
        print("  - creatinas")
        print("  - preentrenos")
        print("  - usuarios")
        
        # Verificar tablas
        print("\n🔍 Verificando tablas...")
        with engine.connect() as conn:
            result = conn.execute(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'railway'"
            )
            tables = [row[0] for row in result]
            print(f"\nTablas en la base de datos: {tables}")
            
    except Exception as e:
        print(f"\n❌ Error al crear tablas: {e}")
        print("\nVerifica que:")
        print("1. La variable DATABASE_URL esté configurada correctamente")
        print("2. Tengas acceso a la base de datos de Railway")
        print("3. Las credenciales sean correctas")
