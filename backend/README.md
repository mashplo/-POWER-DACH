# POWER-DACH - Tienda de Suplementos Deportivos

## 📋 Descripción del Proyecto

Sistema completo de e-commerce para venta de suplementos deportivos con:
- **Backend**: FastAPI + SQLite (SQL Puro - Sin ORM)
- **Frontend**: React 19 + Vite + TailwindCSS + DaisyUI

## ✅ Requisitos Cumplidos

### Base de Datos - 15 Tablas con SQL Puro

| # | Tabla | Descripción | Registros |
|---|-------|-------------|-----------|
| 1 | `categorias` | Categorías de productos | 6+ |
| 2 | `marcas` | Marcas de productos | 7+ |
| 3 | `proveedores` | Proveedores de inventario | 5+ |
| 4 | `productos` | Productos generales | 21+ |
| 5 | `creatinas` | Especialización de creatinas | 5+ |
| 6 | `preentrenos` | Especialización de pre-entrenos | 5+ |
| 7 | `usuarios` | Usuarios del sistema | 6+ |
| 8 | `direcciones` | Direcciones de envío | 6+ |
| 9 | `metodos_pago` | Métodos de pago | 6+ |
| 10 | `cupones` | Cupones de descuento | 5+ |
| 11 | `inventario` | Movimientos de inventario | 8+ |
| 12 | `boletas` | Pedidos/Ventas | 6+ |
| 13 | `boleta_items` | Detalle de pedidos | 11+ |
| 14 | `resenas` | Reseñas de productos | 7+ |
| 15 | `favoritos` | Productos favoritos | 7+ |

### Claves Foráneas y Constraints

```sql
-- Ejemplo de constraints en la tabla productos:
CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(200) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK(precio > 0),
    categoria_id INTEGER NOT NULL,
    marca_id INTEGER,
    stock INTEGER DEFAULT 0 CHECK(stock >= 0),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE SET NULL
);

-- Ejemplo de clave compuesta en boleta_items:
CREATE TABLE boleta_items (
    boleta_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK(cantidad > 0),
    FOREIGN KEY (boleta_id) REFERENCES boletas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    UNIQUE(boleta_id, producto_id) -- Clave compuesta
);
```

### CRUDs Implementados

#### CRUD de 1 Entidad
- ✅ Categorías (GET, POST, PUT, DELETE)
- ✅ Marcas (GET, POST, PUT, DELETE)
- ✅ Proveedores (GET, POST, PUT, DELETE)

#### CRUD de 2 Entidades
- ✅ Productos + Categorías/Marcas
- ✅ Creatinas + Productos
- ✅ Preentrenos + Productos

#### CRUD de 3+ Entidades
- ✅ Boletas (usuarios + items + productos + cupones + métodos de pago)
- ✅ Inventario (productos + proveedores + movimientos)

### SQL Puro (Sin ORM)

El proyecto usa exclusivamente `sqlite3` con consultas SQL directas:

```python
# Ejemplo de consulta SQL pura en database.py:
def get_all_productos(categoria_id=None, marca_id=None):
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
    return execute_query(sql, tuple(params))
```

### Reportes con Exportación a Excel

- ✅ Reporte de Ventas (filtros por fecha)
- ✅ Reporte de Productos Vendidos
- ✅ Reporte de Inventario
- ✅ Reporte de Clientes
- ✅ Dashboard con estadísticas

```
GET /api/reportes/ventas?formato=excel&fecha_inicio=2024-01-01&fecha_fin=2024-12-31
```

## 🚀 Instalación y Ejecución

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Inicializar base de datos
python init_db.py

# Ejecutar servidor
python -m uvicorn src.app:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 📚 Documentación de API

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/productos` | Listar productos |
| GET | `/api/creatinas` | Listar creatinas |
| GET | `/api/preentrenos` | Listar preentrenos |
| POST | `/api/boletas` | Crear pedido |
| GET | `/api/reportes/ventas?formato=excel` | Exportar ventas a Excel |

## 👤 Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@powerdach.com | admin123 | Administrador |
| juan@email.com | user123 | Cliente |
| maria@email.com | user123 | Cliente |

## 📁 Estructura del Proyecto

```
POWER-DACH/
├── backend/
│   ├── src/
│   │   ├── app.py          # FastAPI endpoints
│   │   ├── database.py     # SQL puro con sqlite3
│   │   └── schema.sql      # DDL de 15 tablas
│   ├── init_db.py          # Script de inicialización
│   ├── requirements.txt
│   └── power_dach.db       # Base de datos SQLite
│
└── frontend/
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── pages/          # Páginas
    │   ├── herramientas/   # API client, config
    │   └── layouts/        # Layouts
    ├── package.json
    └── vite.config.js
```

## 🔧 Tecnologías Utilizadas

### Backend
- Python 3.14
- FastAPI 0.109
- SQLite3 (SQL Puro)
- python-jose (JWT)
- passlib (bcrypt)
- openpyxl (Excel)

### Frontend
- React 19
- Vite 6
- TailwindCSS
- DaisyUI
- React Router DOM
- Sonner (toasts)

## ✨ Características

- ✅ Autenticación JWT
- ✅ Roles (admin/cliente)
- ✅ Carrito de compras
- ✅ Sistema de cupones
- ✅ Reseñas de productos
- ✅ Lista de favoritos
- ✅ Gestión de inventario
- ✅ Panel de administración
- ✅ Exportación a Excel
- ✅ Búsqueda de productos
- ✅ Filtros por categoría/marca

## 📝 Licencia

Proyecto académico - Universidad
