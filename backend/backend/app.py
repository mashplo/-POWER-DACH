from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from backend.database import get_db, inicializar_db
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

# Modelos simples
class Usuario(BaseModel):
    nombre: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

@app.get("/")
def read_root():
    return {"mensaje": "API de Proteinas - Proyecto Universitario"}

# ===== ENDPOINTS DE PROTEÍNAS =====

@app.get("/api/v1/products")
def obtener_proteinas(min_price: float | None = None):
    """Obtener lista de proteínas, opcionalmente filtradas por precio mínimo.

    Query Params:
    - min_price: filtra productos con precio estrictamente mayor a este valor.
    """
    conn = get_db()
    cursor = conn.cursor()
    base_query = "SELECT * FROM productos"
    params: list = []
    if min_price is not None:
        base_query += " WHERE price > ?"
        params.append(min_price)
    cursor.execute(base_query, params)
    productos = cursor.fetchall()
    conn.close()

    productos_formateados = []
    for producto in productos:
        producto_dict = dict(producto)
        if "images" in producto_dict and producto_dict["images"]:
            producto_dict["images"] = producto_dict["images"].split(",")
        else:
            producto_dict["images"] = []
        productos_formateados.append(producto_dict)
    return productos_formateados

@app.get("/api/products")
def obtener_proteinas_alias(min_price: float | None = None):
    """Alias sin versión para compatibilidad con frontend (misma lógica)."""
    return obtener_proteinas(min_price)

# ===== ENDPOINTS DE CREATINAS =====

@app.get("/api/v1/creatinas")
def obtener_creatinas():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM creatinas")
    creatinas = cursor.fetchall()
    conn.close()
    
    # Formatear creatinas para que coincidan con el formato del API
    creatinas_formateadas = []
    for creatina in creatinas:
        creatina_dict = dict(creatina)
        # Convertir images de string a array
        if "images" in creatina_dict and creatina_dict["images"]:
            creatina_dict["images"] = creatina_dict["images"].split(",")
        else:
            creatina_dict["images"] = []
        creatinas_formateadas.append(creatina_dict)
    
    return creatinas_formateadas

# ===== ENDPOINTS DE USUARIOS (SÚPER SIMPLES) =====

@app.post("/api/register")
def registrar_usuario(usuario: Usuario):
    conn = get_db()
    cursor = conn.cursor()
    
    # Verificar si el email ya existe
    cursor.execute("SELECT * FROM usuarios WHERE email = ?", (usuario.email,))
    existe = cursor.fetchone()
    
    if existe:
        conn.close()
        return {"success": False, "error": "Email ya registrado"}
    
    # Insertar usuario
    cursor.execute(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        (usuario.nombre, usuario.email, usuario.password)
    )
    conn.commit()
    usuario_id = cursor.lastrowid
    conn.close()
    
    return {
        "success": True,
        "usuario": {
            "id": usuario_id,
            "nombre": usuario.nombre,
            "email": usuario.email
        }
    }

@app.post("/api/login")
def login(datos: Login):
    conn = get_db()
    cursor = conn.cursor()
    
    # Buscar usuario
    cursor.execute(
        "SELECT * FROM usuarios WHERE email = ? AND password = ?",
        (datos.email, datos.password)
    )
    usuario = cursor.fetchone()
    conn.close()
    
    if not usuario:
        return {"success": False, "error": "Email o contraseña incorrectos"}
    
    return {
        "success": True,
        "usuario": {
            "id": usuario["id"],
            "nombre": usuario["nombre"],
            "email": usuario["email"]
        }
    }

@app.get("/api/usuario/{usuario_id}")
def obtener_usuario(usuario_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM usuarios WHERE id = ?", (usuario_id,))
    usuario = cursor.fetchone()
    conn.close()
    
    if not usuario:
        return {"success": False, "error": "Usuario no encontrado"}
    
    return {
        "success": True,
        "usuario": {
            "id": usuario["id"],
            "nombre": usuario["nombre"],
            "email": usuario["email"]
        }
    }

