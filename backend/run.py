"""
Power DACH - Tienda de Suplementos
Script de inicio del servidor
"""
import uvicorn

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 POWER DACH - Servidor de Desarrollo")
    print("=" * 50)
    print()
    print("Servidor: http://localhost:8000")
    print("Documentación API: http://localhost:8000/docs")
    print()
    print("Presiona Ctrl+C para detener")
    print("=" * 50)
    
    uvicorn.run(
        "src.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
