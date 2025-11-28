# Backend

API v2 para el proyecto POWER-DACH. Incluye endpoints para productos, creatinas, preentrenos, boletas y usuarios.

## Ejecutar localmente

```powershell
python -m uvicorn backend.app:app --app-dir backend --host 127.0.0.1 --port 8000
```

## Endpoints principales
- GET `/api/v2/products`
- GET `/api/v2/creatinas`
- GET `/api/v2/preentrenos`
- POST `/api/v2/auth/register`
- POST `/api/v2/auth/login`
- GET `/api/v2/auth/me`
- GET/POST/DELETE `/api/v2/boletas` (admin)
- GET/PUT/DELETE `/api/v2/users` (admin)

## Arquitectura v2
- Routers: `backend/backend/routers/*_v2.py`
- Servicios: `backend/backend/services/*`
- Repositorios: `backend/backend/repos/*`
- Esquemas: `backend/backend/schemas/*`
- Núcleo (config/seguridad): `backend/backend/core/*`

## Scripts utilitarios
Centraliza los scripts en `backend/scripts/`.

Mover aquí:
- `agregar_creatina_*.py`
- `agregar_preentreno_*.py`
- `crear_productos.py`
- `eliminar_duplicado.py`
- `runner.py`

Antes de correr scripts, realiza copia de `backend/backend/proteinas.db`.

## Base de datos
Por defecto usa SQLite en `backend/backend/proteinas.db`.

## Despliegue Railway
Ver `RAILWAY_DEPLOY.md`.
