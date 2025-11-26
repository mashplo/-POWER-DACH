import os
import uvicorn

def ejecutar_api():
    # Usa el puerto definido por Railway si existe, si no 8000
    port = int(os.getenv("PORT", "8000"))
    # En entornos de producción (e.g., Railway) evitar reload para mayor estabilidad
    reload = os.getenv("RELOAD", "false").lower() == "true"
    uvicorn.run("backend.app:app", host="0.0.0.0", port=port, reload=reload)

if __name__ == "__main__":
    ejecutar_api()