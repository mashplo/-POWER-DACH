# Tests de la API

Este archivo contiene tests automatizados para todos los endpoints de la API.

## Ejecutar los tests

```bash
# Ejecutar todos los tests
poetry run pytest tests/test_endpoints.py -v

# Ejecutar tests de una clase específica
poetry run pytest tests/test_endpoints.py::TestAuth -v
poetry run pytest tests/test_endpoints.py::TestProductos -v
poetry run pytest tests/test_endpoints.py::TestCarrito -v

# Ejecutar un test específico
poetry run pytest tests/test_endpoints.py::TestAuth::test_login_exitoso -v
```

## Estructura de los tests

### TestAuth
- ✅ Registro de usuario exitoso
- ✅ Error por email duplicado
- ✅ Error por datos inválidos
- ✅ Login exitoso
- ✅ Error por credenciales incorrectas
- ✅ Error por datos faltantes

### TestUsuarios
- ✅ Obtener perfil con token válido
- ✅ Error sin token
- ✅ Error con token inválido

### TestProductos
- ✅ Obtener todos los productos
- ✅ Filtrar productos por categoría
- ✅ Paginación de productos
- ✅ Obtener producto por ID
- ✅ Error producto no encontrado

### TestCarrito
- ✅ Obtener carrito vacío
- ✅ Agregar producto al carrito
- ✅ Obtener carrito con productos
- ✅ Error agregar producto inexistente
- ✅ Remover producto del carrito
- ✅ Vaciar carrito completo
- ✅ Errores sin autenticación

### TestRoot
- ✅ Endpoint raíz funcionando

## Notas importantes

- Los tests limpian la base de datos antes de ejecutarse
- Se crean productos de prueba automáticamente
- Cada test es independiente
- Se valida tanto el código de respuesta como la estructura de datos
- Los tests cubren casos exitosos y de error

## Datos de prueba

Los tests usan estos datos:
- Usuario: "Usuario Test" <test@example.com> password: "1234"
- Productos: "Proteína Test" y "Creatina Test"
- Tokens de autenticación generados automáticamente

¡Todos los 22 tests pasan exitosamente! ✅