"""
Database module - SQL PURO con sqlite3
No usa ORM (SQLAlchemy, Sequelize, Eloquent, Prisma)
Todas las consultas son SQL directo
"""
import sqlite3
import os
from contextlib import contextmanager
from typing import Optional, List, Dict, Any

# Ruta de la base de datos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_PATH = os.path.join(BASE_DIR, "power_dach.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")


def dict_factory(cursor: sqlite3.Cursor, row: tuple) -> dict:
    """Convierte filas de sqlite a diccionarios"""
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}


def get_connection() -> sqlite3.Connection:
    """Obtiene una conexión a la base de datos con foreign keys habilitadas"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = dict_factory
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


@contextmanager
def get_db():
    """Context manager para conexiones a la base de datos"""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def init_database():
    """Inicializa la base de datos ejecutando el schema SQL"""
    if not os.path.exists(SCHEMA_PATH):
        raise FileNotFoundError(f"Schema file not found: {SCHEMA_PATH}")
    
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    conn = get_connection()
    try:
        conn.executescript(schema_sql)
        conn.commit()
        print("✅ Base de datos inicializada correctamente")
    except Exception as e:
        conn.rollback()
        print(f"❌ Error inicializando base de datos: {e}")
        raise e
    finally:
        conn.close()


def execute_query(sql: str, params: tuple = ()) -> List[Dict[str, Any]]:
    """Ejecuta una consulta SELECT y retorna lista de diccionarios"""
    with get_db() as conn:
        cursor = conn.execute(sql, params)
        return cursor.fetchall()


def execute_one(sql: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
    """Ejecuta una consulta SELECT y retorna un solo resultado"""
    with get_db() as conn:
        cursor = conn.execute(sql, params)
        return cursor.fetchone()


def execute_insert(sql: str, params: tuple = ()) -> int:
    """Ejecuta un INSERT y retorna el ID generado"""
    with get_db() as conn:
        cursor = conn.execute(sql, params)
        return cursor.lastrowid


def execute_update(sql: str, params: tuple = ()) -> int:
    """Ejecuta un UPDATE/DELETE y retorna filas afectadas"""
    with get_db() as conn:
        cursor = conn.execute(sql, params)
        return cursor.rowcount


def execute_many(sql: str, params_list: List[tuple]) -> int:
    """Ejecuta múltiples inserts/updates"""
    with get_db() as conn:
        cursor = conn.executemany(sql, params_list)
        return cursor.rowcount


# ============================================================================
# CRUD CATEGORÍAS
# ============================================================================
def get_all_categorias() -> List[Dict]:
    return execute_query("SELECT * FROM categorias ORDER BY nombre")


def get_categoria_by_id(id: int) -> Optional[Dict]:
    return execute_one("SELECT * FROM categorias WHERE id = ?", (id,))


def create_categoria(nombre: str, descripcion: str = None, imagen_url: str = None) -> int:
    sql = "INSERT INTO categorias (nombre, descripcion, imagen_url) VALUES (?, ?, ?)"
    return execute_insert(sql, (nombre, descripcion, imagen_url))


def update_categoria(id: int, nombre: str, descripcion: str = None, imagen_url: str = None) -> int:
    sql = "UPDATE categorias SET nombre = ?, descripcion = ?, imagen_url = ? WHERE id = ?"
    return execute_update(sql, (nombre, descripcion, imagen_url, id))


def delete_categoria(id: int) -> int:
    return execute_update("DELETE FROM categorias WHERE id = ?", (id,))


# ============================================================================
# CRUD MARCAS
# ============================================================================
def get_all_marcas() -> List[Dict]:
    return execute_query("SELECT * FROM marcas ORDER BY nombre")


def get_marca_by_id(id: int) -> Optional[Dict]:
    return execute_one("SELECT * FROM marcas WHERE id = ?", (id,))


def create_marca(nombre: str, descripcion: str = None, logo_url: str = None, pais_origen: str = None) -> int:
    sql = "INSERT INTO marcas (nombre, descripcion, logo_url, pais_origen) VALUES (?, ?, ?, ?)"
    return execute_insert(sql, (nombre, descripcion, logo_url, pais_origen))


def update_marca(id: int, nombre: str, descripcion: str = None, logo_url: str = None, pais_origen: str = None) -> int:
    sql = "UPDATE marcas SET nombre = ?, descripcion = ?, logo_url = ?, pais_origen = ? WHERE id = ?"
    return execute_update(sql, (nombre, descripcion, logo_url, pais_origen, id))


def delete_marca(id: int) -> int:
    return execute_update("DELETE FROM marcas WHERE id = ?", (id,))


# ============================================================================
# CRUD PROVEEDORES
# ============================================================================
def get_all_proveedores() -> List[Dict]:
    return execute_query("SELECT * FROM proveedores ORDER BY nombre")


def get_proveedor_by_id(id: int) -> Optional[Dict]:
    return execute_one("SELECT * FROM proveedores WHERE id = ?", (id,))


def create_proveedor(nombre: str, contacto: str = None, telefono: str = None, 
                     email: str = None, direccion: str = None) -> int:
    sql = """INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) 
             VALUES (?, ?, ?, ?, ?)"""
    return execute_insert(sql, (nombre, contacto, telefono, email, direccion))


def update_proveedor(id: int, nombre: str, contacto: str = None, telefono: str = None,
                     email: str = None, direccion: str = None) -> int:
    sql = """UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ?, 
             email = ?, direccion = ? WHERE id = ?"""
    return execute_update(sql, (nombre, contacto, telefono, email, direccion, id))


def delete_proveedor(id: int) -> int:
    return execute_update("DELETE FROM proveedores WHERE id = ?", (id,))


# ============================================================================
# CRUD PRODUCTOS (General)
# ============================================================================
def get_all_productos(categoria_id: int = None, marca_id: int = None, 
                      activo: bool = None, limit: int = 100, offset: int = 0) -> List[Dict]:
    sql = """
        SELECT p.*, c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE 1=1
    """
    params = []
    
    if categoria_id:
        sql += " AND p.categoria_id = ?"
        params.append(categoria_id)
    if marca_id:
        sql += " AND p.marca_id = ?"
        params.append(marca_id)
    if activo is not None:
        sql += " AND p.activo = ?"
        params.append(1 if activo else 0)
    
    sql += " ORDER BY p.nombre LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    return execute_query(sql, tuple(params))


def get_producto_by_id(id: int) -> Optional[Dict]:
    sql = """
        SELECT p.*, c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE p.id = ?
    """
    return execute_one(sql, (id,))


def create_producto(nombre: str, descripcion: str, precio: float, categoria_id: int,
                   marca_id: int = None, imagen_url: str = None, stock: int = 0,
                   sabor: str = None, tamano: str = None, activo: bool = True) -> int:
    sql = """
        INSERT INTO productos (nombre, descripcion, precio, categoria_id, marca_id,
                              imagen_url, stock, sabor, tamano, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    return execute_insert(sql, (nombre, descripcion, precio, categoria_id, marca_id,
                                imagen_url, stock, sabor, tamano, 1 if activo else 0))


def update_producto(id: int, nombre: str = None, descripcion: str = None, 
                   precio: float = None, categoria_id: int = None, marca_id: int = None,
                   imagen_url: str = None, stock: int = None, sabor: str = None,
                   tamano: str = None, activo: bool = None) -> int:
    # Construir update dinámico
    updates = []
    params = []
    
    if nombre is not None:
        updates.append("nombre = ?")
        params.append(nombre)
    if descripcion is not None:
        updates.append("descripcion = ?")
        params.append(descripcion)
    if precio is not None:
        updates.append("precio = ?")
        params.append(precio)
    if categoria_id is not None:
        updates.append("categoria_id = ?")
        params.append(categoria_id)
    if marca_id is not None:
        updates.append("marca_id = ?")
        params.append(marca_id)
    if imagen_url is not None:
        updates.append("imagen_url = ?")
        params.append(imagen_url)
    if stock is not None:
        updates.append("stock = ?")
        params.append(stock)
    if sabor is not None:
        updates.append("sabor = ?")
        params.append(sabor)
    if tamano is not None:
        updates.append("tamano = ?")
        params.append(tamano)
    if activo is not None:
        updates.append("activo = ?")
        params.append(1 if activo else 0)
    
    if not updates:
        return 0
    
    updates.append("updated_at = CURRENT_TIMESTAMP")
    sql = f"UPDATE productos SET {', '.join(updates)} WHERE id = ?"
    params.append(id)
    
    return execute_update(sql, tuple(params))


def delete_producto(id: int) -> int:
    return execute_update("DELETE FROM productos WHERE id = ?", (id,))


def search_productos(query: str, limit: int = 20) -> List[Dict]:
    sql = """
        SELECT p.*, c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE p.activo = 1 AND (
            p.nombre LIKE ? OR p.descripcion LIKE ? OR 
            c.nombre LIKE ? OR m.nombre LIKE ?
        )
        ORDER BY p.nombre LIMIT ?
    """
    search_term = f"%{query}%"
    return execute_query(sql, (search_term, search_term, search_term, search_term, limit))


# ============================================================================
# CRUD CREATINAS (Especializado)
# ============================================================================
def get_all_creatinas() -> List[Dict]:
    sql = """
        SELECT cr.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock, p.activo,
               c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM creatinas cr
        JOIN productos p ON cr.producto_id = p.id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE p.activo = 1
        ORDER BY p.nombre
    """
    return execute_query(sql)


def get_creatina_by_id(id: int) -> Optional[Dict]:
    sql = """
        SELECT cr.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock, p.activo,
               c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM creatinas cr
        JOIN productos p ON cr.producto_id = p.id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE cr.id = ?
    """
    return execute_one(sql, (id,))


def create_creatina(producto_id: int, tipo_creatina: str, gramos_por_porcion: float = None,
                   porciones: int = None, certificaciones: str = None) -> int:
    sql = """
        INSERT INTO creatinas (producto_id, tipo_creatina, gramos_por_porcion, porciones, certificaciones)
        VALUES (?, ?, ?, ?, ?)
    """
    return execute_insert(sql, (producto_id, tipo_creatina, gramos_por_porcion, porciones, certificaciones))


def update_creatina(id: int, tipo_creatina: str = None, gramos_por_porcion: float = None,
                   porciones: int = None, certificaciones: str = None) -> int:
    updates = []
    params = []
    
    if tipo_creatina is not None:
        updates.append("tipo_creatina = ?")
        params.append(tipo_creatina)
    if gramos_por_porcion is not None:
        updates.append("gramos_por_porcion = ?")
        params.append(gramos_por_porcion)
    if porciones is not None:
        updates.append("porciones = ?")
        params.append(porciones)
    if certificaciones is not None:
        updates.append("certificaciones = ?")
        params.append(certificaciones)
    
    if not updates:
        return 0
    
    sql = f"UPDATE creatinas SET {', '.join(updates)} WHERE id = ?"
    params.append(id)
    return execute_update(sql, tuple(params))


def delete_creatina(id: int) -> int:
    return execute_update("DELETE FROM creatinas WHERE id = ?", (id,))


# ============================================================================
# CRUD PROTEINAS (Especializado con información nutricional)
# ============================================================================
def get_all_proteinas() -> List[Dict]:
    sql = """
        SELECT pr.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock, p.activo,
               p.sabor, p.tamano, c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM proteinas pr
        JOIN productos p ON pr.producto_id = p.id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE p.activo = 1
        ORDER BY p.nombre
    """
    return execute_query(sql)


def get_proteina_by_id(id: int) -> Optional[Dict]:
    sql = """
        SELECT pr.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock, p.activo,
               p.sabor, p.tamano, c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM proteinas pr
        JOIN productos p ON pr.producto_id = p.id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE pr.id = ?
    """
    return execute_one(sql, (id,))


def get_proteina_by_producto_id(producto_id: int) -> Optional[Dict]:
    sql = """
        SELECT pr.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock, p.activo,
               p.sabor, p.tamano, c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM proteinas pr
        JOIN productos p ON pr.producto_id = p.id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE pr.producto_id = ?
    """
    return execute_one(sql, (producto_id,))


def create_proteina(producto_id: int, tipo_proteina: str = 'Whey', 
                   proteina_por_porcion: float = None, calorias_por_porcion: int = None,
                   carbohidratos: float = None, grasas: float = None, azucares: float = None,
                   sodio_mg: int = None, porciones: int = None, aminoacidos_bcaa: float = None,
                   glutamina: float = None, certificaciones: str = None) -> int:
    sql = """
        INSERT INTO proteinas (producto_id, tipo_proteina, proteina_por_porcion, calorias_por_porcion,
                              carbohidratos, grasas, azucares, sodio_mg, porciones, aminoacidos_bcaa,
                              glutamina, certificaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    return execute_insert(sql, (producto_id, tipo_proteina, proteina_por_porcion, calorias_por_porcion,
                                carbohidratos, grasas, azucares, sodio_mg, porciones, aminoacidos_bcaa,
                                glutamina, certificaciones))


def update_proteina(id: int, tipo_proteina: str = None, proteina_por_porcion: float = None,
                   calorias_por_porcion: int = None, carbohidratos: float = None, 
                   grasas: float = None, azucares: float = None, sodio_mg: int = None,
                   porciones: int = None, aminoacidos_bcaa: float = None,
                   glutamina: float = None, certificaciones: str = None) -> int:
    updates = []
    params = []
    
    if tipo_proteina is not None:
        updates.append("tipo_proteina = ?")
        params.append(tipo_proteina)
    if proteina_por_porcion is not None:
        updates.append("proteina_por_porcion = ?")
        params.append(proteina_por_porcion)
    if calorias_por_porcion is not None:
        updates.append("calorias_por_porcion = ?")
        params.append(calorias_por_porcion)
    if carbohidratos is not None:
        updates.append("carbohidratos = ?")
        params.append(carbohidratos)
    if grasas is not None:
        updates.append("grasas = ?")
        params.append(grasas)
    if azucares is not None:
        updates.append("azucares = ?")
        params.append(azucares)
    if sodio_mg is not None:
        updates.append("sodio_mg = ?")
        params.append(sodio_mg)
    if porciones is not None:
        updates.append("porciones = ?")
        params.append(porciones)
    if aminoacidos_bcaa is not None:
        updates.append("aminoacidos_bcaa = ?")
        params.append(aminoacidos_bcaa)
    if glutamina is not None:
        updates.append("glutamina = ?")
        params.append(glutamina)
    if certificaciones is not None:
        updates.append("certificaciones = ?")
        params.append(certificaciones)
    
    if not updates:
        return 0
    
    sql = f"UPDATE proteinas SET {', '.join(updates)} WHERE id = ?"
    params.append(id)
    return execute_update(sql, tuple(params))


def delete_proteina(id: int) -> int:
    return execute_update("DELETE FROM proteinas WHERE id = ?", (id,))


# ============================================================================
# CRUD PREENTRENOS (Especializado)
# ============================================================================
def get_all_preentrenos() -> List[Dict]:
    sql = """
        SELECT pe.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock, p.activo,
               c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM preentrenos pe
        JOIN productos p ON pe.producto_id = p.id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE p.activo = 1
        ORDER BY p.nombre
    """
    return execute_query(sql)


def get_preentreno_by_id(id: int) -> Optional[Dict]:
    sql = """
        SELECT pe.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.stock, p.activo,
               c.nombre as categoria_nombre, m.nombre as marca_nombre
        FROM preentrenos pe
        JOIN productos p ON pe.producto_id = p.id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE pe.id = ?
    """
    return execute_one(sql, (id,))


def create_preentreno(producto_id: int, cafeina_mg: int = None, beta_alanina: bool = False,
                     citrulina: bool = False, nivel_estimulante: str = None) -> int:
    sql = """
        INSERT INTO preentrenos (producto_id, cafeina_mg, beta_alanina, citrulina, nivel_estimulante)
        VALUES (?, ?, ?, ?, ?)
    """
    return execute_insert(sql, (producto_id, cafeina_mg, 1 if beta_alanina else 0, 
                                1 if citrulina else 0, nivel_estimulante))


def update_preentreno(id: int, cafeina_mg: int = None, beta_alanina: bool = None,
                     citrulina: bool = None, nivel_estimulante: str = None) -> int:
    updates = []
    params = []
    
    if cafeina_mg is not None:
        updates.append("cafeina_mg = ?")
        params.append(cafeina_mg)
    if beta_alanina is not None:
        updates.append("beta_alanina = ?")
        params.append(1 if beta_alanina else 0)
    if citrulina is not None:
        updates.append("citrulina = ?")
        params.append(1 if citrulina else 0)
    if nivel_estimulante is not None:
        updates.append("nivel_estimulante = ?")
        params.append(nivel_estimulante)
    
    if not updates:
        return 0
    
    sql = f"UPDATE preentrenos SET {', '.join(updates)} WHERE id = ?"
    params.append(id)
    return execute_update(sql, tuple(params))


def delete_preentreno(id: int) -> int:
    return execute_update("DELETE FROM preentrenos WHERE id = ?", (id,))


# ============================================================================
# CRUD USUARIOS
# ============================================================================
def get_all_usuarios() -> List[Dict]:
    # No retornar password_hash por seguridad
    return execute_query("""
        SELECT id, nombre, email, rol, activo, created_at, updated_at 
        FROM usuarios ORDER BY nombre
    """)


def get_usuario_by_id(id: int) -> Optional[Dict]:
    return execute_one("""
        SELECT id, nombre, email, rol, activo, created_at, updated_at 
        FROM usuarios WHERE id = ?
    """, (id,))


def get_usuario_by_email(email: str) -> Optional[Dict]:
    return execute_one("SELECT * FROM usuarios WHERE email = ?", (email,))


def create_usuario(nombre: str, email: str, password_hash: str, rol: str = 'cliente') -> int:
    sql = "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)"
    return execute_insert(sql, (nombre, email, password_hash, rol))


def update_usuario(id: int, nombre: str = None, email: str = None, 
                  password_hash: str = None, rol: str = None, activo: bool = None) -> int:
    updates = []
    params = []
    
    if nombre is not None:
        updates.append("nombre = ?")
        params.append(nombre)
    if email is not None:
        updates.append("email = ?")
        params.append(email)
    if password_hash is not None:
        updates.append("password_hash = ?")
        params.append(password_hash)
    if rol is not None:
        updates.append("rol = ?")
        params.append(rol)
    if activo is not None:
        updates.append("activo = ?")
        params.append(1 if activo else 0)
    
    if not updates:
        return 0
    
    updates.append("updated_at = CURRENT_TIMESTAMP")
    sql = f"UPDATE usuarios SET {', '.join(updates)} WHERE id = ?"
    params.append(id)
    return execute_update(sql, tuple(params))


def delete_usuario(id: int) -> int:
    return execute_update("DELETE FROM usuarios WHERE id = ?", (id,))


# ============================================================================
# CRUD DIRECCIONES
# ============================================================================
def get_direcciones_by_usuario(usuario_id: int) -> List[Dict]:
    return execute_query("""
        SELECT * FROM direcciones WHERE usuario_id = ? ORDER BY es_principal DESC, id
    """, (usuario_id,))


def get_direccion_by_id(id: int) -> Optional[Dict]:
    return execute_one("SELECT * FROM direcciones WHERE id = ?", (id,))


def create_direccion(usuario_id: int, direccion: str, ciudad: str, 
                    codigo_postal: str = None, pais: str = 'Perú',
                    es_principal: bool = False) -> int:
    sql = """
        INSERT INTO direcciones (usuario_id, direccion, ciudad, codigo_postal, pais, es_principal)
        VALUES (?, ?, ?, ?, ?, ?)
    """
    return execute_insert(sql, (usuario_id, direccion, ciudad, codigo_postal, pais, 
                                1 if es_principal else 0))


def update_direccion(id: int, direccion: str = None, ciudad: str = None,
                    codigo_postal: str = None, pais: str = None, es_principal: bool = None) -> int:
    updates = []
    params = []
    
    if direccion is not None:
        updates.append("direccion = ?")
        params.append(direccion)
    if ciudad is not None:
        updates.append("ciudad = ?")
        params.append(ciudad)
    if codigo_postal is not None:
        updates.append("codigo_postal = ?")
        params.append(codigo_postal)
    if pais is not None:
        updates.append("pais = ?")
        params.append(pais)
    if es_principal is not None:
        updates.append("es_principal = ?")
        params.append(1 if es_principal else 0)
    
    if not updates:
        return 0
    
    sql = f"UPDATE direcciones SET {', '.join(updates)} WHERE id = ?"
    params.append(id)
    return execute_update(sql, tuple(params))


def delete_direccion(id: int) -> int:
    return execute_update("DELETE FROM direcciones WHERE id = ?", (id,))


# ============================================================================
# CRUD MÉTODOS DE PAGO
# ============================================================================
def get_all_metodos_pago() -> List[Dict]:
    return execute_query("SELECT * FROM metodos_pago WHERE activo = 1 ORDER BY nombre")


def get_metodo_pago_by_id(id: int) -> Optional[Dict]:
    return execute_one("SELECT * FROM metodos_pago WHERE id = ?", (id,))


# ============================================================================
# CRUD CUPONES
# ============================================================================
def get_all_cupones() -> List[Dict]:
    return execute_query("SELECT * FROM cupones ORDER BY fecha_fin DESC")


def get_cupon_by_codigo(codigo: str) -> Optional[Dict]:
    return execute_one("""
        SELECT * FROM cupones 
        WHERE codigo = ? AND activo = 1 
        AND fecha_inicio <= date('now') AND fecha_fin >= date('now')
        AND (usos_maximos IS NULL OR usos_actuales < usos_maximos)
    """, (codigo,))


def create_cupon(codigo: str, tipo_descuento: str, valor_descuento: float,
                fecha_inicio: str, fecha_fin: str, usos_maximos: int = None) -> int:
    sql = """
        INSERT INTO cupones (codigo, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, usos_maximos)
        VALUES (?, ?, ?, ?, ?, ?)
    """
    return execute_insert(sql, (codigo, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, usos_maximos))


def incrementar_uso_cupon(codigo: str) -> int:
    return execute_update("""
        UPDATE cupones SET usos_actuales = usos_actuales + 1 WHERE codigo = ?
    """, (codigo,))


# ============================================================================
# CRUD INVENTARIO
# ============================================================================
def get_all_inventario() -> List[Dict]:
    sql = """
        SELECT i.*, p.nombre as producto_nombre, pv.nombre as proveedor_nombre
        FROM inventario i
        JOIN productos p ON i.producto_id = p.id
        LEFT JOIN proveedores pv ON i.proveedor_id = pv.id
        ORDER BY i.fecha_movimiento DESC
    """
    return execute_query(sql)


def get_inventario_by_producto(producto_id: int) -> List[Dict]:
    sql = """
        SELECT i.*, pv.nombre as proveedor_nombre
        FROM inventario i
        LEFT JOIN proveedores pv ON i.proveedor_id = pv.id
        WHERE i.producto_id = ?
        ORDER BY i.fecha_movimiento DESC
    """
    return execute_query(sql, (producto_id,))


def create_movimiento_inventario(producto_id: int, tipo_movimiento: str, cantidad: int,
                                 proveedor_id: int = None, notas: str = None) -> int:
    sql = """
        INSERT INTO inventario (producto_id, tipo_movimiento, cantidad, proveedor_id, notas)
        VALUES (?, ?, ?, ?, ?)
    """
    mov_id = execute_insert(sql, (producto_id, tipo_movimiento, cantidad, proveedor_id, notas))
    
    # Actualizar stock del producto
    if tipo_movimiento == 'entrada':
        execute_update("UPDATE productos SET stock = stock + ? WHERE id = ?", (cantidad, producto_id))
    elif tipo_movimiento == 'salida':
        execute_update("UPDATE productos SET stock = stock - ? WHERE id = ?", (cantidad, producto_id))
    
    return mov_id


# ============================================================================
# CRUD BOLETAS
# ============================================================================
def get_all_boletas(usuario_id: int = None, estado: str = None, 
                   limit: int = 100, offset: int = 0) -> List[Dict]:
    sql = """
        SELECT b.*, u.nombre as usuario_nombre, u.email as usuario_email,
               mp.nombre as metodo_pago_nombre
        FROM boletas b
        JOIN usuarios u ON b.usuario_id = u.id
        LEFT JOIN metodos_pago mp ON b.metodo_pago_id = mp.id
        WHERE 1=1
    """
    params = []
    
    if usuario_id:
        sql += " AND b.usuario_id = ?"
        params.append(usuario_id)
    if estado:
        sql += " AND b.estado = ?"
        params.append(estado)
    
    sql += " ORDER BY b.created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    return execute_query(sql, tuple(params))


def get_boleta_by_id(id: int) -> Optional[Dict]:
    sql = """
        SELECT b.*, u.nombre as usuario_nombre, u.email as usuario_email,
               mp.nombre as metodo_pago_nombre, c.codigo as cupon_codigo
        FROM boletas b
        JOIN usuarios u ON b.usuario_id = u.id
        LEFT JOIN metodos_pago mp ON b.metodo_pago_id = mp.id
        LEFT JOIN cupones c ON b.cupon_id = c.id
        WHERE b.id = ?
    """
    return execute_one(sql, (id,))


def get_boleta_with_items(id: int) -> Optional[Dict]:
    boleta = get_boleta_by_id(id)
    if not boleta:
        return None
    
    items = execute_query("""
        SELECT bi.*, p.nombre, p.imagen_url
        FROM boleta_items bi
        JOIN productos p ON bi.producto_id = p.id
        WHERE bi.boleta_id = ?
    """, (id,))
    
    boleta['items'] = items
    return boleta


def create_boleta(usuario_id: int, subtotal: float, impuestos: float, total: float,
                 metodo_pago_id: int = None, direccion_envio: str = None,
                 cupon_id: int = None, descuento: float = 0) -> int:
    sql = """
        INSERT INTO boletas (usuario_id, subtotal, impuestos, total, metodo_pago_id,
                            direccion_envio, cupon_id, descuento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """
    return execute_insert(sql, (usuario_id, subtotal, impuestos, total, metodo_pago_id,
                                direccion_envio, cupon_id, descuento))


def update_boleta_estado(id: int, estado: str) -> int:
    return execute_update("""
        UPDATE boletas SET estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    """, (estado, id))


def delete_boleta(id: int) -> int:
    # Primero eliminar items
    execute_update("DELETE FROM boleta_items WHERE boleta_id = ?", (id,))
    return execute_update("DELETE FROM boletas WHERE id = ?", (id,))


# ============================================================================
# CRUD BOLETA ITEMS
# ============================================================================
def get_items_by_boleta(boleta_id: int) -> List[Dict]:
    sql = """
        SELECT bi.*, p.nombre, p.imagen_url, p.descripcion
        FROM boleta_items bi
        JOIN productos p ON bi.producto_id = p.id
        WHERE bi.boleta_id = ?
    """
    return execute_query(sql, (boleta_id,))


def create_boleta_item(boleta_id: int, producto_id: int, cantidad: int,
                      precio_unitario: float, subtotal: float) -> int:
    sql = """
        INSERT INTO boleta_items (boleta_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)
    """
    return execute_insert(sql, (boleta_id, producto_id, cantidad, precio_unitario, subtotal))


# ============================================================================
# CRUD RESEÑAS
# ============================================================================
def get_resenas_by_producto(producto_id: int) -> List[Dict]:
    sql = """
        SELECT r.*, u.nombre as usuario_nombre
        FROM resenas r
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.producto_id = ?
        ORDER BY r.created_at DESC
    """
    return execute_query(sql, (producto_id,))


def get_resena_by_id(id: int) -> Optional[Dict]:
    return execute_one("SELECT * FROM resenas WHERE id = ?", (id,))


def create_resena(producto_id: int, usuario_id: int, calificacion: int, comentario: str = None) -> int:
    sql = """
        INSERT INTO resenas (producto_id, usuario_id, calificacion, comentario)
        VALUES (?, ?, ?, ?)
    """
    return execute_insert(sql, (producto_id, usuario_id, calificacion, comentario))


def update_resena(id: int, calificacion: int = None, comentario: str = None) -> int:
    updates = []
    params = []
    
    if calificacion is not None:
        updates.append("calificacion = ?")
        params.append(calificacion)
    if comentario is not None:
        updates.append("comentario = ?")
        params.append(comentario)
    
    if not updates:
        return 0
    
    updates.append("updated_at = CURRENT_TIMESTAMP")
    sql = f"UPDATE resenas SET {', '.join(updates)} WHERE id = ?"
    params.append(id)
    return execute_update(sql, tuple(params))


def delete_resena(id: int) -> int:
    return execute_update("DELETE FROM resenas WHERE id = ?", (id,))


# ============================================================================
# CRUD FAVORITOS
# ============================================================================
def get_favoritos_by_usuario(usuario_id: int) -> List[Dict]:
    sql = """
        SELECT f.*, p.nombre, p.descripcion, p.precio, p.imagen_url
        FROM favoritos f
        JOIN productos p ON f.producto_id = p.id
        WHERE f.usuario_id = ?
        ORDER BY f.created_at DESC
    """
    return execute_query(sql, (usuario_id,))


def add_favorito(usuario_id: int, producto_id: int) -> int:
    # Verificar si ya existe
    exists = execute_one("""
        SELECT id FROM favoritos WHERE usuario_id = ? AND producto_id = ?
    """, (usuario_id, producto_id))
    
    if exists:
        return exists['id']
    
    sql = "INSERT INTO favoritos (usuario_id, producto_id) VALUES (?, ?)"
    return execute_insert(sql, (usuario_id, producto_id))


def remove_favorito(usuario_id: int, producto_id: int) -> int:
    return execute_update("""
        DELETE FROM favoritos WHERE usuario_id = ? AND producto_id = ?
    """, (usuario_id, producto_id))


# ============================================================================
# REPORTES Y ESTADÍSTICAS (para Excel)
# ============================================================================
def get_reporte_ventas(fecha_inicio: str = None, fecha_fin: str = None) -> List[Dict]:
    sql = """
        SELECT 
            b.id as boleta_id,
            b.created_at as fecha,
            u.nombre as cliente,
            u.email as email_cliente,
            b.subtotal,
            b.impuestos,
            b.descuento,
            b.total,
            b.estado,
            mp.nombre as metodo_pago
        FROM boletas b
        JOIN usuarios u ON b.usuario_id = u.id
        LEFT JOIN metodos_pago mp ON b.metodo_pago_id = mp.id
        WHERE 1=1
    """
    params = []
    
    if fecha_inicio:
        sql += " AND date(b.created_at) >= ?"
        params.append(fecha_inicio)
    if fecha_fin:
        sql += " AND date(b.created_at) <= ?"
        params.append(fecha_fin)
    
    sql += " ORDER BY b.created_at DESC"
    return execute_query(sql, tuple(params))


def get_reporte_productos_vendidos(fecha_inicio: str = None, fecha_fin: str = None) -> List[Dict]:
    sql = """
        SELECT 
            p.id as producto_id,
            p.nombre as producto,
            c.nombre as categoria,
            m.nombre as marca,
            SUM(bi.cantidad) as cantidad_vendida,
            SUM(bi.subtotal) as ingresos_totales,
            AVG(bi.precio_unitario) as precio_promedio
        FROM boleta_items bi
        JOIN productos p ON bi.producto_id = p.id
        JOIN boletas b ON bi.boleta_id = b.id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE b.estado != 'cancelado'
    """
    params = []
    
    if fecha_inicio:
        sql += " AND date(b.created_at) >= ?"
        params.append(fecha_inicio)
    if fecha_fin:
        sql += " AND date(b.created_at) <= ?"
        params.append(fecha_fin)
    
    sql += " GROUP BY p.id ORDER BY cantidad_vendida DESC"
    return execute_query(sql, tuple(params))


def get_reporte_inventario() -> List[Dict]:
    sql = """
        SELECT 
            p.id,
            p.nombre,
            c.nombre as categoria,
            m.nombre as marca,
            p.stock as stock_actual,
            p.precio,
            (p.stock * p.precio) as valor_inventario,
            CASE 
                WHEN p.stock = 0 THEN 'Sin stock'
                WHEN p.stock < 10 THEN 'Stock bajo'
                ELSE 'Stock OK'
            END as estado_stock
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE p.activo = 1
        ORDER BY p.stock ASC
    """
    return execute_query(sql)


def get_reporte_clientes() -> List[Dict]:
    sql = """
        SELECT 
            u.id,
            u.nombre,
            u.email,
            u.created_at as fecha_registro,
            COUNT(b.id) as total_compras,
            COALESCE(SUM(b.total), 0) as total_gastado,
            MAX(b.created_at) as ultima_compra
        FROM usuarios u
        LEFT JOIN boletas b ON u.id = b.usuario_id AND b.estado != 'cancelado'
        WHERE u.rol = 'cliente'
        GROUP BY u.id
        ORDER BY total_gastado DESC
    """
    return execute_query(sql)


def get_estadisticas_dashboard() -> Dict:
    """Estadísticas generales para dashboard"""
    stats = {}
    
    # Total ventas
    result = execute_one("""
        SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto
        FROM boletas WHERE estado != 'cancelado'
    """)
    stats['ventas'] = result
    
    # Total usuarios
    result = execute_one("SELECT COUNT(*) as total FROM usuarios WHERE rol = 'cliente'")
    stats['clientes'] = result['total']
    
    # Total productos
    result = execute_one("SELECT COUNT(*) as total FROM productos WHERE activo = 1")
    stats['productos'] = result['total']
    
    # Productos con stock bajo
    result = execute_one("SELECT COUNT(*) as total FROM productos WHERE stock < 10 AND activo = 1")
    stats['stock_bajo'] = result['total']
    
    # Ventas últimos 7 días
    result = execute_one("""
        SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto
        FROM boletas 
        WHERE estado != 'cancelado' AND created_at >= date('now', '-7 days')
    """)
    stats['ventas_semana'] = result
    
    return stats


# ============================================================================
# UTILIDADES
# ============================================================================
def check_tables() -> Dict[str, int]:
    """Verifica las tablas existentes y cuenta registros"""
    tables = execute_query("""
        SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
    """)
    
    result = {}
    for table in tables:
        count = execute_one(f"SELECT COUNT(*) as count FROM {table['name']}")
        result[table['name']] = count['count']
    
    return result


def vacuum_database():
    """Optimiza la base de datos"""
    conn = get_connection()
    conn.execute("VACUUM")
    conn.close()
