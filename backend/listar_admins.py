from sqlalchemy import create_engine, text

engine = create_engine('sqlite:///proteinas.db')
conn = engine.connect()

print("=" * 60)
print("USUARIOS ADMIN")
print("=" * 60)

rows = conn.execute(text("SELECT id, nombre, email, role FROM usuarios WHERE role='admin'")).fetchall()

for r in rows:
    print(f"\nID: {r[0]}")
    print(f"Nombre: {r[1]}")
    print(f"Email: {r[2]}")
    print(f"Rol: {r[3]}")

if not rows:
    print("\n❌ No hay usuarios admin")
    
conn.close()
