import pytest
from fastapi.testclient import TestClient
from src.app import app

# Cliente de prueba
client = TestClient(app)


class TestRoot:
    """Test para endpoint raíz"""
    
    def test_root_endpoint(self):
        """Test endpoint raíz"""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "mensaje" in data


class TestHealth:
    """Test para endpoint de salud"""
    
    def test_health_check(self):
        """Test endpoint de salud"""
        response = client.get("/api/v1/health")
        
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"


class TestProductos:
    """Tests para endpoints de productos"""
    
    def test_obtener_productos(self):
        """Test obtener productos/proteínas"""
        response = client.get("/api/v1/products")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_obtener_creatinas(self):
        """Test obtener creatinas"""
        response = client.get("/api/v1/creatinas")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_obtener_preentrenos(self):
        """Test obtener pre-entrenos"""
        response = client.get("/api/v1/preentrenos")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_filtrar_por_precio(self):
        """Test filtrar productos por precio"""
        response = client.get("/api/v1/products?min_price=50000&max_price=200000")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Verificar que todos los productos están en el rango
        for producto in data:
            assert producto["price"] >= 50000
            assert producto["price"] <= 200000
    
    def test_buscar_productos(self):
        """Test buscar productos por texto"""
        response = client.get("/api/v1/products?search=whey")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestAuth:
    """Tests para autenticación"""
    
    def test_register_and_login(self):
        """Test registro y login de usuario"""
        # Registrar usuario único
        import time
        email = f"test_{int(time.time())}@test.com"
        
        response = client.post("/api/v1/auth/register", json={
            "nombre": "Test User",
            "email": email,
            "password": "testpass123"
        })
        
        # Puede fallar si el usuario ya existe, verificamos ambos casos
        assert response.status_code in [200, 400]
        
        if response.status_code == 200:
            data = response.json()
            assert "id" in data
            assert data["email"] == email
            
            # Intentar login
            login_response = client.post("/api/v1/auth/login", json={
                "email": email,
                "password": "testpass123"
            })
            
            assert login_response.status_code == 200
            login_data = login_response.json()
            assert "access_token" in login_data
    
    def test_login_invalid_credentials(self):
        """Test login con credenciales inválidas"""
        response = client.post("/api/v1/auth/login", json={
            "email": "noexiste@test.com",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401


if __name__ == "__main__":
    # Ejecutar tests
    pytest.main([__file__, "-v"])
