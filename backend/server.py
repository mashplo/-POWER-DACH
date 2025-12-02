"""
Script para iniciar el servidor POWER-DACH
"""
import sys
import os

# Agregar el directorio actual al path de Python
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

import uvicorn

if __name__ == "__main__":
    print("🚀 Iniciando POWER-DACH Backend...")
    print("📖 Documentación: http://localhost:8000/docs")
    print("🔗 API: http://localhost:8000/api")
    
    uvicorn.run(
        "src.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["src"]
    )
