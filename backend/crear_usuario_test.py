from backend.database import get_db, engine
from sqlalchemy import text

print("=" * 60)
print("USUARIOS EN LA BASE DE DATOS")
print("=" * 60)

with engine.begin() as conn:
    # Listar todos los usuarios
    rows = conn.execute(text('SELECT id, nombre, email, role FROM usuarios')).fetchall()
    
    if rows:
        for r in rows:
            print(f"\nID: {r.id}")
            print(f"Nombre: {r.nombre}")
            print(f"Email: {r.email}")
            print(f"Rol: {r.role}")
            print("-" * 60)
    else:
        print("\nNo hay usuarios en la base de datos")
    
    # Crear un nuevo usuario admin de prueba
    print("\n" + "=" * 60)
    print("CREANDO NUEVO USUARIO ADMIN DE PRUEBA")
    print("=" * 60)
    
    # Primero verificar si ya existe
    existing = conn.execute(text('SELECT id FROM usuarios WHERE email = :email'), {"email": "testadmin@test.com"}).first()
    
    if existing:
        print(f"\nUsuario testadmin@test.com ya existe (ID: {existing.id})")
        # Actualizar el rol a admin
        conn.execute(text('UPDATE usuarios SET role = :role WHERE email = :email'), {"role": "admin", "email": "testadmin@test.com"})
        print("Rol actualizado a 'admin'")
    else:
        # Hashear la contraseña correctamente
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        password = "Test123"  # Password corta y simple
        hashed = pwd_context.hash(password)
        
        conn.execute(
            text("INSERT INTO usuarios (nombre, email, password, role) VALUES (:nombre, :email, :password, :role)"),
            {"nombre": "Test Admin", "email": "testadmin@test.com", "password": hashed, "role": "admin"}
        )
        print("\n✅ Usuario creado exitosamente:")
        print(f"Email: testadmin@test.com")
        print(f"Password: Test123")
        print(f"Rol: admin")
