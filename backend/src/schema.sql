-- ============================================================================
-- POWER-DACH Database Schema
-- 15 Tablas con SQL Puro (sin ORM)
-- Claves foráneas, constraints, índices
-- ============================================================================

-- Habilitar foreign keys
PRAGMA foreign_keys = ON;

-- ============================================================================
-- 1. CATEGORÍAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categorias_nombre ON categorias(nombre);

-- ============================================================================
-- 2. MARCAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS marcas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    logo_url VARCHAR(500),
    pais_origen VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_marcas_nombre ON marcas(nombre);

-- ============================================================================
-- 3. PROVEEDORES
-- ============================================================================
CREATE TABLE IF NOT EXISTS proveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(200) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proveedores_nombre ON proveedores(nombre);

-- ============================================================================
-- 4. PRODUCTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK(precio > 0),
    categoria_id INTEGER NOT NULL,
    marca_id INTEGER,
    imagen_url VARCHAR(500),
    stock INTEGER DEFAULT 0 CHECK(stock >= 0),
    sabor VARCHAR(50),
    tamano VARCHAR(50),
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_marca ON productos(marca_id);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

-- ============================================================================
-- 5. CREATINAS (Especialización de productos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS creatinas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL UNIQUE,
    tipo_creatina VARCHAR(50) NOT NULL DEFAULT 'Monohidratada',
    gramos_por_porcion DECIMAL(5,2),
    porciones INTEGER,
    certificaciones VARCHAR(200),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_creatinas_producto ON creatinas(producto_id);
CREATE INDEX IF NOT EXISTS idx_creatinas_tipo ON creatinas(tipo_creatina);

-- ============================================================================
-- 5.5. PROTEINAS (Especialización de productos con info nutricional)
-- ============================================================================
CREATE TABLE IF NOT EXISTS proteinas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL UNIQUE,
    tipo_proteina VARCHAR(50) NOT NULL DEFAULT 'Whey',
    proteina_por_porcion DECIMAL(5,2),
    calorias_por_porcion INTEGER,
    carbohidratos DECIMAL(5,2),
    grasas DECIMAL(5,2),
    azucares DECIMAL(5,2),
    sodio_mg INTEGER,
    porciones INTEGER,
    aminoacidos_bcaa DECIMAL(5,2),
    glutamina DECIMAL(5,2),
    certificaciones VARCHAR(200),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_proteinas_producto ON proteinas(producto_id);
CREATE INDEX IF NOT EXISTS idx_proteinas_tipo ON proteinas(tipo_proteina);

-- ============================================================================
-- 6. PREENTRENOS (Especialización de productos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS preentrenos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL UNIQUE,
    cafeina_mg INTEGER,
    beta_alanina BOOLEAN DEFAULT 0,
    citrulina BOOLEAN DEFAULT 0,
    nivel_estimulante VARCHAR(20) CHECK(nivel_estimulante IN ('bajo', 'moderado', 'alto', 'extremo')),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_preentrenos_producto ON preentrenos(producto_id);
CREATE INDEX IF NOT EXISTS idx_preentrenos_nivel ON preentrenos(nivel_estimulante);

-- ============================================================================
-- 7. USUARIOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'cliente' CHECK(rol IN ('cliente', 'admin')),
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- ============================================================================
-- 8. DIRECCIONES (Relación 1:N con usuarios)
-- ============================================================================
CREATE TABLE IF NOT EXISTS direcciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20),
    pais VARCHAR(50) DEFAULT 'Perú',
    es_principal BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_direcciones_usuario ON direcciones(usuario_id);

-- ============================================================================
-- 9. MÉTODOS DE PAGO
-- ============================================================================
CREATE TABLE IF NOT EXISTS metodos_pago (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 10. CUPONES
-- ============================================================================
CREATE TABLE IF NOT EXISTS cupones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    tipo_descuento VARCHAR(20) NOT NULL CHECK(tipo_descuento IN ('porcentaje', 'fijo')),
    valor_descuento DECIMAL(10,2) NOT NULL CHECK(valor_descuento > 0),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    usos_maximos INTEGER,
    usos_actuales INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK(fecha_fin >= fecha_inicio)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cupones_codigo ON cupones(codigo);
CREATE INDEX IF NOT EXISTS idx_cupones_fechas ON cupones(fecha_inicio, fecha_fin);

-- ============================================================================
-- 11. INVENTARIO (Movimientos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL,
    tipo_movimiento VARCHAR(20) NOT NULL CHECK(tipo_movimiento IN ('entrada', 'salida', 'ajuste')),
    cantidad INTEGER NOT NULL CHECK(cantidad > 0),
    proveedor_id INTEGER,
    notas TEXT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_inventario_producto ON inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_inventario_proveedor ON inventario(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_inventario_fecha ON inventario(fecha_movimiento);
CREATE INDEX IF NOT EXISTS idx_inventario_tipo ON inventario(tipo_movimiento);

-- ============================================================================
-- 12. BOLETAS (Pedidos/Ventas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS boletas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,  -- Puede ser NULL si el usuario fue eliminado
    subtotal DECIMAL(10,2) NOT NULL CHECK(subtotal >= 0),
    impuestos DECIMAL(10,2) DEFAULT 0 CHECK(impuestos >= 0),
    descuento DECIMAL(10,2) DEFAULT 0 CHECK(descuento >= 0),
    total DECIMAL(10,2) NOT NULL CHECK(total >= 0),
    metodo_pago_id INTEGER,
    direccion_envio TEXT,
    cupon_id INTEGER,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago(id) ON DELETE SET NULL,
    FOREIGN KEY (cupon_id) REFERENCES cupones(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_boletas_usuario ON boletas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_boletas_estado ON boletas(estado);
CREATE INDEX IF NOT EXISTS idx_boletas_fecha ON boletas(created_at);

-- ============================================================================
-- 13. BOLETA_ITEMS (Detalle de boletas - Clave compuesta)
-- ============================================================================
CREATE TABLE IF NOT EXISTS boleta_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    boleta_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK(cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK(precio_unitario > 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK(subtotal >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boleta_id) REFERENCES boletas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    UNIQUE(boleta_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_boleta_items_boleta ON boleta_items(boleta_id);
CREATE INDEX IF NOT EXISTS idx_boleta_items_producto ON boleta_items(producto_id);

-- ============================================================================
-- 14. RESEÑAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS resenas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    calificacion INTEGER NOT NULL CHECK(calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(producto_id, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_resenas_producto ON resenas(producto_id);
CREATE INDEX IF NOT EXISTS idx_resenas_usuario ON resenas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_resenas_calificacion ON resenas(calificacion);

-- ============================================================================
-- 15. FAVORITOS (Tabla intermedia - Relación N:M)
-- ============================================================================
CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_producto ON favoritos(producto_id);

-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- Vista de productos con categoría y marca
CREATE VIEW IF NOT EXISTS v_productos_completos AS
SELECT 
    p.*,
    c.nombre as categoria_nombre,
    m.nombre as marca_nombre
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN marcas m ON p.marca_id = m.id;

-- Vista de ventas por producto
CREATE VIEW IF NOT EXISTS v_ventas_por_producto AS
SELECT 
    p.id,
    p.nombre,
    c.nombre as categoria,
    SUM(bi.cantidad) as total_vendido,
    SUM(bi.subtotal) as ingresos
FROM productos p
LEFT JOIN boleta_items bi ON p.id = bi.producto_id
LEFT JOIN boletas b ON bi.boleta_id = b.id AND b.estado != 'cancelado'
LEFT JOIN categorias c ON p.categoria_id = c.id
GROUP BY p.id;

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================
