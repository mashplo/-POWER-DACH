# 📚 Documentación API Backend - Power Dutch

## 🎯 **Resumen**
API REST para la aplicación Power Dutch (tienda de productos de gimnasio) que actualmente funciona con localStorage.

## 🛠️ **Stack Tecnológico Recomendado**
- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB o PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: express-validator
- **Encriptación**: bcrypt

---

## 📋 **Endpoints Requeridos**

### 🔐 **Autenticación**

#### `POST /api/auth/register`
**Descripción**: Registrar nuevo usuario  
**Body**:
```json
{
  "nombre": "string (requerido, min: 2 caracteres)",
  "email": "string (requerido, formato email único)",
  "password": "string (requerido, min: 4 caracteres)"
}
```
**Respuesta Exitosa (201)**:
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "number",
    "nombre": "string",
    "email": "string",
    "fechaRegistro": "ISO string"
  }
}
```
**Errores**:
- `400`: Datos inválidos
- `409`: Email ya registrado

---

#### `POST /api/auth/login`
**Descripción**: Iniciar sesión  
**Body**:
```json
{
  "email": "string (requerido)",
  "password": "string (requerido)"
}
```
**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "JWT_TOKEN",
  "user": {
    "id": "number",
    "nombre": "string",
    "email": "string"
  }
}
```
**Errores**:
- `400`: Datos faltantes
- `401`: Credenciales incorrectas

---

### 👤 **Usuarios**

#### `GET /api/users/profile`
**Descripción**: Obtener perfil del usuario autenticado  
**Headers**: `Authorization: Bearer JWT_TOKEN`  
**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "user": {
    "id": "number",
    "nombre": "string",
    "email": "string",
    "fechaRegistro": "ISO string"
  }
}
```
**Errores**:
- `401`: Token inválido/expirado

---

### 🛍️ **Productos**

#### `GET /api/products`
**Descripción**: Obtener todos los productos (principalmente proteínas)  
**Query Parameters**:
- `categoria` (opcional): string - Filtrar por categoría
- `limit` (opcional): number - Límite de resultados
- `page` (opcional): number - Página (para paginación)

**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "price": "number",
      "images": ["array de URLs"],
      "category": "string",
      "stock": "number",
      "createdAt": "ISO string"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
  }
}
```

---

#### `GET /api/products/:id`
**Descripción**: Obtener producto específico  
**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "price": "number",
    "images": ["array de URLs"],
    "category": "string",
    "stock": "number",
    "createdAt": "ISO string"
  }
}
```
**Errores**:
- `404`: Producto no encontrado

---

### 🛒 **Carrito de Compras**

#### `GET /api/cart`
**Descripción**: Obtener carrito del usuario autenticado  
**Headers**: `Authorization: Bearer JWT_TOKEN`  
**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "data": {
    "id": "number",
    "userId": "number",
    "items": [
      {
        "id": "number",
        "productId": "number",
        "quantity": "number",
        "product": {
          "id": "number",
          "title": "string",
          "price": "number",
          "images": ["array"]
        }
      }
    ],
    "total": "number",
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  }
}
```

---

#### `POST /api/cart/add`
**Descripción**: Agregar producto al carrito  
**Headers**: `Authorization: Bearer JWT_TOKEN`  
**Body**:
```json
{
  "productId": "number (requerido)",
  "quantity": "number (opcional, default: 1)"
}
```
**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Producto agregado al carrito",
  "data": {
    "cartId": "number",
    "itemId": "number"
  }
}
```
**Errores**:
- `404`: Producto no encontrado
- `400`: Stock insuficiente

---

#### `DELETE /api/cart/remove/:productId`
**Descripción**: Remover producto del carrito  
**Headers**: `Authorization: Bearer JWT_TOKEN`  
**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Producto removido del carrito"
}
```

---

#### `DELETE /api/cart/clear`
**Descripción**: Vaciar carrito completo  
**Headers**: `Authorization: Bearer JWT_TOKEN`  
**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "message": "Carrito vaciado"
}
```

---

### 💳 **Órdenes/Compras**

#### `POST /api/orders/checkout`
**Descripción**: Completar compra (convertir carrito en orden)  
**Headers**: `Authorization: Bearer JWT_TOKEN`  
**Body**:
```json
{
  "metodoPago": "string (opcional)",
  "direccionEnvio": "string (opcional)"
}
```
**Respuesta Exitosa (201)**:
```json
{
  "success": true,
  "message": "Compra completada exitosamente",
  "data": {
    "orderId": "number",
    "total": "number",
    "items": [
      {
        "productId": "number",
        "quantity": "number",
        "price": "number"
      }
    ],
    "status": "string",
    "createdAt": "ISO string"
  }
}
```
**Errores**:
- `400`: Carrito vacío
- `409`: Stock insuficiente

---

#### `GET /api/orders`
**Descripción**: Obtener historial de órdenes del usuario  
**Headers**: `Authorization: Bearer JWT_TOKEN`  
**Respuesta Exitosa (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "total": "number",
      "status": "string",
      "itemCount": "number",
      "createdAt": "ISO string"
    }
  ]
}
```

---

## 🗄️ **Esquemas de Base de Datos**

### **Tabla: users**
```sql
id: PRIMARY KEY, AUTO_INCREMENT
nombre: VARCHAR(100) NOT NULL
email: VARCHAR(255) UNIQUE NOT NULL
password: VARCHAR(255) NOT NULL (hasheada con bcrypt)
fecha_registro: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### **Tabla: products**
```sql
id: PRIMARY KEY, AUTO_INCREMENT
title: VARCHAR(255) NOT NULL
description: TEXT
price: DECIMAL(10,2) NOT NULL
images: JSON (array de URLs)
category: VARCHAR(50) DEFAULT 'proteina'
stock: INT DEFAULT 0
created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### **Tabla: carts**
```sql
id: PRIMARY KEY, AUTO_INCREMENT
user_id: FOREIGN KEY REFERENCES users(id)
created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### **Tabla: cart_items**
```sql
id: PRIMARY KEY, AUTO_INCREMENT
cart_id: FOREIGN KEY REFERENCES carts(id)
product_id: FOREIGN KEY REFERENCES products(id)
quantity: INT NOT NULL DEFAULT 1
created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### **Tabla: orders**
```sql
id: PRIMARY KEY, AUTO_INCREMENT
user_id: FOREIGN KEY REFERENCES users(id)
total: DECIMAL(10,2) NOT NULL
status: ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed'
metodo_pago: VARCHAR(50)
direccion_envio: TEXT
created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### **Tabla: order_items**
```sql
id: PRIMARY KEY, AUTO_INCREMENT
order_id: FOREIGN KEY REFERENCES orders(id)
product_id: FOREIGN KEY REFERENCES products(id)
quantity: INT NOT NULL
price: DECIMAL(10,2) NOT NULL
```

---

## 🚀 **Configuración Inicial**

### **Variables de Entorno (.env)**
```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=power_dutch
DB_USER=tu_usuario
DB_PASS=tu_password

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### **Estructura de Carpetas Sugerida**
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── config/
│   │   └── database.js
│   └── app.js
├── package.json
└── server.js
```

---

## 🔧 **Middleware Requerido**

### **CORS**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### **Autenticación JWT**
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};
```

---

## 📤 **Datos de Ejemplo (Seeders)**

### **Productos de Proteína**
```json
[
  {
    "title": "Whey Protein Premium",
    "description": "Proteína de suero de alta calidad",
    "price": 89.99,
    "images": ["url1.jpg", "url2.jpg"],
    "category": "proteina",
    "stock": 50
  },
  {
    "title": "Creatina Monohidrato",
    "description": "Creatina pura para rendimiento",
    "price": 45.50,
    "images": ["url3.jpg"],
    "category": "suplemento",
    "stock": 30
  }
]
```

---

## ⚠️ **Consideraciones Importantes**

1. **Seguridad**: Hashear passwords con bcrypt (salt rounds: 12)
2. **Validación**: Validar todos los inputs del frontend
3. **Manejo de Errores**: Respuestas consistentes con formato estándar
4. **Rate Limiting**: Para prevenir spam en login/register
5. **Logs**: Implementar logging para debugging
6. **Testing**: Crear tests para endpoints críticos

---

## 🎯 **Prioridad de Implementación**

1. **Alta**: Auth (login/register), Productos (GET), Carrito básico
2. **Media**: Carrito completo, Checkout simple
3. **Baja**: Historial de órdenes, Paginación avanzada

¡Esta API reemplazará completamente el localStorage y proporcionará persistencia real para tu aplicación! 🚀