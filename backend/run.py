"""
POWER-DACH Backend - Script de ejecución
"""
import uvicorn
import os
import sys

# Obtener directorio del script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Agregar src al path
sys.path.insert(0, SCRIPT_DIR)

# Cambiar al directorio del backend para que uvicorn encuentre src/
os.chdir(SCRIPT_DIR)

if __name__ == "__main__":
    print("🚀 Iniciando POWER-DACH Backend...")
    print("📖 Documentación: http://localhost:8000/docs")
    print("🔗 API: http://localhost:8000/api")
    
    uvicorn.run(
        "src.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[os.path.join(SCRIPT_DIR, "src")]
    )
