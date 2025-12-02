"""
Power DACH - Tienda de Suplementos
Script de inicio del servidor
"""
import os
import sys
import uvicorn

# Asegurar que el script se ejecute desde su propio directorio
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)
sys.path.insert(0, BASE_DIR)

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 POWER DACH - Servidor de Desarrollo")
    print("=" * 50)
    print()
    print(f"Directorio: {BASE_DIR}")
    print("Servidor: http://localhost:8000")
    print("Documentación API: http://localhost:8000/docs")
    print()
    print("Presiona Ctrl+C para detener")
    print("=" * 50)
    
    uvicorn.run(
        "src.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[BASE_DIR]
    )
