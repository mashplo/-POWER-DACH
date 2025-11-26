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
def obtener_proteinas(
    min_price: float | None = None,
    max_price: float | None = None,
    category: str | None = None,
    product_type: str | None = None,
    search: str | None = None
):
    """Obtener lista de proteínas con filtros múltiples.

    Query Params:
    - min_price: precio mínimo
    - max_price: precio máximo
    - category: filtrar por categoría (Whey Protein, Whey Isolate, etc.)
    - product_type: tipo de producto (Proteína, Creatina)
    - search: búsqueda por título
    """
    conn = get_db()
    cursor = conn.cursor()
    base_query = "SELECT * FROM productos WHERE 1=1"
    params: list = []
    
    if min_price is not None:
        base_query += " AND price >= ?"
        params.append(min_price)
    
    if max_price is not None:
        base_query += " AND price <= ?"
        params.append(max_price)
    
    if category and category != "":
        base_query += " AND category LIKE ?"
        params.append(f"%{category}%")
    
    if search and search != "":
        base_query += " AND title LIKE ?"
        params.append(f"%{search}%")
    
    base_query += " ORDER BY title ASC"
    
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
def obtener_proteinas_alias(
    min_price: float | None = None,
    max_price: float | None = None,
    category: str | None = None,
    product_type: str | None = None,
    search: str | None = None
):
    """Alias sin versión para compatibilidad con frontend (misma lógica)."""
    return obtener_proteinas(min_price, max_price, category, product_type, search)

# ===== ENDPOINTS DE CREATINAS =====

@app.get("/api/v1/creatinas")
def obtener_creatinas(
    min_price: float | None = None,
    max_price: float | None = None,
    category: str | None = None,
    search: str | None = None
):
    """Obtener lista de creatinas con filtros múltiples.

    Query Params:
    - min_price: precio mínimo
    - max_price: precio máximo
    - category: filtrar por categoría (Monohidrato, etc.)
    - search: búsqueda por título
    """
    conn = get_db()
    cursor = conn.cursor()
    base_query = "SELECT * FROM creatinas WHERE 1=1"
    params: list = []
    
    if min_price is not None:
        base_query += " AND price >= ?"
        params.append(min_price)
    
    if max_price is not None:
        base_query += " AND price <= ?"
        params.append(max_price)
    
    if category and category != "":
        base_query += " AND category LIKE ?"
        params.append(f"%{category}%")
    
    if search and search != "":
        base_query += " AND title LIKE ?"
        params.append(f"%{search}%")
    
    base_query += " ORDER BY title ASC"
    
    cursor.execute(base_query, params)
    creatinas = cursor.fetchall()
    conn.close()
    
    creatinas_formateadas = []
    for creatina in creatinas:
        creatina_dict = dict(creatina)
        if "images" in creatina_dict and creatina_dict["images"]:
            creatina_dict["images"] = creatina_dict["images"].split(",")
        else:
            creatina_dict["images"] = []
        creatinas_formateadas.append(creatina_dict)
    
    return creatinas_formateadas

# ===== ENDPOINTS DE PRE-ENTRENOS =====

@app.get("/api/v1/preentrenos")
def obtener_preentrenos(
    min_price: float | None = None,
    max_price: float | None = None,
    category: str | None = None,
    search: str | None = None
):
    """Obtener lista de pre-entrenos con filtros múltiples.

    Query Params:
    - min_price: precio mínimo
    - max_price: precio máximo
    - category: filtrar por categoría
    - search: búsqueda por título
    """
    conn = get_db()
    cursor = conn.cursor()
    base_query = "SELECT * FROM preentrenos WHERE 1=1"
    params: list = []
    
    if min_price is not None:
        base_query += " AND price >= ?"
        params.append(min_price)
    
    if max_price is not None:
        base_query += " AND price <= ?"
        params.append(max_price)
    
    if category and category != "":
        base_query += " AND category LIKE ?"
        params.append(f"%{category}%")
    
    if search and search != "":
        base_query += " AND title LIKE ?"
        params.append(f"%{search}%")
    
    base_query += " ORDER BY title ASC"
    
    cursor.execute(base_query, params)
    preentrenos = cursor.fetchall()
    conn.close()
    
    preentrenos_formateados = []
    for preentreno in preentrenos:
        preentreno_dict = dict(preentreno)
        if "images" in preentreno_dict and preentreno_dict["images"]:
            preentreno_dict["images"] = preentreno_dict["images"].split(",")
        else:
            preentreno_dict["images"] = []
        preentrenos_formateados.append(preentreno_dict)
    
    return preentrenos_formateados

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

