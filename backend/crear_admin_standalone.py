import os
import sys
from pathlib import Path

# Agregar el directorio parent al path para importar backend
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine, text
from passlib.context import CryptContext

# Configuración de base de datos similar a database.py
DB_PATH = os.path.join(os.path.dirname(__file__), "proteinas.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Configuración de bcrypt con manejo correcto de longitud
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password_safe(password: str) -> str:
    """Hashea una contraseña de forma segura, truncando si excede 72 bytes."""
    if len(password.encode('utf-8')) > 72:
        password = password[:72]
        print(f"⚠️  Contraseña truncada a 72 bytes")
    return pwd_context.hash(password)

print("=" * 60)
print("LISTANDO USUARIOS EXISTENTES")
print("=" * 60)

with engine.begin() as conn:
    rows = conn.execute(text('SELECT id, nombre, email, role FROM usuarios')).fetchall()
    
    if rows:
        for r in rows:
            print(f"\nID: {r[0]}, Nombre: {r[1]}, Email: {r[2]}, Rol: {r[3]}")
    else:
        print("\n❌ No hay usuarios en la base de datos")

print("\n" + "=" * 60)
print("CREANDO USUARIO ADMIN DE PRUEBA")
print("=" * 60)

email = "testadmin@powerdach.com"
password = "Admin123"
nombre = "Admin Test"

with engine.begin() as conn:
    # Verificar si ya existe
    existing = conn.execute(text('SELECT id FROM usuarios WHERE email = :email'), {"email": email}).first()
    
    if existing:
        print(f"\n⚠️  Usuario {email} ya existe (ID: {existing[0]})")
        # Actualizar contraseña y rol
        hashed = hash_password_safe(password)
        conn.execute(
            text('UPDATE usuarios SET password = :password, role = :role WHERE email = :email'),
            {"password": hashed, "role": "admin", "email": email}
        )
        print(f"✅ Contraseña y rol actualizados para {email}")
    else:
        # Crear nuevo usuario
        hashed = hash_password_safe(password)
        conn.execute(
            text("INSERT INTO usuarios (nombre, email, password, role) VALUES (:nombre, :email, :password, :role)"),
            {"nombre": nombre, "email": email, "password": hashed, "role": "admin"}
        )
        print(f"\n✅ Usuario creado exitosamente")

print(f"\n📧 Email: {email}")
print(f"🔑 Password: {password}")
print(f"👤 Rol: admin")
print("\n" + "=" * 60)
