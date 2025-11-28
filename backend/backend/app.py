from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.database import inicializar_db
import os

app = FastAPI()

# Configurar CORS para que el frontend pueda acceder
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos (imágenes)
assets_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

inicializar_db()
from backend.routers.auth_v2 import router as auth_v2_router
app.include_router(auth_v2_router)
from backend.routers.products_v2 import router as products_v2_router
app.include_router(products_v2_router)
from backend.routers.boletas_v2 import router as boletas_v2_router
app.include_router(boletas_v2_router)
from backend.routers.users_v2 import router as users_v2_router
app.include_router(users_v2_router)

@app.get("/")
def read_root():
    return {"mensaje": "API de Proteinas - Proyecto Universitario"}
## v1 endpoints eliminados; usar routers v2


