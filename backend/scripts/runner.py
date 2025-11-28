# MOVIDO desde backend/backend/runner.py
import os
import uvicorn


def ejecutar_api():
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "false").lower() == "true"
    uvicorn.run("backend.app:app", host="0.0.0.0", port=port, reload=reload)


if __name__ == "__main__":
    ejecutar_api()
