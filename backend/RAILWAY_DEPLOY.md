# Deploy Backend en Railway con MySQL

## 🚀 Configuración de Variables de Entorno en Railway

Una vez que tengas tu base de datos MySQL creada en Railway, configura las siguientes variables de entorno en tu servicio backend:

### Variables Requeridas:

```bash
# Railway asigna automáticamente PORT, no es necesario configurarlo manualmente
# PORT=8000

# Cadena de conexión MySQL (Railway te proporciona estas credenciales)
DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:PORT/DATABASE

# Ejemplo de formato:
# DATABASE_URL=mysql+pymysql://root:mypassword@containers-us-west-123.railway.app:6789/railway
```

### Variables Opcionales:

```bash
# Para habilitar reload en desarrollo (no recomendado en producción)
RELOAD=false
```

## 📦 Pasos para Deploy

### 1. Crear Servicio de Base de Datos MySQL en Railway

1. En tu proyecto Railway, añade un nuevo servicio
2. Selecciona "Database" → "MySQL"
3. Railway creará automáticamente la base de datos y generará las credenciales
4. Copia el valor de `DATABASE_URL` o construye la URL con los datos proporcionados:
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

### 2. Crear Servicio Backend en Railway

1. En tu proyecto Railway, añade un nuevo servicio
2. Selecciona "GitHub Repo" y conecta tu repositorio
3. Railway detectará automáticamente el backend y usará `railway.json`
4. Configura el Root Directory: `backend`

### 3. Configurar Variables de Entorno del Backend

En el servicio backend, ve a "Variables" y añade:

```
DATABASE_URL=mysql+pymysql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

**IMPORTANTE:** Reemplaza `[USER]`, `[PASSWORD]`, `[HOST]`, `[PORT]`, `[DATABASE]` con los valores reales de tu base de datos MySQL.

### 4. Deploy Automático

Railway desplegará automáticamente cuando hagas push a tu rama principal. El comando de inicio está configurado en `railway.json`:

```bash
python -m uvicorn backend.app:app --host 0.0.0.0 --port $PORT
```

### 5. Inicializar Base de Datos

Después del primer deploy, las tablas se crearán automáticamente cuando la aplicación se inicie (gracias a `inicializar_db()` en `app.py`).

Si necesitas poblar datos iniciales, puedes:
- Ejecutar scripts de seed manualmente
- Conectarte a la base de datos MySQL desde un cliente externo
- Usar Railway CLI para ejecutar comandos

## 🔍 Verificación

Una vez desplegado, Railway te proporcionará una URL pública del tipo:
```
https://tu-backend-production.up.railway.app
```

Prueba los endpoints:
- `GET /` - Mensaje de bienvenida
- `GET /api/v1/products` - Lista de productos
- `GET /api/v1/creatinas` - Lista de creatinas
- `GET /api/v1/preentrenos` - Lista de pre-entrenos

## 📝 Estructura de DATABASE_URL

El formato de la URL de conexión MySQL para SQLAlchemy con PyMySQL es:

```
mysql+pymysql://[usuario]:[contraseña]@[host]:[puerto]/[nombre_database]
```

Ejemplo real:
```
mysql+pymysql://root:ABcd1234xyz@containers-us-west-123.railway.app:6789/railway
```

## 🔧 Troubleshooting

### Error de conexión a la base de datos
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que el servicio MySQL esté en el mismo proyecto Railway
- Verifica que no haya caracteres especiales sin escapar en la contraseña

### Tablas no se crean
- La función `inicializar_db()` se ejecuta automáticamente al iniciar
- Verifica los logs de Railway para ver errores de conexión
- Asegúrate de que el usuario MySQL tenga permisos de CREATE TABLE

### Puerto incorrecto
- Railway asigna `$PORT` automáticamente
- No configures PORT manualmente en las variables de entorno
- El código ya está preparado para leer `os.getenv("PORT")`

## 🎯 Próximos Pasos

1. **Frontend**: Actualiza las URLs del frontend para apuntar a tu backend de Railway
2. **CORS**: Actualiza `allow_origins` en `app.py` si necesitas restringir orígenes
3. **Secrets**: Considera usar variables de entorno para información sensible
4. **Monitoring**: Revisa los logs en Railway Dashboard regularmente
