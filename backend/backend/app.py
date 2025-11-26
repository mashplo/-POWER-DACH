from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from backend.database import get_db, inicializar_db, metadata, engine, usuarios
from sqlalchemy import text, select
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import secrets
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
class RegisterIn(BaseModel):
    nombre: str
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    nombre: str
    email: EmailStr

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Seguridad básica
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(lambda authorization: authorization)):
    """Extrae el usuario desde Authorization header (Bearer token)."""
    # FastAPI simplificado: buscar header manualmente
    from fastapi import Request
    request: Request = request  # type: ignore  # placeholder para linter
    # Este método será reemplazado si se extiende autenticación (por simplicidad no completo aquí).
    return None

@app.get("/")
def read_root():
    return {"mensaje": "API de Proteinas - Proyecto Universitario"}

@app.get("/api/v1/init-db")
def inicializar_tablas():
    """
    Endpoint para inicializar las tablas en Railway MySQL.
    Solo ejecutar una vez al desplegar.
    """
    try:
        metadata.create_all(engine)
        
        # Verificar tablas creadas
        with engine.connect() as conn:
            from sqlalchemy import text
            result = conn.execute(
                text("SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()")
            )
            tables = [row[0] for row in result]
        
        return {
            "status": "success",
            "mensaje": "Tablas creadas exitosamente",
            "tablas": tables
        }
    except Exception as e:
        return {
            "status": "error",
            "mensaje": str(e)
        }

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

@app.post("/api/v1/auth/register", response_model=UserOut)
def register(usuario: RegisterIn):
    """Registrar usuario con password hasheado."""
    with get_db() as conn:
        # Verificar email existente
        result = conn.execute(text("SELECT id FROM usuarios WHERE email = :email"), {"email": usuario.email}).first()
        if result:
            raise HTTPException(status_code=400, detail="Email ya registrado")
        hashed = hash_password(usuario.password)
        conn.execute(
            text("INSERT INTO usuarios (nombre, email, password) VALUES (:nombre, :email, :password)"),
            {"nombre": usuario.nombre, "email": usuario.email, "password": hashed}
        )
        # Recuperar ID
        new_row = conn.execute(text("SELECT id, nombre, email FROM usuarios WHERE email = :email"), {"email": usuario.email}).first()
        return UserOut(id=new_row.id, nombre=new_row.nombre, email=new_row.email)

@app.post("/api/register", response_model=UserOut)
def register_legacy(usuario: RegisterIn):
    """Alias legacy sin versión."""
    return register(usuario)

@app.post("/api/v1/auth/login", response_model=TokenOut)
def login(datos: LoginIn):
    with get_db() as conn:
        row = conn.execute(text("SELECT id, nombre, email, password FROM usuarios WHERE email = :email"), {"email": datos.email}).first()
        if not row or not verify_password(datos.password, row.password):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        token = create_access_token({"sub": str(row.id), "email": row.email})
        return TokenOut(access_token=token)

@app.post("/api/login", response_model=TokenOut)
def login_legacy(datos: LoginIn):
    """Alias legacy sin versión."""
    return login(datos)

@app.get("/api/v1/auth/users/{usuario_id}", response_model=UserOut)
def obtener_usuario(usuario_id: int):
    with get_db() as conn:
        row = conn.execute(text("SELECT id, nombre, email FROM usuarios WHERE id = :id"), {"id": usuario_id}).first()
        if not row:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return UserOut(id=row.id, nombre=row.nombre, email=row.email)


