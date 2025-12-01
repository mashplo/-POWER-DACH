from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
try:
    from pydantic import BaseModel, EmailStr
except ImportError:
    # Fallback si email-validator no está instalado todavía en el entorno
    from pydantic import BaseModel
    EmailStr = str  # type: ignore
from backend.database import get_db, inicializar_db, metadata, engine, usuarios, productos, creatinas, preentrenos, boletas, boleta_items
from sqlalchemy import text, select, and_
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import secrets
import os

app = FastAPI()

# IMPORTANTE: El middleware CORS debe agregarse ANTES de montar archivos estáticos
# Configurar CORS para que el frontend pueda acceder
# No se puede usar allow_origins=["*"] con allow_credentials=True
# Especificamos los orígenes permitidos explícitamente
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend en desarrollo
        "http://127.0.0.1:5173",  # Alternativa localhost
        "http://localhost:3000",  # Por si usas otro puerto
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos (imágenes) - DESPUÉS del middleware CORS
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
    role: str = "user"

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class BoletaItemIn(BaseModel):
    product_id: int
    product_type: str
    quantity: int
    price: float
    title: str

class BoletaIn(BaseModel):
    items: list[BoletaItemIn]
    total: float
    user_id: int

class ProductIn(BaseModel):
    title: str
    description: str
    price: float
    images: str
    category: str

class UserUpdate(BaseModel):
    nombre: str
    email: EmailStr
    role: str


# Seguridad básica
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # REMOVED due to incompatibility
import bcrypt

SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

def hash_password(password: str) -> str:
    try:
        # Bcrypt tiene un límite de 72 bytes - truncar si es necesario
        encoded = password.encode('utf-8')
        if len(encoded) > 72:
            password = encoded[:72].decode('utf-8', errors='ignore')
            encoded = password.encode('utf-8')
            
        # Generar salt y hashear
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(encoded, salt)
        return hashed.decode('utf-8')
    except Exception as e:
        print(f"ERROR in hash_password: {e}")
        raise e

def verify_password(plain: str, hashed: str) -> bool:
    try:
        # Bcrypt tiene un límite de 72 bytes - truncar si es necesario
        encoded = plain.encode('utf-8')
        if len(encoded) > 72:
            plain = encoded[:72].decode('utf-8', errors='ignore')
            encoded = plain.encode('utf-8')
            
        # Verificar
        # hashed debe ser bytes
        if isinstance(hashed, str):
            hashed_bytes = hashed.encode('utf-8')
        else:
            hashed_bytes = hashed
            
        return bcrypt.checkpw(encoded, hashed_bytes)
    except Exception as e:
        # Si hay cualquier error en la verificación, retornar False
        print(f"Error verificando password: {e}")
        return False

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
        row = conn.execute(text("SELECT id, nombre, email, role FROM usuarios WHERE id = :id"), {"id": user_id}).first()
        if not row:
            raise HTTPException(status_code=404, detail="Usuario no existe")
        return {"id": row.id, "nombre": row.nombre, "email": row.email, "role": row.role}

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
    # Validar longitud del password para bcrypt (72 bytes max)
    if len(usuario.password.encode('utf-8')) > 72:
        raise HTTPException(status_code=400, detail="Password demasiado largo (máximo 72 caracteres)")
    
    # Usar transacción explícita para asegurar persistencia (commit) en cualquier motor
    # engine.begin() hace commit automático al salir si no hay excepciones
    with engine.begin() as conn:
        result = conn.execute(text("SELECT id FROM usuarios WHERE email = :email"), {"email": usuario.email}).first()
        if result:
            raise HTTPException(status_code=400, detail="Email ya registrado")
        
        hashed = hash_password(usuario.password)
        try:
            conn.execute(
                text("INSERT INTO usuarios (nombre, email, password, role) VALUES (:nombre, :email, :password, :role)"),
                {"nombre": usuario.nombre, "email": usuario.email, "password": hashed, "role": "user"}
            )
        except Exception as e:
            print(f"Error inserting user: {e}")
            raise HTTPException(status_code=500, detail=f"Error interno al registrar: {str(e)}")
            
        new_row = conn.execute(text("SELECT id, nombre, email, role FROM usuarios WHERE email = :email"), {"email": usuario.email}).first()
        if not new_row:
            raise HTTPException(status_code=500, detail="Error creando usuario")
        return UserOut(id=new_row.id, nombre=new_row.nombre, email=new_row.email, role=new_row.role)

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



# ===== CRUD USUARIOS =====

@app.get("/api/v1/users")
def get_all_users():
    with get_db() as conn:
        rows = conn.execute(select(usuarios)).all()
        return [dict(row._mapping) for row in rows]

@app.put("/api/v1/users/{user_id}")
def update_user(user_id: int, user: UserUpdate):
    with get_db() as conn:
        conn.execute(
            usuarios.update().where(usuarios.c.id == user_id).values(
                nombre=user.nombre,
                email=user.email,
                role=user.role
            )
        )
        conn.commit()
        return {"status": "success"}

@app.delete("/api/v1/users/{user_id}")
def delete_user(user_id: int):
    with get_db() as conn:
        conn.execute(usuarios.delete().where(usuarios.c.id == user_id))
        conn.commit()
        return {"status": "success"}

# ===== BOLETAS =====

@app.post("/api/v1/boletas")
def create_boleta(boleta: BoletaIn):
    with get_db() as conn:
        # Crear boleta
        result = conn.execute(boletas.insert().values(
            user_id=boleta.user_id,
            total=boleta.total,
            fecha=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
        boleta_id = result.lastrowid
        
        # Crear items
        for item in boleta.items:
            conn.execute(boleta_items.insert().values(
                boleta_id=boleta_id,
                product_id=item.product_id,
                product_type=item.product_type,
                product_title=item.title,
                quantity=item.quantity,
                price=item.price
            ))
        conn.commit()
    return {"status": "success", "boleta_id": boleta_id}

@app.get("/api/v1/boletas")
def get_boletas():
    with get_db() as conn:
        # Join con usuarios para obtener nombre
        stmt = select(boletas, usuarios.c.nombre.label("user_name")).join(usuarios, boletas.c.user_id == usuarios.c.id)
        rows = conn.execute(stmt).all()
        return [dict(row._mapping) for row in rows]

@app.get("/api/v1/boletas/{id}")
def get_boleta_detail(id: int):
    with get_db() as conn:
        # Join para obtener datos del usuario
        stmt = select(boletas, usuarios.c.nombre, usuarios.c.email).join(usuarios, boletas.c.user_id == usuarios.c.id).where(boletas.c.id == id)
        boleta = conn.execute(stmt).first()
        
        if not boleta:
            raise HTTPException(status_code=404, detail="Boleta no encontrada")
        
        items = conn.execute(select(boleta_items).where(boleta_items.c.boleta_id == id)).all()
        
        return {
            "boleta": dict(boleta._mapping),
            "items": [dict(item._mapping) for item in items]
        }

# ===== CRUD PRODUCTOS (GENÉRICO) =====

def get_table_by_type(type: str):
    if type == "productos": return productos
    if type == "creatinas": return creatinas
    if type == "preentrenos": return preentrenos
    raise HTTPException(status_code=400, detail="Tipo de producto inválido")

@app.post("/api/v1/{type}")
def create_product(type: str, product: ProductIn):
    table = get_table_by_type(type)
    with get_db() as conn:
        conn.execute(table.insert().values(
            title=product.title,
            description=product.description,
            price=product.price,
            images=product.images,
            category=product.category
        ))
        conn.commit()
    return {"status": "success"}

@app.put("/api/v1/{type}/{id}")
def update_product(type: str, id: int, product: ProductIn):
    table = get_table_by_type(type)
    with get_db() as conn:
        conn.execute(table.update().where(table.c.id == id).values(
            title=product.title,
            description=product.description,
            price=product.price,
            images=product.images,
            category=product.category
        ))
        conn.commit()
    return {"status": "success"}

@app.delete("/api/v1/{type}/{id}")
def delete_product(type: str, id: int):
    table = get_table_by_type(type)
    with get_db() as conn:
        conn.execute(table.delete().where(table.c.id == id))
        conn.commit()
    return {"status": "success"}


if __name__ == "__main__":
    import uvicorn
    print("DEBUG: RUNNING APP.PY DIRECTLY")
    uvicorn.run(app, host="0.0.0.0", port=8000)
