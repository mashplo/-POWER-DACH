from sqlalchemy import create_engine, inspect
import os

# Usar la misma lógica de conexión que database.py
DATABASE_URL = os.getenv("DATABASE_URL")
FALLBACK_SQLITE_URL = "sqlite:///proteinas.db"
db_url = DATABASE_URL if DATABASE_URL else FALLBACK_SQLITE_URL

engine = create_engine(db_url)
inspector = inspect(engine)

columns = inspector.get_columns('usuarios')
print("Columnas en tabla 'usuarios':")
for column in columns:
    print(f"- {column['name']} ({column['type']})")
