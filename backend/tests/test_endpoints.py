import pytest
from fastapi.testclient import TestClient
from backend.app import app

# Cliente de prueba
client = TestClient(app)


class TestRoot:
    """Test para endpoint raíz"""
    
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "mensaje" in data


class TestProductosV2:
    """Tests para endpoints de productos v2"""
    
    def test_obtener_productos(self):
        response = client.get("/api/v2/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_obtener_creatinas(self):
        response = client.get("/api/v2/creatinas")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


if __name__ == "__main__":
    # Ejecutar tests
    pytest.main([__file__, "-v"])
