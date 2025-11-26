# Proyecto de Proteínas - Universidad

Este es un proyecto universitario simple de compra de proteínas con frontend y backend básico.

## ⚡ Inicio Rápido

### 1. Backend (FastAPI)

```bash
cd backend

# Primera vez: Instalar dependencias
poetry install

# Primera vez: Crear la base de datos con proteínas de ejemplo
poetry run python inicializar.py

# Ejecutar el servidor (cada vez)
poetry run start
```

El backend estará disponible en `http://localhost:8000`

### 2. Frontend (React + Vite)

```bash
cd frontend

# Primera vez: Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo (cada vez)
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
amino/
├── backend/
│   ├── backend/
│   │   ├── app.py          # API con un solo endpoint
│   │   ├── database.py     # Configuración SQLite
│   │   └── crear_productos.py
│   ├── inicializar.py      # Script para crear proteínas
│   ├── proteinas.db        # Base de datos SQLite
│   └── pyproject.toml      # Dependencias de Python
│
└── frontend/
    ├── src/
    │   ├── pages/          # Login, Register, Profile, Proteina
    │   ├── components/     # Componentes reutilizables
    │   └── herramientas/
    │       ├── api.js      # Llama al backend local
    │       └── usuario.js  # Maneja localStorage
    └── package.json
```

## 🎯 Funcionalidades

### Backend (Súper Simple)
- **GET /**: Mensaje de bienvenida
- **GET /api/v1/products**: Retorna todas las proteínas en formato JSON
- **POST /api/register**: Registra un nuevo usuario
- **POST /api/login**: Inicia sesión con email y contraseña
- **GET /api/usuario/{id}**: Obtiene información de un usuario
- Base de datos SQLite con 2 tablas: `productos` y `usuarios`
- Sin tokens, sin JWT, sin autenticación compleja

### Frontend
- **Registro**: Envía datos al backend para crear usuario
- **Login**: Verifica credenciales contra el backend y guarda en localStorage
- **Catálogo de Proteínas**: Obtiene datos del backend
- **Carrito**: Se guarda en localStorage (sin backend)
- **Perfil**: Muestra usuario actual y su carrito

## 🔧 Cambios Realizados

### Backend
- ✅ Eliminado sistema de autenticación JWT y tokens complejos
- ✅ Creados 3 endpoints simples de usuarios: `/register`, `/login`, `/usuario/{id}`
- ✅ Endpoint de proteínas: `/api/v1/products`
- ✅ Base de datos con 2 tablas: `productos` y `usuarios`
- ✅ Sin validaciones complejas, todo súper básico
- ✅ Contraseñas en texto plano (solo para universidad)
- ✅ CORS configurado para aceptar peticiones del frontend

### Frontend
- ✅ Cambiado endpoint de proteínas a `http://localhost:8000/api/v1/products`
- ✅ Login y registro ahora usan el backend (pero siguen guardando en localStorage)
- ✅ Carrito sigue funcionando solo con localStorage

## 📝 Notas Importantes (Proyecto Universitario)

⚠️ **Este proyecto NO tiene seguridad real**:
- Contraseñas en texto plano en localStorage
- Sin validaciones robustas
- Sin manejo de errores complejo
- Todo muy básico (como debe ser para la universidad)
- Funciona solo en localhost

## 🗄️ Base de Datos

```sql
-- Tabla de productos (proteínas)
CREATE TABLE productos (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    price REAL,
    images TEXT,       -- URLs separadas por comas
    category TEXT
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    email TEXT UNIQUE,
    password TEXT      -- Texto plano (solo para universidad)
);
```

**Datos de ejemplo:**
- 8 proteínas con imágenes de Unsplash
- 1 usuario de prueba:
  - Email: `test@test.com`
  - Contraseña: `1234`
