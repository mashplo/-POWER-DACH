# Power DACH - Backend API

API REST para la tienda de suplementos deportivos Power DACH.

## 📁 Estructura del Proyecto

```
backend/
├── src/                    # Código fuente principal
│   ├── __init__.py
│   ├── app.py              # Aplicación FastAPI y endpoints
│   └── database.py         # Configuración de base de datos
├── assets/
│   └── productos/          # Imágenes de productos
├── tests/                  # Tests unitarios
│   └── test_endpoints.py
├── run.py                  # Script de inicio del servidor
├── init_local.py           # Inicialización de BD con datos de prueba
├── requirements.txt        # Dependencias Python
├── pytest.ini              # Configuración de tests
└── proteinas.db            # Base de datos SQLite (generada)
```

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 2. Inicializar base de datos (primera vez)

```bash
python init_local.py
```

Esto crea:
- Tablas de la base de datos
- Usuario admin: `admin@powertech.com` / `admin123`
- Usuario de prueba: `usuario@test.com` / `test123`
- Productos de ejemplo

### 3. Iniciar servidor

```bash
python run.py
```

El servidor estará disponible en:
- **API**: http://localhost:8000
- **Documentación**: http://localhost:8000/docs

## 🧪 Ejecutar Tests

```bash
pytest tests/ -v
```

## 📡 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/products` | Listar proteínas |
| GET | `/api/v1/creatinas` | Listar creatinas |
| GET | `/api/v1/preentrenos` | Listar pre-entrenos |
| POST | `/api/v1/auth/register` | Registrar usuario |
| POST | `/api/v1/auth/login` | Iniciar sesión |
| GET | `/api/v1/auth/me` | Obtener usuario actual |
| POST | `/api/v1/boletas` | Crear pedido |
| GET | `/api/v1/health` | Estado del servidor |

## ⚙️ Variables de Entorno (Opcional)

Copia `.env.example` a `.env` para personalizar:

```
SECRET_KEY=tu-clave-secreta
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Por defecto usa SQLite local (`proteinas.db`).
