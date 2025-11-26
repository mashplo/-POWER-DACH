from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from backend.database import get_db, inicializar_db, metadata, engine, usuarios, productos, creatinas, preentrenos
from sqlalchemy import text, select, and_
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

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no provisto")
    token = auth_header.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Token inválido")
    with get_db() as conn:
        row = conn.execute(text("SELECT id, nombre, email FROM usuarios WHERE id = :id"), {"id": user_id}).first()
        if not row:
            raise HTTPException(status_code=404, detail="Usuario no existe")
        return {"id": row.id, "nombre": row.nombre, "email": row.email}

@app.get("/")
def read_root():
    return {"mensaje": "API de Proteinas - Proyecto Universitario"}

@app.get("/api/v1/auth/me", response_model=UserOut)
def auth_me(current = Depends(get_current_user)):
    return UserOut(**current)

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

def _formatear(rows):
    resultado = []
    for r in rows:
        d = dict(r._mapping)
        d["images"] = d.get("images", "")
        d["images"] = d["images"].split(",") if d["images"] else []
        resultado.append(d)
    return resultado

@app.get("/api/v1/products")
def obtener_proteinas(
    min_price: float | None = None,
    max_price: float | None = None,
    category: str | None = None,
    search: str | None = None
):
    stmt = select(productos)
    condiciones = []
    params = {}
    if min_price is not None:
        condiciones.append(productos.c.price >= min_price)
    if max_price is not None:
        condiciones.append(productos.c.price <= max_price)
    if category:
        condiciones.append(productos.c.category.like(f"%{category}%"))
    if search:
        condiciones.append(productos.c.title.like(f"%{search}%"))
    if condiciones:
        stmt = stmt.where(and_(*condiciones))
    stmt = stmt.order_by(productos.c.title.asc())
    with get_db() as conn:
        rows = conn.execute(stmt).all()
    return _formatear(rows)

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
    stmt = select(creatinas)
    condiciones = []
    if min_price is not None:
        condiciones.append(creatinas.c.price >= min_price)
    if max_price is not None:
        condiciones.append(creatinas.c.price <= max_price)
    if category:
        condiciones.append(creatinas.c.category.like(f"%{category}%"))
    if search:
        condiciones.append(creatinas.c.title.like(f"%{search}%"))
    if condiciones:
        stmt = stmt.where(and_(*condiciones))
    stmt = stmt.order_by(creatinas.c.title.asc())
    with get_db() as conn:
        rows = conn.execute(stmt).all()
    return _formatear(rows)

# ===== ENDPOINTS DE PRE-ENTRENOS =====

@app.get("/api/v1/preentrenos")
def obtener_preentrenos(
    min_price: float | None = None,
    max_price: float | None = None,
    category: str | None = None,
    search: str | None = None
):
    stmt = select(preentrenos)
    condiciones = []
    if min_price is not None:
        condiciones.append(preentrenos.c.price >= min_price)
    if max_price is not None:
        condiciones.append(preentrenos.c.price <= max_price)
    if category:
        condiciones.append(preentrenos.c.category.like(f"%{category}%"))
    if search:
        condiciones.append(preentrenos.c.title.like(f"%{search}%"))
    if condiciones:
        stmt = stmt.where(and_(*condiciones))
    stmt = stmt.order_by(preentrenos.c.title.asc())
    with get_db() as conn:
        rows = conn.execute(stmt).all()
    return _formatear(rows)

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


