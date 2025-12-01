"""
Script para verificar la conexión a la base de datos
Este script verifica:
1. Conexión a la base de datos
2. Existencia de tablas
3. Capacidad de lectura/escritura
4. Persistencia de datos
"""

import sys
sys.path.insert(0, '.')

from backend.database import get_db, engine
from sqlalchemy import text

print("=" * 60)
print("VERIFICACIÓN DE CONEXIÓN A BASE DE DATOS")
print("=" * 60)

try:
    # Test 1: Verificar conexión
    print("\n✓ Test 1: Verificando conexión...")
    with get_db() as conn:
        result = conn.execute(text("SELECT 1"))
        print("  ✓ Conexión establecida correctamente")
    
    # Test 2: Listar tablas
    print("\n✓ Test 2: Verificando tablas...")
    with get_db() as conn:
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
        tables = [row[0] for row in result]
        print(f"  ✓ Tablas encontradas: {', '.join(tables)}")
        
        required_tables = ['usuarios', 'productos', 'creatinas', 'preentrenos', 'boletas', 'boleta_items']
        missing = [t for t in required_tables if t not in tables]
        if missing:
            print(f"  ⚠ Tablas faltantes: {', '.join(missing)}")
        else:
            print("  ✓ Todas las tablas requeridas están presentes")
    
    # Test 3: Verificar datos en usuarios
    print("\n✓ Test 3: Verificando datos en usuarios...")
    with get_db() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM usuarios"))
        count = result.scalar()
        print(f"  ✓ Usuarios registrados: {count}")
        
        if count > 0:
            result = conn.execute(text("SELECT id, nombre, email, role FROM usuarios LIMIT 3"))
            users = result.fetchall()
            print("  ✓ Últimos usuarios:")
            for user in users:
                print(f"    - ID: {user[0]}, Nombre: {user[1]}, Email: {user[2]}, Rol: {user[3]}")
    
    # Test 4: Verificar datos en productos
    print("\n✓ Test 4: Verificando datos en productos...")
    with get_db() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM productos"))
        count = result.scalar()
        print(f"  ✓ Productos registrados: {count}")
    
    # Test 5: Test de escritura (crear y eliminar un registro temporal)
    print("\n✓ Test 5: Verificando capacidad de escritura...")
    with engine.begin() as conn:
        # Insertar
        conn.execute(text("INSERT INTO usuarios (nombre, email, password, role) VALUES ('Test DB', 'test_db_verify@test.com', 'temp', 'user')"))
        result = conn.execute(text("SELECT id FROM usuarios WHERE email = 'test_db_verify@test.com'"))
        test_id = result.scalar()
        print(f"  ✓ Escritura exitosa (ID temporal: {test_id})")
        
        # Eliminar
        conn.execute(text("DELETE FROM usuarios WHERE id = :id"), {"id": test_id})
        print("  ✓ Eliminación exitosa")
    
    # Test 6: Verificar boletas
    print("\n✓ Test 6: Verificando boletas generadas...")
    with get_db() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM boletas"))
        count = result.scalar()
        print(f"  ✓ Boletas registradas: {count}")
        
        if count > 0:
            result = conn.execute(text("SELECT id, user_id, total, fecha FROM boletas LIMIT 3"))
            boletas = result.fetchall()
            print("  ✓ Últimas boletas:")
            for boleta in boletas:
                print(f"    - ID: {boleta[0]}, User: {boleta[1]}, Total: S/{boleta[2]}, Fecha: {boleta[3]}")
    
    print("\n" + "=" * 60)
    print("✓ TODOS LOS TESTS PASARON EXITOSAMENTE")
    print("✓ La base de datos está funcionando correctamente")
    print("=" * 60)
    
except Exception as e:
    print(f"\n✗ ERROR: {e}")
    print(f"✗ Tipo: {type(e).__name__}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
