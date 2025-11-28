-- =========================================================
-- POWER DACHNUTRITION - SCHEMA COMPLETO (SQLite)
-- =========================================================
-- Creado para proyecto de Base de Datos I
-- =========================================================


-- ==========================
-- 1️⃣ TABLAS PRINCIPALES
-- ==========================

CREATE TABLE Proveedor (
    idProveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreProveedor TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    correo TEXT
);

CREATE TABLE Categoria (
    idCategoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreCategoria TEXT NOT NULL,
    descripcion TEXT
);

CREATE TABLE Marca (
    idMarca INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreMarca TEXT NOT NULL
);

CREATE TABLE Producto (
    idProducto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    unidadMedida TEXT,
    idProveedor INTEGER,
    idCategoria INTEGER,
    idMarca INTEGER,
    FOREIGN KEY (idProveedor) REFERENCES Proveedor(idProveedor),
    FOREIGN KEY (idCategoria) REFERENCES Categoria(idCategoria),
    FOREIGN KEY (idMarca) REFERENCES Marca(idMarca)
);

CREATE TABLE Cliente (
    idCliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    direccion TEXT,
    telefono TEXT,
    fechaRegistro DATE DEFAULT CURRENT_DATE
);


-- ==========================
-- 2️⃣ INVENTARIO Y STOCK
-- ==========================

CREATE TABLE Inventario (
    idInventario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreAlmacen TEXT NOT NULL,
    ubicacion TEXT,
    fechaCreacion DATE DEFAULT CURRENT_DATE
);

CREATE TABLE Stock (
    idStock INTEGER PRIMARY KEY AUTOINCREMENT,
    cantidadDisponible INTEGER NOT NULL,
    ubicacionAlmacen TEXT,
    idProducto INTEGER NOT NULL,
    idInventario INTEGER NOT NULL,
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto),
    FOREIGN KEY (idInventario) REFERENCES Inventario(idInventario)
);

CREATE TABLE EntradaInventario (
    idEntrada INTEGER PRIMARY KEY AUTOINCREMENT,
    fechaEntrada DATE DEFAULT CURRENT_DATE,
    cantidad INTEGER NOT NULL,
    idProveedor INTEGER NOT NULL,
    idStock INTEGER NOT NULL,
    FOREIGN KEY (idProveedor) REFERENCES Proveedor(idProveedor),
    FOREIGN KEY (idStock) REFERENCES Stock(idStock)
);

CREATE TABLE SalidaInventario (
    idSalida INTEGER PRIMARY KEY AUTOINCREMENT,
    fechaSalida DATE DEFAULT CURRENT_DATE,
    cantidad INTEGER NOT NULL,
    motivo TEXT,
    idStock INTEGER NOT NULL,
    FOREIGN KEY (idStock) REFERENCES Stock(idStock)
);


-- ==========================
-- 3️⃣ PEDIDOS Y PAGOS
-- ==========================

CREATE TABLE Pedido (
    idPedido INTEGER PRIMARY KEY AUTOINCREMENT,
    fechaPedido DATE DEFAULT CURRENT_DATE,
    estado TEXT CHECK (estado IN ('pendiente','enviado','entregado','cancelado')) DEFAULT 'pendiente',
    total REAL NOT NULL,
    idCliente INTEGER NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE Pago (
    idPago INTEGER PRIMARY KEY AUTOINCREMENT,
    fechaPago DATE DEFAULT CURRENT_DATE,
    monto REAL NOT NULL,
    metodoPago TEXT CHECK (metodoPago IN ('tarjeta','transferencia','efectivo','otros')),
    idPedido INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido)
);

CREATE TABLE Detalle_Pedido (
    idDetalle INTEGER PRIMARY KEY AUTOINCREMENT,
    cantidad INTEGER NOT NULL,
    precioUnitario REAL NOT NULL,
    idPedido INTEGER NOT NULL,
    idProducto INTEGER NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido),
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);


-- ==========================
-- 4️⃣ DESCUENTOS, IMÁGENES Y RESEÑAS
-- ==========================

CREATE TABLE DescuentoProducto (
    idDescuento INTEGER PRIMARY KEY AUTOINCREMENT,
    tipoDescuento TEXT CHECK (tipoDescuento IN ('porcentaje','monto fijo')) NOT NULL,
    valor REAL NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    idProducto INTEGER NOT NULL,
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);

CREATE TABLE ImagenProducto (
    idImagen INTEGER PRIMARY KEY AUTOINCREMENT,
    urlImagen TEXT NOT NULL,
    descripcion TEXT,
    idProducto INTEGER NOT NULL,
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);

CREATE TABLE ReseñaProducto (
    idReseña INTEGER PRIMARY KEY AUTOINCREMENT,
    comentario TEXT,
    calificacion INTEGER CHECK (calificacion BETWEEN 1 AND 5),
    fechaReseña DATE DEFAULT CURRENT_DATE,
    idCliente INTEGER NOT NULL,
    idProducto INTEGER NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente),
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);

-- =========================================================
-- FIN DEL SCHEMA
-- =========================================================