from backend.database import get_db
from sqlalchemy import text

with get_db() as conn:
    rows = conn.execute(text('SELECT id, nombre, email, role FROM usuarios WHERE role = "admin"')).fetchall()
    
    print("=" * 60)
    print("USUARIOS ADMINISTRADORES")
    print("=" * 60)
    
    for r in rows:
        print(f"\nID: {r.id}")
        print(f"Nombre: {r.nombre}")
        print(f"Email: {r.email}")
        print(f"Rol: {r.role}")
        print("-" * 60)
