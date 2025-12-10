"""
Script de inicialización de base de datos con datos de prueba
Ejecutar: python init_db.py
"""
import os
import sys
import sqlite3
from datetime import datetime, timedelta

# Agregar src al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Rutas
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "power_dach.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "src", "schema.sql")


def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_schema():
    """Ejecuta el schema SQL"""
    print("📋 Leyendo schema SQL...")
    
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    conn = get_connection()
    try:
        conn.executescript(schema_sql)
        conn.commit()
        print("✅ Schema ejecutado correctamente")
    finally:
        conn.close()


def seed_data():
    """Inserta datos de prueba en todas las tablas"""
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # ========================================
        # 1. CATEGORÍAS (5+ registros)
        # ========================================
        print("📦 Insertando categorías...")
        categorias = [
            ('Proteínas', 'Suplementos de proteína para desarrollo muscular', '/assets/productos/proteina.jpg'),
            ('Creatinas', 'Creatina monohidratada y otras variantes', '/assets/productos/creatina.jpg'),
            ('Pre-entrenos', 'Suplementos para antes del entrenamiento', '/assets/productos/preentreno.jpg'),
            ('Aminoácidos', 'BCAAs, glutamina y aminoácidos esenciales', '/assets/productos/aminoacidos.jpg'),
            ('Vitaminas', 'Multivitamínicos y suplementos de salud', '/assets/productos/vitaminas.jpg'),
            ('Quemadores', 'Termogénicos y quemadores de grasa', '/assets/productos/quemadores.jpg'),
        ]
        cursor.executemany(
            "INSERT OR IGNORE INTO categorias (nombre, descripcion, imagen_url) VALUES (?, ?, ?)",
            categorias
        )
        
        # ========================================
        # 2. MARCAS (5+ registros)
        # ========================================
        print("🏷️ Insertando marcas...")
        marcas = [
            ('Optimum Nutrition', 'Líder mundial en suplementos deportivos', '/assets/logos/on.png', 'USA'),
            ('MuscleTech', 'Innovación en nutrición deportiva', '/assets/logos/muscletech.png', 'USA'),
            ('Cellucor', 'Famoso por C4 Pre-Workout', '/assets/logos/cellucor.png', 'USA'),
            ('BSN', 'True Strength', '/assets/logos/bsn.png', 'USA'),
            ('Dymatize', 'Elite nutrition', '/assets/logos/dymatize.png', 'USA'),
            ('Insane Labz', 'Suplementos extremos', '/assets/logos/insanelabz.png', 'USA'),
            ('Redcon1', 'Highest State of Readiness', '/assets/logos/redcon1.png', 'USA'),
        ]
        cursor.executemany(
            "INSERT OR IGNORE INTO marcas (nombre, descripcion, logo_url, pais_origen) VALUES (?, ?, ?, ?)",
            marcas
        )
        
        # ========================================
        # 3. PROVEEDORES (5+ registros)
        # ========================================
        print("🚚 Insertando proveedores...")
        proveedores = [
            ('Importadora Fitness SAC', 'Juan Pérez', '987654321', 'ventas@importadorafitness.pe', 'Lima, Perú'),
            ('NutriMax Distribuidores', 'María García', '976543210', 'contacto@nutrimax.pe', 'Lima, Perú'),
            ('Suplementos Direct', 'Carlos López', '965432109', 'info@suplementosdirect.pe', 'Arequipa, Perú'),
            ('PowerGym Imports', 'Ana Rodríguez', '954321098', 'compras@powergym.pe', 'Trujillo, Perú'),
            ('FitLife Distribuciones', 'Pedro Sánchez', '943210987', 'ventas@fitlife.pe', 'Lima, Perú'),
        ]
        cursor.executemany(
            "INSERT OR IGNORE INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)",
            proveedores
        )
        
        # ========================================
        # 4. PRODUCTOS (10+ registros)
        # ========================================
        print("🛒 Insertando productos...")
        productos = [
            # Proteínas
            ('Gold Standard Whey', 'La proteína más vendida del mundo. 24g proteína por porción.', 280.00, 1, 1, '/assets/productos/gold-standard.jpg', 50, 'Chocolate', '5 lbs'),
            ('Nitro-Tech Whey Gold', 'Proteína de suero premium con péptidos', 320.00, 1, 2, '/assets/productos/nitro-tech.jpg', 35, 'Vainilla', '5 lbs'),
            ('ISO100 Hydrolyzed', 'Proteína hidrolizada ultra rápida absorción', 350.00, 1, 5, '/assets/productos/iso100.jpg', 25, 'Cookies & Cream', '5 lbs'),
            ('Syntha-6 Edge', 'Mezcla de proteínas de liberación sostenida', 260.00, 1, 4, '/assets/productos/syntha6.jpg', 40, 'Fresa', '4 lbs'),
            ('Whey Protein Isolate', 'Aislado de proteína de suero', 290.00, 1, 1, '/assets/productos/whey-isolate.jpg', 30, 'Chocolate', '5 lbs'),
            
            # Creatinas
            ('Creatina Monohidratada ON', 'Creatina pura micronizada 5g por porción', 120.00, 2, 1, '/assets/productos/creatina-on.jpg', 60, 'Sin sabor', '300g'),
            ('Cell-Tech Creatine', 'Creatina con sistema de transporte de carbohidratos', 180.00, 2, 2, '/assets/productos/cell-tech.jpg', 45, 'Fruit Punch', '1.4 kg'),
            ('Creatine Monohydrate', 'Creatina monohidratada pura', 95.00, 2, 5, '/assets/productos/creatina-dymatize.jpg', 55, 'Sin sabor', '500g'),
            ('Creatina Platinum', 'Creatina de alta pureza', 110.00, 2, 2, '/assets/productos/creatina-platinum.jpg', 40, 'Sin sabor', '400g'),
            ('Creatina HCL', 'Creatina clorhidrato de alta absorción', 150.00, 2, 1, '/assets/productos/creatina-hcl.jpg', 25, 'Sin sabor', '200g'),
            
            # Pre-entrenos
            ('C4 Original', 'Pre-entreno más popular. Energía explosiva.', 160.00, 3, 3, '/assets/productos/c4.jpg', 70, 'Cherry Limeade', '60 servicios'),
            ('Psychotic', 'Pre-entreno de alta estimulación', 180.00, 3, 6, '/assets/productos/psychotic.jpg', 35, 'Cotton Candy', '35 servicios'),
            ('Total War', 'Pre-entreno completo para atletas serios', 175.00, 3, 7, '/assets/productos/total-war.jpg', 45, 'Watermelon', '30 servicios'),
            ('N.O.-Xplode', 'Fórmula clásica de pre-entreno', 155.00, 3, 4, '/assets/productos/no-xplode.jpg', 50, 'Blue Raz', '60 servicios'),
            ('Gold Standard Pre', 'Pre-entreno de Optimum Nutrition', 165.00, 3, 1, '/assets/productos/gs-pre.jpg', 40, 'Green Apple', '30 servicios'),
            
            # Aminoácidos
            ('BCAA 5000', 'Aminoácidos ramificados para recuperación', 85.00, 4, 1, '/assets/productos/bcaa.jpg', 55, 'Sin sabor', '345g'),
            ('Amino Energy', 'Aminoácidos + cafeína natural', 95.00, 4, 1, '/assets/productos/amino-energy.jpg', 65, 'Blueberry', '270g'),
            ('Glutamina Powder', 'L-Glutamina para recuperación muscular', 75.00, 4, 5, '/assets/productos/glutamina.jpg', 40, 'Sin sabor', '500g'),
            
            # Vitaminas
            ('Opti-Men', 'Multivitamínico para hombres activos', 110.00, 5, 1, '/assets/productos/opti-men.jpg', 80, None, '150 tabs'),
            ('Opti-Women', 'Multivitamínico para mujeres activas', 105.00, 5, 1, '/assets/productos/opti-women.jpg', 75, None, '120 caps'),
            
            # Quemadores
            ('Hydroxycut Hardcore', 'Termogénico potente para pérdida de peso', 145.00, 6, 2, '/assets/productos/hydroxycut.jpg', 30, None, '60 caps'),
        ]
        cursor.executemany(
            """INSERT OR IGNORE INTO productos 
               (nombre, descripcion, precio, categoria_id, marca_id, imagen_url, stock, sabor, tamano) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            productos
        )
        
        # ========================================
        # 5. CREATINAS (5+ registros - detalles específicos)
        # ========================================
        print("💪 Insertando creatinas específicas...")
        creatinas = [
            (6, 'Monohidratada', 5.0, 60, 'Creapure, Informed Sport'),
            (7, 'Monohidratada + HCL', 5.0, 56, 'NSF Certified'),
            (8, 'Monohidratada', 5.0, 100, 'GMP Certified'),
            (9, 'Micronizada', 5.0, 80, 'Creapure'),
            (10, 'HCL', 1.5, 133, 'USP Verified'),
        ]
        cursor.executemany(
            """INSERT OR IGNORE INTO creatinas 
               (producto_id, tipo_creatina, gramos_por_porcion, porciones, certificaciones) 
               VALUES (?, ?, ?, ?, ?)""",
            creatinas
        )
        
        # ========================================
        # 6. PREENTRENOS (5+ registros - detalles específicos)
        # ========================================
        print("⚡ Insertando preentrenos específicos...")
        preentrenos = [
            (11, 150, 1, 1, 'moderado'),
            (12, 400, 1, 1, 'extremo'),
            (13, 320, 1, 1, 'alto'),
            (14, 275, 1, 1, 'alto'),
            (15, 175, 1, 1, 'moderado'),
        ]
        cursor.executemany(
            """INSERT OR IGNORE INTO preentrenos 
               (producto_id, cafeina_mg, beta_alanina, citrulina, nivel_estimulante) 
               VALUES (?, ?, ?, ?, ?)""",
            preentrenos
        )
        
        # ========================================
        # 7. USUARIOS (5+ registros)
        # ========================================
        print("👤 Insertando usuarios...")
        admin_hash = pwd_context.hash("admin123")
        user_hash = pwd_context.hash("user123")
        
        usuarios = [
            ('Administrador', 'admin@powerdach.com', admin_hash, 'admin'),
            ('Juan Pérez', 'juan@email.com', user_hash, 'cliente'),
            ('María García', 'maria@email.com', user_hash, 'cliente'),
            ('Carlos López', 'carlos@email.com', user_hash, 'cliente'),
            ('Ana Rodríguez', 'ana@email.com', user_hash, 'cliente'),
            ('Pedro Sánchez', 'pedro@email.com', user_hash, 'cliente'),
        ]
        cursor.executemany(
            "INSERT OR IGNORE INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)",
            usuarios
        )
        
        # ========================================
        # 8. DIRECCIONES (5+ registros)
        # ========================================
        print("📍 Insertando direcciones...")
        direcciones = [
            (2, 'Av. Javier Prado 1234, Dpto 501', 'Lima', '15036', 'Perú', 1),
            (2, 'Jr. Las Flores 567', 'Lima', '15023', 'Perú', 0),
            (3, 'Calle Los Olivos 890', 'Arequipa', '04001', 'Perú', 1),
            (4, 'Av. España 456', 'Trujillo', '13001', 'Perú', 1),
            (5, 'Jr. Amazonas 123', 'Lima', '15001', 'Perú', 1),
            (6, 'Av. Brasil 789', 'Lima', '15072', 'Perú', 1),
        ]
        cursor.executemany(
            """INSERT OR IGNORE INTO direcciones 
               (usuario_id, direccion, ciudad, codigo_postal, pais, es_principal) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            direcciones
        )
        
        # ========================================
        # 9. MÉTODOS DE PAGO (5+ registros)
        # ========================================
        print("💳 Insertando métodos de pago...")
        metodos_pago = [
            ('Tarjeta de Crédito', 'Visa, Mastercard, American Express'),
            ('Tarjeta de Débito', 'Todas las tarjetas de débito'),
            ('Yape', 'Pago móvil con Yape'),
            ('Plin', 'Pago móvil con Plin'),
            ('Transferencia Bancaria', 'BCP, BBVA, Interbank, Scotiabank'),
            ('Pago Contra Entrega', 'Solo Lima Metropolitana'),
        ]
        cursor.executemany(
            "INSERT OR IGNORE INTO metodos_pago (nombre, descripcion) VALUES (?, ?)",
            metodos_pago
        )
        
        # ========================================
        # 10. CUPONES (5+ registros)
        # ========================================
        print("🎟️ Insertando cupones...")
        hoy = datetime.now().strftime('%Y-%m-%d')
        en_30_dias = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        en_60_dias = (datetime.now() + timedelta(days=60)).strftime('%Y-%m-%d')
        
        cupones = [
            ('BIENVENIDO10', 'porcentaje', 10.0, hoy, en_60_dias, 100),
            ('POWER20', 'porcentaje', 20.0, hoy, en_30_dias, 50),
            ('ENVIOGRATIS', 'fijo', 15.0, hoy, en_60_dias, 200),
            ('VERANO15', 'porcentaje', 15.0, hoy, en_30_dias, 75),
            ('PRIMERA50', 'fijo', 50.0, hoy, en_30_dias, 25),
        ]
        cursor.executemany(
            """INSERT OR IGNORE INTO cupones 
               (codigo, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, usos_maximos) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            cupones
        )
        
        # ========================================
        # 11. INVENTARIO (movimientos iniciales)
        # ========================================
        print("📊 Insertando movimientos de inventario...")
        inventario = [
            (1, 'entrada', 50, 1, 'Stock inicial'),
            (2, 'entrada', 35, 2, 'Stock inicial'),
            (3, 'entrada', 25, 1, 'Stock inicial'),
            (6, 'entrada', 60, 3, 'Stock inicial'),
            (11, 'entrada', 70, 4, 'Stock inicial'),
            (12, 'entrada', 35, 5, 'Stock inicial'),
            (1, 'entrada', 20, 1, 'Reposición mensual'),
            (6, 'salida', 5, None, 'Venta directa'),
        ]
        cursor.executemany(
            """INSERT INTO inventario 
               (producto_id, tipo_movimiento, cantidad, proveedor_id, notas) 
               VALUES (?, ?, ?, ?, ?)""",
            inventario
        )
        
        # ========================================
        # 12. BOLETAS (5+ registros)
        # ========================================
        print("🧾 Insertando boletas...")
        boletas = [
            (2, 280.00, 50.40, 330.40, 1, 'Av. Javier Prado 1234', None, 0, 'entregado'),
            (3, 440.00, 79.20, 519.20, 3, 'Calle Los Olivos 890', None, 0, 'enviado'),
            (4, 160.00, 28.80, 188.80, 4, 'Av. España 456', 1, 28.00, 'pagado'),
            (5, 375.00, 67.50, 442.50, 2, 'Jr. Amazonas 123', None, 0, 'pendiente'),
            (2, 595.00, 107.10, 702.10, 1, 'Av. Javier Prado 1234', None, 0, 'entregado'),
            (6, 205.00, 36.90, 241.90, 5, 'Av. Brasil 789', None, 0, 'pagado'),
        ]
        cursor.executemany(
            """INSERT INTO boletas 
               (usuario_id, subtotal, impuestos, total, metodo_pago_id, direccion_envio, cupon_id, descuento, estado) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            boletas
        )
        
        # ========================================
        # 13. BOLETA ITEMS (varios por boleta)
        # ========================================
        print("📝 Insertando items de boletas...")
        boleta_items = [
            (1, 1, 1, 280.00, 280.00),  # Boleta 1: Gold Standard
            (2, 6, 2, 120.00, 240.00),  # Boleta 2: Creatina ON x2
            (2, 11, 1, 160.00, 160.00), # Boleta 2: C4 x1
            (3, 11, 1, 160.00, 160.00), # Boleta 3: C4
            (4, 1, 1, 280.00, 280.00),  # Boleta 4: Gold Standard
            (4, 16, 1, 85.00, 85.00),   # Boleta 4: BCAA
            (5, 2, 1, 320.00, 320.00),  # Boleta 5: Nitro-Tech
            (5, 12, 1, 180.00, 180.00), # Boleta 5: Psychotic
            (5, 16, 1, 85.00, 85.00),   # Boleta 5: BCAA
            (6, 6, 1, 120.00, 120.00),  # Boleta 6: Creatina
            (6, 16, 1, 85.00, 85.00),   # Boleta 6: BCAA
        ]
        cursor.executemany(
            """INSERT INTO boleta_items 
               (boleta_id, producto_id, cantidad, precio_unitario, subtotal) 
               VALUES (?, ?, ?, ?, ?)""",
            boleta_items
        )
        
        # ========================================
        # 14. RESEÑAS (5+ registros)
        # ========================================
        print("⭐ Insertando reseñas...")
        resenas = [
            (1, 2, 5, 'Excelente proteína, el mejor sabor chocolate que he probado.'),
            (1, 3, 5, 'La mejor inversión para ganar músculo, muy buena calidad.'),
            (6, 4, 4, 'Buena creatina, se mezcla bien y no tiene sabor.'),
            (11, 2, 5, 'Me da toda la energía que necesito para entrenar fuerte.'),
            (11, 5, 4, 'Buen pre-entreno pero el sabor es un poco fuerte.'),
            (12, 3, 5, 'El mejor pre-entreno que existe, energía extrema!'),
            (2, 6, 4, 'Muy buena proteína, se nota la diferencia en recuperación.'),
        ]
        cursor.executemany(
            """INSERT INTO resenas 
               (producto_id, usuario_id, calificacion, comentario) 
               VALUES (?, ?, ?, ?)""",
            resenas
        )
        
        # ========================================
        # 15. FAVORITOS (5+ registros)
        # ========================================
        print("❤️ Insertando favoritos...")
        favoritos = [
            (2, 1),   # Juan favorito Gold Standard
            (2, 11),  # Juan favorito C4
            (3, 6),   # María favorito Creatina
            (4, 12),  # Carlos favorito Psychotic
            (5, 1),   # Ana favorito Gold Standard
            (5, 6),   # Ana favorito Creatina
            (6, 13),  # Pedro favorito Total War
        ]
        cursor.executemany(
            "INSERT OR IGNORE INTO favoritos (usuario_id, producto_id) VALUES (?, ?)",
            favoritos
        )
        
        conn.commit()
        print("\n✅ Todos los datos insertados correctamente!")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Error insertando datos: {e}")
        raise e
    finally:
        conn.close()


def verify_data():
    """Verifica los datos insertados"""
    conn = get_connection()
    cursor = conn.cursor()
    
    print("\n" + "="*50)
    print("📊 VERIFICACIÓN DE DATOS")
    print("="*50)
    
    tables = [
        'categorias', 'marcas', 'proveedores', 'productos', 'creatinas',
        'preentrenos', 'usuarios', 'direcciones', 'metodos_pago', 'cupones',
        'inventario', 'boletas', 'boleta_items', 'resenas', 'favoritos'
    ]
    
    total_registros = 0
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        total_registros += count
        status = "✅" if count >= 5 else "⚠️"
        print(f"{status} {table}: {count} registros")
    
    print("-"*50)
    print(f"📈 Total de registros: {total_registros}")
    print(f"📋 Total de tablas: {len(tables)}")
    
    # Verificar relaciones
    print("\n🔗 Verificando integridad referencial...")
    
    # Productos con categorías
    cursor.execute("""
        SELECT COUNT(*) FROM productos p 
        JOIN categorias c ON p.categoria_id = c.id
    """)
    print(f"   Productos con categoría válida: {cursor.fetchone()[0]}")
    
    # Boletas con usuarios
    cursor.execute("""
        SELECT COUNT(*) FROM boletas b 
        JOIN usuarios u ON b.usuario_id = u.id
    """)
    print(f"   Boletas con usuario válido: {cursor.fetchone()[0]}")
    
    # Items con productos
    cursor.execute("""
        SELECT COUNT(*) FROM boleta_items bi 
        JOIN productos p ON bi.producto_id = p.id
    """)
    print(f"   Items con producto válido: {cursor.fetchone()[0]}")
    
    conn.close()
    print("\n✅ Verificación completada!")


def main():
    print("="*50)
    print("🚀 POWER-DACH - Inicialización de Base de Datos")
    print("="*50)
    
    # Eliminar base de datos existente
    if os.path.exists(DATABASE_PATH):
        print(f"⚠️ Eliminando base de datos existente: {DATABASE_PATH}")
        os.remove(DATABASE_PATH)
    
    # Ejecutar schema
    init_schema()
    
    # Insertar datos
    seed_data()
    
    # Verificar
    verify_data()
    
    print("\n" + "="*50)
    print("✅ BASE DE DATOS LISTA PARA USAR")
    print("="*50)
    print(f"📁 Ubicación: {DATABASE_PATH}")
    print("\n👤 Usuario admin: admin@powerdach.com / admin123")
    print("👤 Usuarios de prueba: [usuario]@email.com / user123")


if __name__ == "__main__":
    main()
