# Power DACH - Tienda de Suplementos Deportivos

Aplicación web completa para una tienda de suplementos deportivos con React (frontend) y FastAPI (backend).

## 📁 Estructura del Proyecto

```
power-dach/
├── backend/                # API REST con FastAPI
│   ├── src/                # Código fuente
│   │   ├── app.py          # Aplicación y endpoints
│   │   └── database.py     # Configuración BD
│   ├── assets/productos/   # Imágenes de productos
│   ├── tests/              # Tests unitarios
│   ├── run.py              # Iniciar servidor
│   ├── init_local.py       # Inicializar BD
│   └── requirements.txt    # Dependencias Python
│
├── frontend/               # Aplicación React + Vite
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas de la app
│   │   ├── herramientas/   # Utilidades y API
│   │   └── layouts/        # Layouts base
│   ├── public/             # Archivos estáticos
│   └── package.json        # Dependencias Node
│
└── README.md               # Este archivo
```

## 🚀 Inicio Rápido

### Requisitos
- Python 3.10+
- Node.js 18+

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
python init_local.py    # Primera vez: inicializa BD
python run.py           # Inicia servidor en http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev             # Inicia en http://localhost:5173
```

## 👤 Credenciales de Prueba

| Usuario | Email | Contraseña |
|---------|-------|------------|
| Admin | admin@powertech.com | admin123 |
| Usuario | usuario@test.com | test123 |

## 🛠️ Tecnologías

### Backend
- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM para base de datos
- **SQLite** - Base de datos local
- **bcrypt** - Encriptación de contraseñas
- **python-jose** - Tokens JWT

### Frontend
- **React 19** - Librería UI
- **Vite** - Bundler rápido
- **TailwindCSS + DaisyUI** - Estilos
- **React Router** - Navegación SPA
- **Sonner** - Notificaciones

## 📡 API Endpoints

Documentación completa en: http://localhost:8000/docs

### Productos
- `GET /api/v1/products` - Listar proteínas
- `GET /api/v1/creatinas` - Listar creatinas
- `GET /api/v1/preentrenos` - Listar pre-entrenos

### Autenticación
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Usuario actual

### Pedidos
- `POST /api/v1/boletas` - Crear pedido
- `GET /api/v1/boletas/{id}` - Detalle de pedido

## 🧪 Tests

```bash
cd backend
pytest tests/ -v
```

## 📝 Licencia

Proyecto universitario - Uso educativo.
