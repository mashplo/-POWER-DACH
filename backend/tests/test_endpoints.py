import pytest
from fastapi.testclient import TestClient
import os
import tempfile
from backend.app import app
from backend.database import get_db, inicializar_db
from datetime import datetime

# Cliente de prueba
client = TestClient(app)

# Variables globales para las pruebas
test_user_data = {
    "nombre": "Usuario Test",
    "email": "test@example.com",
    "password": "1234"
}

test_login_data = {
    "email": "test@example.com",
    "password": "1234"
}

token_usuario = None

def crear_productos_test():
    """Crear productos para testing"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Limpiar datos existentes
    cursor.execute("DELETE FROM carrito_items")
    cursor.execute("DELETE FROM carritos") 
    cursor.execute("DELETE FROM productos")
    cursor.execute("DELETE FROM usuarios")
    
    productos_test = [
        {
            "title": "Proteína Test",
            "description": "Proteína para testing",
            "price": 50.0,
            "images": "https://test.com/img1.jpg",
            "category": "proteinas",
            "stock": 10
        },
        {
            "title": "Creatina Test",
            "description": "Creatina para testing",
            "price": 30.0,
            "images": "https://test.com/img2.jpg",
            "category": "suplementos",
            "stock": 5
        }
    ]
    
    for producto in productos_test:
        cursor.execute("""
            INSERT INTO productos (title, description, price, images, category, stock, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            producto["title"],
            producto["description"],
            producto["price"],
            producto["images"],
            producto["category"],
            producto["stock"],
            datetime.now().isoformat()
        ))
    
    conn.commit()
    conn.close()

# Ejecutar al inicio de los tests
crear_productos_test()


class TestAuth:
    """Tests para endpoints de autenticación"""
    
    def test_registro_usuario_exitoso(self):
        """Test registro de usuario exitoso"""
        response = client.post("/api/auth/register", json=test_user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["success"] == True
        assert data["message"] == "Usuario creado exitosamente"
        assert data["user"]["nombre"] == test_user_data["nombre"]
        assert data["user"]["email"] == test_user_data["email"]
        assert "id" in data["user"]
        assert "fechaRegistro" in data["user"]
    
    def test_registro_email_duplicado(self):
        """Test registro con email duplicado"""
        # Intentar registrar el mismo usuario otra vez
        response = client.post("/api/auth/register", json=test_user_data)
        
        assert response.status_code == 409
        data = response.json()
        assert "Email ya registrado" in data["detail"]
    
    def test_registro_datos_invalidos(self):
        """Test registro con datos inválidos"""
        datos_invalidos = {
            "nombre": "A",  # Muy corto
            "email": "test@example.com",
            "password": "123"  # Muy corta
        }
        
        response = client.post("/api/auth/register", json=datos_invalidos)
        # FastAPI devuelve 422 para errores de validación de Pydantic
        assert response.status_code == 422
    
    def test_login_exitoso(self):
        """Test login exitoso"""
        global token_usuario
        
        response = client.post("/api/auth/login", json=test_login_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["message"] == "Login exitoso"
        assert "token" in data
        assert data["user"]["email"] == test_login_data["email"]
        
        # Guardar token para otros tests
        token_usuario = data["token"]
    
    def test_login_credenciales_incorrectas(self):
        """Test login con credenciales incorrectas"""
        datos_incorrectos = {
            "email": "test@example.com",
            "password": "password_incorrecto"
        }
        
        response = client.post("/api/auth/login", json=datos_incorrectos)
        
        assert response.status_code == 401
        data = response.json()
        assert "Credenciales incorrectas" in data["detail"]
    
    def test_login_datos_faltantes(self):
        """Test login con datos faltantes"""
        datos_incompletos = {"email": "test@example.com"}
        
        response = client.post("/api/auth/login", json=datos_incompletos)
        assert response.status_code == 422  # Validation error


class TestUsuarios:
    """Tests para endpoints de usuarios"""
    
    def test_obtener_perfil_con_token_valido(self):
        """Test obtener perfil con token válido"""
        headers = {"Authorization": f"Bearer {token_usuario}"}
        
        response = client.get("/api/users/profile", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["user"]["email"] == test_user_data["email"]
        assert data["user"]["nombre"] == test_user_data["nombre"]
        assert "fechaRegistro" in data["user"]
    
    def test_obtener_perfil_sin_token(self):
        """Test obtener perfil sin token"""
        response = client.get("/api/users/profile")
        
        assert response.status_code == 401
        data = response.json()
        assert "Token inválido" in data["detail"]
    
    def test_obtener_perfil_token_invalido(self):
        """Test obtener perfil con token inválido"""
        headers = {"Authorization": "Bearer token_falso_123"}
        
        response = client.get("/api/users/profile", headers=headers)
        
        assert response.status_code == 401
        data = response.json()
        assert "Token inválido" in data["detail"]


class TestProductos:
    """Tests para endpoints de productos"""
    
    def test_obtener_todos_los_productos(self):
        """Test obtener todos los productos"""
        response = client.get("/api/products")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert "pagination" in data
        assert isinstance(data["data"], list)
        assert len(data["data"]) > 0  # Debería haber productos de ejemplo
    
    def test_obtener_productos_con_filtro_categoria(self):
        """Test obtener productos filtrados por categoría"""
        response = client.get("/api/products?categoria=proteinas")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        
        # Verificar que todos los productos sean de la categoría solicitada
        for producto in data["data"]:
            assert producto["category"] == "proteinas"
    
    def test_obtener_productos_con_paginacion(self):
        """Test obtener productos con paginación"""
        response = client.get("/api/products?limit=2&page=1")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert len(data["data"]) <= 2
        assert data["pagination"]["currentPage"] == 1
        assert "totalPages" in data["pagination"]
        assert "totalItems" in data["pagination"]
    
    def test_obtener_producto_por_id(self):
        """Test obtener producto específico por ID"""
        # Primero obtener lista de productos para conseguir un ID válido
        response = client.get("/api/products")
        productos = response.json()["data"]
        
        if len(productos) > 0:
            producto_id = productos[0]["id"]
            
            response = client.get(f"/api/products/{producto_id}")
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] == True
            assert data["data"]["id"] == producto_id
            assert "title" in data["data"]
            assert "price" in data["data"]
            assert "images" in data["data"]
            assert isinstance(data["data"]["images"], list)
    
    def test_obtener_producto_inexistente(self):
        """Test obtener producto que no existe"""
        response = client.get("/api/products/99999")
        
        assert response.status_code == 404
        data = response.json()
        assert "Producto no encontrado" in data["detail"]


class TestCarrito:
    """Tests para endpoints de carrito"""
    
    def test_obtener_carrito_vacio(self):
        """Test obtener carrito vacío (nuevo usuario)"""
        headers = {"Authorization": f"Bearer {token_usuario}"}
        
        response = client.get("/api/cart", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["data"]["items"] == []
        assert data["data"]["total"] == 0
    
    def test_agregar_producto_al_carrito(self):
        """Test agregar producto al carrito"""
        headers = {"Authorization": f"Bearer {token_usuario}"}
        
        # Obtener un producto válido
        response = client.get("/api/products")
        productos = response.json()["data"]
        
        if len(productos) > 0:
            producto_id = productos[0]["id"]
            
            # Agregar al carrito
            response = client.post(
                "/api/cart/add",
                json={"productId": producto_id, "quantity": 2},
                headers=headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] == True
            assert data["message"] == "Producto agregado al carrito"
            assert "cartId" in data["data"]
            assert "itemId" in data["data"]
    
    def test_obtener_carrito_con_productos(self):
        """Test obtener carrito con productos"""
        headers = {"Authorization": f"Bearer {token_usuario}"}
        
        # Primero agregar un producto al carrito
        response = client.get("/api/products")
        productos = response.json()["data"]
        
        if len(productos) > 0:
            producto_id = productos[0]["id"]
            
            # Agregar producto al carrito primero
            client.post(
                "/api/cart/add",
                json={"productId": producto_id, "quantity": 1},
                headers=headers
            )
        
        # Ahora obtener el carrito
        response = client.get("/api/cart", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        
        # Si agregamos productos, debería haber items
        if len(productos) > 0:
            assert len(data["data"]["items"]) > 0
            assert data["data"]["total"] > 0
            
            # Verificar estructura del item
            item = data["data"]["items"][0]
            assert "id" in item
            assert "productId" in item
            assert "quantity" in item
            assert "product" in item
            assert "title" in item["product"]
            assert "price" in item["product"]
    
    def test_agregar_producto_inexistente_al_carrito(self):
        """Test agregar producto inexistente al carrito"""
        headers = {"Authorization": f"Bearer {token_usuario}"}
        
        response = client.post(
            "/api/cart/add",
            json={"productId": 99999, "quantity": 1},
            headers=headers
        )
        
        assert response.status_code == 404
        data = response.json()
        assert "Producto no encontrado" in data["detail"]
    
    def test_remover_producto_del_carrito(self):
        """Test remover producto del carrito"""
        headers = {"Authorization": f"Bearer {token_usuario}"}
        
        # Obtener carrito para conseguir un producto
        response = client.get("/api/cart", headers=headers)
        carrito = response.json()["data"]
        
        if len(carrito["items"]) > 0:
            producto_id = carrito["items"][0]["productId"]
            
            # Remover producto
            response = client.delete(f"/api/cart/remove/{producto_id}", headers=headers)
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] == True
            assert data["message"] == "Producto removido del carrito"
    
    def test_vaciar_carrito(self):
        """Test vaciar carrito completo"""
        headers = {"Authorization": f"Bearer {token_usuario}"}
        
        response = client.delete("/api/cart/clear", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert data["message"] == "Carrito vaciado"
        
        # Verificar que el carrito esté vacío
        response = client.get("/api/cart", headers=headers)
        carrito = response.json()["data"]
        assert len(carrito["items"]) == 0
        assert carrito["total"] == 0
    
    def test_operaciones_carrito_sin_token(self):
        """Test operaciones de carrito sin token"""
        # Obtener carrito
        response = client.get("/api/cart")
        assert response.status_code == 401
        
        # Agregar producto
        response = client.post("/api/cart/add", json={"productId": 1, "quantity": 1})
        assert response.status_code == 401
        
        # Remover producto
        response = client.delete("/api/cart/remove/1")
        assert response.status_code == 401
        
        # Vaciar carrito
        response = client.delete("/api/cart/clear")
        assert response.status_code == 401


class TestRoot:
    """Test para endpoint raíz"""
    
    def test_root_endpoint(self):
        """Test endpoint raíz"""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data == {"Hello": "World"}


if __name__ == "__main__":
    # Ejecutar tests
    pytest.main([__file__, "-v"])