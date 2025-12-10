"""
POWER-DACH API - FastAPI con SQL Puro (sin ORM)
Todas las consultas son SQL directo usando sqlite3
"""
import os
import io
import hashlib
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr, Field
from jose import JWTError, jwt

# Importar módulo de base de datos SQL puro
from . import database as db

# ============================================================================
# CONFIGURACIÓN
# ============================================================================
SECRET_KEY = os.getenv("SECRET_KEY", "power-dach-secret-key-2024-super-segura")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

security = HTTPBearer(auto_error=False)

app = FastAPI(
    title="POWER-DACH API",
    description="API para tienda de suplementos deportivos - SQL Puro",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Archivos estáticos
ASSETS_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
if os.path.exists(ASSETS_PATH):
    app.mount("/assets", StaticFiles(directory=ASSETS_PATH), name="assets")


# ============================================================================
# SCHEMAS (Pydantic)
# ============================================================================
# --- Auth ---
class UsuarioCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    rol: Optional[str] = None
    activo: Optional[bool] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# --- Productos ---
class ProductoCreate(BaseModel):
    nombre: str
    descripcion: str
    precio: float = Field(..., gt=0)
    categoria_id: int
    marca_id: Optional[int] = None
    imagen_url: Optional[str] = None
    stock: int = Field(default=0, ge=0)
    sabor: Optional[str] = None
    tamano: Optional[str] = None

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    categoria_id: Optional[int] = None
    marca_id: Optional[int] = None
    imagen_url: Optional[str] = None
    stock: Optional[int] = None
    sabor: Optional[str] = None
    tamano: Optional[str] = None
    activo: Optional[bool] = None

# --- Categorías ---
class CategoriaCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None

class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None

# --- Marcas ---
class MarcaCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    logo_url: Optional[str] = None
    pais_origen: Optional[str] = None

class MarcaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    logo_url: Optional[str] = None
    pais_origen: Optional[str] = None

# --- Proveedores ---
class ProveedorCreate(BaseModel):
    nombre: str
    contacto: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    direccion: Optional[str] = None

class ProveedorUpdate(BaseModel):
    nombre: Optional[str] = None
    contacto: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    direccion: Optional[str] = None

# --- Creatinas ---
class CreatinaCreate(BaseModel):
    producto_id: int
    tipo_creatina: str
    gramos_por_porcion: Optional[float] = None
    porciones: Optional[int] = None
    certificaciones: Optional[str] = None

class CreatinaUpdate(BaseModel):
    tipo_creatina: Optional[str] = None
    gramos_por_porcion: Optional[float] = None
    porciones: Optional[int] = None
    certificaciones: Optional[str] = None

# --- Proteinas (con info nutricional) ---
class ProteinaCreate(BaseModel):
    producto_id: int
    tipo_proteina: str = 'Whey'
    proteina_por_porcion: Optional[float] = None
    calorias_por_porcion: Optional[int] = None
    carbohidratos: Optional[float] = None
    grasas: Optional[float] = None
    azucares: Optional[float] = None
    sodio_mg: Optional[int] = None
    porciones: Optional[int] = None
    aminoacidos_bcaa: Optional[float] = None
    glutamina: Optional[float] = None
    certificaciones: Optional[str] = None

class ProteinaUpdate(BaseModel):
    tipo_proteina: Optional[str] = None
    proteina_por_porcion: Optional[float] = None
    calorias_por_porcion: Optional[int] = None
    carbohidratos: Optional[float] = None
    grasas: Optional[float] = None
    azucares: Optional[float] = None
    sodio_mg: Optional[int] = None
    porciones: Optional[int] = None
    aminoacidos_bcaa: Optional[float] = None
    glutamina: Optional[float] = None
    certificaciones: Optional[str] = None

# --- Preentrenos ---
class PreentrenoCreate(BaseModel):
    producto_id: int
    cafeina_mg: Optional[int] = None
    beta_alanina: bool = False
    citrulina: bool = False
    nivel_estimulante: Optional[str] = None

class PreentrenoUpdate(BaseModel):
    cafeina_mg: Optional[int] = None
    beta_alanina: Optional[bool] = None
    citrulina: Optional[bool] = None
    nivel_estimulante: Optional[str] = None

# --- Direcciones ---
class DireccionCreate(BaseModel):
    direccion: str
    ciudad: str
    codigo_postal: Optional[str] = None
    pais: str = "Perú"
    es_principal: bool = False

class DireccionUpdate(BaseModel):
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    codigo_postal: Optional[str] = None
    pais: Optional[str] = None
    es_principal: Optional[bool] = None

# --- Cupones ---
class CuponCreate(BaseModel):
    codigo: str
    tipo_descuento: str  # 'porcentaje' o 'fijo'
    valor_descuento: float
    fecha_inicio: str
    fecha_fin: str
    usos_maximos: Optional[int] = None

# --- Inventario ---
class MovimientoInventarioCreate(BaseModel):
    producto_id: int
    tipo_movimiento: str  # 'entrada' o 'salida'
    cantidad: int = Field(..., gt=0)
    proveedor_id: Optional[int] = None
    notas: Optional[str] = None

# --- Boletas ---
class BoletaItemCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(..., gt=0)

class BoletaCreate(BaseModel):
    items: List[BoletaItemCreate]
    metodo_pago_id: Optional[int] = None
    direccion_envio: Optional[str] = None
    cupon_codigo: Optional[str] = None

class BoletaEstadoUpdate(BaseModel):
    estado: str

# --- Reseñas ---
class ResenaCreate(BaseModel):
    producto_id: int
    calificacion: int = Field(..., ge=1, le=5)
    comentario: Optional[str] = None

class ResenaUpdate(BaseModel):
    calificacion: Optional[int] = Field(None, ge=1, le=5)
    comentario: Optional[str] = None


# ============================================================================
# UTILIDADES DE AUTENTICACIÓN
# ============================================================================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica contraseña usando SHA256"""
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password: str) -> str:
    """Hash de contraseña usando SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido")
        
        user = db.get_usuario_by_id(int(user_id))
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    if not credentials:
        return None
    try:
        return get_current_user(credentials)
    except:
        return None

def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("rol") != "admin":
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere rol de administrador")
    return user

def _formatear_imagen(data: dict) -> dict:
    """Formatea URLs de imagen para que sean relativas"""
    if data and 'imagen_url' in data:
        img = data['imagen_url']
        if img:
            # Convertir a ruta relativa
            if img.startswith(('http://', 'https://')):
                if '/assets/' in img:
                    data['imagen_url'] = '/assets' + img.split('/assets')[-1]
            elif not img.startswith('/assets'):
                if not img.startswith('/'):
                    data['imagen_url'] = f'/assets/productos/{img}'
    return data

def _formatear_lista(items: list) -> list:
    """Formatea lista de items con imágenes"""
    return [_formatear_imagen(item) for item in items]


# ============================================================================
# ENDPOINTS DE AUTENTICACIÓN
# ============================================================================
@app.post("/api/auth/register", response_model=Token, tags=["Auth"])
async def register(user_data: UsuarioCreate):
    """Registrar nuevo usuario"""
    existing = db.get_usuario_by_email(user_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    hashed = get_password_hash(user_data.password)
    user_id = db.create_usuario(user_data.nombre, user_data.email, hashed)
    
    user = db.get_usuario_by_id(user_id)
    token = create_access_token({"sub": str(user_id)})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "nombre": user["nombre"],
            "email": user["email"],
            "rol": user["rol"]
        }
    }

@app.post("/api/auth/login", response_model=Token, tags=["Auth"])
async def login(credentials: UsuarioLogin):
    """Iniciar sesión"""
    user = db.get_usuario_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    if not user.get("activo", True):
        raise HTTPException(status_code=403, detail="Usuario desactivado")
    
    token = create_access_token({"sub": str(user["id"])})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "nombre": user["nombre"],
            "email": user["email"],
            "rol": user["rol"]
        }
    }

@app.get("/api/auth/me", tags=["Auth"])
async def get_me(user: dict = Depends(get_current_user)):
    """Obtener usuario actual"""
    return user


# ============================================================================
# CRUD CATEGORÍAS (1 entidad)
# ============================================================================
@app.get("/api/categorias", tags=["Categorías"])
async def listar_categorias():
    """Listar todas las categorías"""
    return db.get_all_categorias()

@app.get("/api/categorias/{id}", tags=["Categorías"])
async def obtener_categoria(id: int):
    """Obtener categoría por ID"""
    cat = db.get_categoria_by_id(id)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return cat

@app.post("/api/categorias", tags=["Categorías"])
async def crear_categoria(data: CategoriaCreate, admin: dict = Depends(require_admin)):
    """Crear nueva categoría (Admin)"""
    cat_id = db.create_categoria(data.nombre, data.descripcion, data.imagen_url)
    return db.get_categoria_by_id(cat_id)

@app.put("/api/categorias/{id}", tags=["Categorías"])
async def actualizar_categoria(id: int, data: CategoriaUpdate, admin: dict = Depends(require_admin)):
    """Actualizar categoría (Admin)"""
    if not db.get_categoria_by_id(id):
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.update_categoria(id, data.nombre, data.descripcion, data.imagen_url)
    return db.get_categoria_by_id(id)

@app.delete("/api/categorias/{id}", tags=["Categorías"])
async def eliminar_categoria(id: int, admin: dict = Depends(require_admin)):
    """Eliminar categoría (Admin)"""
    if not db.get_categoria_by_id(id):
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete_categoria(id)
    return {"message": "Categoría eliminada"}


# ============================================================================
# CRUD MARCAS (1 entidad)
# ============================================================================
@app.get("/api/marcas", tags=["Marcas"])
async def listar_marcas():
    """Listar todas las marcas"""
    return db.get_all_marcas()

@app.get("/api/marcas/{id}", tags=["Marcas"])
async def obtener_marca(id: int):
    """Obtener marca por ID"""
    marca = db.get_marca_by_id(id)
    if not marca:
        raise HTTPException(status_code=404, detail="Marca no encontrada")
    return marca

@app.post("/api/marcas", tags=["Marcas"])
async def crear_marca(data: MarcaCreate, admin: dict = Depends(require_admin)):
    """Crear nueva marca (Admin)"""
    marca_id = db.create_marca(data.nombre, data.descripcion, data.logo_url, data.pais_origen)
    return db.get_marca_by_id(marca_id)

@app.put("/api/marcas/{id}", tags=["Marcas"])
async def actualizar_marca(id: int, data: MarcaUpdate, admin: dict = Depends(require_admin)):
    """Actualizar marca (Admin)"""
    if not db.get_marca_by_id(id):
        raise HTTPException(status_code=404, detail="Marca no encontrada")
    db.update_marca(id, data.nombre, data.descripcion, data.logo_url, data.pais_origen)
    return db.get_marca_by_id(id)

@app.delete("/api/marcas/{id}", tags=["Marcas"])
async def eliminar_marca(id: int, admin: dict = Depends(require_admin)):
    """Eliminar marca (Admin)"""
    if not db.get_marca_by_id(id):
        raise HTTPException(status_code=404, detail="Marca no encontrada")
    db.delete_marca(id)
    return {"message": "Marca eliminada"}


# ============================================================================
# CRUD PROVEEDORES (1 entidad)
# ============================================================================
@app.get("/api/proveedores", tags=["Proveedores"])
async def listar_proveedores(admin: dict = Depends(require_admin)):
    """Listar todos los proveedores (Admin)"""
    return db.get_all_proveedores()

@app.get("/api/proveedores/{id}", tags=["Proveedores"])
async def obtener_proveedor(id: int, admin: dict = Depends(require_admin)):
    """Obtener proveedor por ID (Admin)"""
    prov = db.get_proveedor_by_id(id)
    if not prov:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return prov

@app.post("/api/proveedores", tags=["Proveedores"])
async def crear_proveedor(data: ProveedorCreate, admin: dict = Depends(require_admin)):
    """Crear nuevo proveedor (Admin)"""
    prov_id = db.create_proveedor(data.nombre, data.contacto, data.telefono, data.email, data.direccion)
    return db.get_proveedor_by_id(prov_id)

@app.put("/api/proveedores/{id}", tags=["Proveedores"])
async def actualizar_proveedor(id: int, data: ProveedorUpdate, admin: dict = Depends(require_admin)):
    """Actualizar proveedor (Admin)"""
    if not db.get_proveedor_by_id(id):
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.update_proveedor(id, data.nombre, data.contacto, data.telefono, data.email, data.direccion)
    return db.get_proveedor_by_id(id)

@app.delete("/api/proveedores/{id}", tags=["Proveedores"])
async def eliminar_proveedor(id: int, admin: dict = Depends(require_admin)):
    """Eliminar proveedor (Admin)"""
    if not db.get_proveedor_by_id(id):
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete_proveedor(id)
    return {"message": "Proveedor eliminado"}


# ============================================================================
# CRUD PRODUCTOS (2 entidades: productos + categorías/marcas)
# ============================================================================
@app.get("/api/productos", tags=["Productos"])
async def listar_productos(
    categoria_id: Optional[int] = None,
    marca_id: Optional[int] = None,
    activo: Optional[bool] = True,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = Query(100, le=500),
    offset: int = 0
):
    """Listar productos con filtros"""
    productos = db.get_all_productos(categoria_id, marca_id, activo, limit, offset)
    # Filtrar por precio en memoria
    if min_price is not None:
        productos = [p for p in productos if p['precio'] >= min_price]
    if max_price is not None:
        productos = [p for p in productos if p['precio'] <= max_price]
    return _formatear_lista(productos)

@app.get("/api/productos/buscar", tags=["Productos"])
async def buscar_productos(q: str = Query(..., min_length=2)):
    """Buscar productos por nombre, descripción, categoría o marca"""
    productos = db.search_productos(q)
    return _formatear_lista(productos)

@app.get("/api/productos/{id}", tags=["Productos"])
async def obtener_producto(id: int):
    """Obtener producto por ID"""
    producto = db.get_producto_by_id(id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return _formatear_imagen(producto)

@app.post("/api/productos", tags=["Productos"])
async def crear_producto(data: ProductoCreate, admin: dict = Depends(require_admin)):
    """Crear nuevo producto (Admin)"""
    producto_id = db.create_producto(
        data.nombre, data.descripcion, data.precio, data.categoria_id,
        data.marca_id, data.imagen_url, data.stock, data.sabor, data.tamano
    )
    return _formatear_imagen(db.get_producto_by_id(producto_id))

@app.put("/api/productos/{id}", tags=["Productos"])
async def actualizar_producto(id: int, data: ProductoUpdate, admin: dict = Depends(require_admin)):
    """Actualizar producto (Admin)"""
    if not db.get_producto_by_id(id):
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.update_producto(
        id, data.nombre, data.descripcion, data.precio, data.categoria_id,
        data.marca_id, data.imagen_url, data.stock, data.sabor, data.tamano, data.activo
    )
    return _formatear_imagen(db.get_producto_by_id(id))

@app.delete("/api/productos/{id}", tags=["Productos"])
async def eliminar_producto(id: int, admin: dict = Depends(require_admin)):
    """Eliminar producto (Admin)"""
    if not db.get_producto_by_id(id):
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete_producto(id)
    return {"message": "Producto eliminado"}


# ============================================================================
# CRUD CREATINAS (2 entidades: creatinas + productos)
# ============================================================================
@app.get("/api/creatinas", tags=["Creatinas"])
async def listar_creatinas(
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    """Listar todas las creatinas con filtros de precio"""
    creatinas = db.get_all_creatinas()
    # Filtrar por precio
    if min_price is not None:
        creatinas = [c for c in creatinas if c['precio'] >= min_price]
    if max_price is not None:
        creatinas = [c for c in creatinas if c['precio'] <= max_price]
    return _formatear_lista(creatinas)

@app.get("/api/creatinas/{id}", tags=["Creatinas"])
async def obtener_creatina(id: int):
    """Obtener creatina por ID"""
    creatina = db.get_creatina_by_id(id)
    if not creatina:
        raise HTTPException(status_code=404, detail="Creatina no encontrada")
    return _formatear_imagen(creatina)

@app.post("/api/creatinas", tags=["Creatinas"])
async def crear_creatina(data: CreatinaCreate, admin: dict = Depends(require_admin)):
    """Crear nueva creatina (Admin)"""
    creatina_id = db.create_creatina(
        data.producto_id, data.tipo_creatina, data.gramos_por_porcion,
        data.porciones, data.certificaciones
    )
    return _formatear_imagen(db.get_creatina_by_id(creatina_id))

@app.put("/api/creatinas/{id}", tags=["Creatinas"])
async def actualizar_creatina(id: int, data: CreatinaUpdate, admin: dict = Depends(require_admin)):
    """Actualizar creatina (Admin)"""
    if not db.get_creatina_by_id(id):
        raise HTTPException(status_code=404, detail="Creatina no encontrada")
    db.update_creatina(id, data.tipo_creatina, data.gramos_por_porcion, data.porciones, data.certificaciones)
    return _formatear_imagen(db.get_creatina_by_id(id))

@app.delete("/api/creatinas/{id}", tags=["Creatinas"])
async def eliminar_creatina(id: int, admin: dict = Depends(require_admin)):
    """Eliminar creatina (Admin)"""
    if not db.get_creatina_by_id(id):
        raise HTTPException(status_code=404, detail="Creatina no encontrada")
    db.delete_creatina(id)
    return {"message": "Creatina eliminada"}


# ============================================================================
# CRUD PROTEINAS (con información nutricional)
# ============================================================================
@app.get("/api/proteinas", tags=["Proteinas"])
async def listar_proteinas(
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    """Listar todas las proteínas con información nutricional"""
    proteinas = db.get_all_proteinas()
    # Filtrar por precio
    if min_price is not None:
        proteinas = [p for p in proteinas if p['precio'] >= min_price]
    if max_price is not None:
        proteinas = [p for p in proteinas if p['precio'] <= max_price]
    return _formatear_lista(proteinas)

@app.get("/api/proteinas/{id}", tags=["Proteinas"])
async def obtener_proteina(id: int):
    """Obtener proteína por ID con información nutricional"""
    proteina = db.get_proteina_by_id(id)
    if not proteina:
        raise HTTPException(status_code=404, detail="Proteína no encontrada")
    return _formatear_imagen(proteina)

@app.get("/api/proteinas/producto/{producto_id}", tags=["Proteinas"])
async def obtener_proteina_por_producto(producto_id: int):
    """Obtener información nutricional de un producto de proteína"""
    proteina = db.get_proteina_by_producto_id(producto_id)
    if not proteina:
        raise HTTPException(status_code=404, detail="Información nutricional no encontrada")
    return _formatear_imagen(proteina)

@app.post("/api/proteinas", tags=["Proteinas"])
async def crear_proteina(data: ProteinaCreate, admin: dict = Depends(require_admin)):
    """Crear nueva proteína con info nutricional (Admin)"""
    proteina_id = db.create_proteina(
        data.producto_id, data.tipo_proteina, data.proteina_por_porcion,
        data.calorias_por_porcion, data.carbohidratos, data.grasas,
        data.azucares, data.sodio_mg, data.porciones, data.aminoacidos_bcaa,
        data.glutamina, data.certificaciones
    )
    return _formatear_imagen(db.get_proteina_by_id(proteina_id))

@app.put("/api/proteinas/{id}", tags=["Proteinas"])
async def actualizar_proteina(id: int, data: ProteinaUpdate, admin: dict = Depends(require_admin)):
    """Actualizar proteína (Admin)"""
    if not db.get_proteina_by_id(id):
        raise HTTPException(status_code=404, detail="Proteína no encontrada")
    db.update_proteina(
        id, data.tipo_proteina, data.proteina_por_porcion, data.calorias_por_porcion,
        data.carbohidratos, data.grasas, data.azucares, data.sodio_mg,
        data.porciones, data.aminoacidos_bcaa, data.glutamina, data.certificaciones
    )
    return _formatear_imagen(db.get_proteina_by_id(id))

@app.delete("/api/proteinas/{id}", tags=["Proteinas"])
async def eliminar_proteina(id: int, admin: dict = Depends(require_admin)):
    """Eliminar proteína (Admin)"""
    if not db.get_proteina_by_id(id):
        raise HTTPException(status_code=404, detail="Proteína no encontrada")
    db.delete_proteina(id)
    return {"message": "Proteína eliminada"}


# ============================================================================
# CRUD PREENTRENOS (2 entidades: preentrenos + productos)
# ============================================================================
@app.get("/api/preentrenos", tags=["Preentrenos"])
async def listar_preentrenos(
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    """Listar todos los preentrenos con filtros de precio"""
    preentrenos = db.get_all_preentrenos()
    # Filtrar por precio
    if min_price is not None:
        preentrenos = [p for p in preentrenos if p['precio'] >= min_price]
    if max_price is not None:
        preentrenos = [p for p in preentrenos if p['precio'] <= max_price]
    return _formatear_lista(preentrenos)

@app.get("/api/preentrenos/{id}", tags=["Preentrenos"])
async def obtener_preentreno(id: int):
    """Obtener preentreno por ID"""
    preentreno = db.get_preentreno_by_id(id)
    if not preentreno:
        raise HTTPException(status_code=404, detail="Preentreno no encontrado")
    return _formatear_imagen(preentreno)

@app.post("/api/preentrenos", tags=["Preentrenos"])
async def crear_preentreno(data: PreentrenoCreate, admin: dict = Depends(require_admin)):
    """Crear nuevo preentreno (Admin)"""
    preentreno_id = db.create_preentreno(
        data.producto_id, data.cafeina_mg, data.beta_alanina,
        data.citrulina, data.nivel_estimulante
    )
    return _formatear_imagen(db.get_preentreno_by_id(preentreno_id))

@app.put("/api/preentrenos/{id}", tags=["Preentrenos"])
async def actualizar_preentreno(id: int, data: PreentrenoUpdate, admin: dict = Depends(require_admin)):
    """Actualizar preentreno (Admin)"""
    if not db.get_preentreno_by_id(id):
        raise HTTPException(status_code=404, detail="Preentreno no encontrado")
    db.update_preentreno(id, data.cafeina_mg, data.beta_alanina, data.citrulina, data.nivel_estimulante)
    return _formatear_imagen(db.get_preentreno_by_id(id))

@app.delete("/api/preentrenos/{id}", tags=["Preentrenos"])
async def eliminar_preentreno(id: int, admin: dict = Depends(require_admin)):
    """Eliminar preentreno (Admin)"""
    if not db.get_preentreno_by_id(id):
        raise HTTPException(status_code=404, detail="Preentreno no encontrado")
    db.delete_preentreno(id)
    return {"message": "Preentreno eliminado"}


# ============================================================================
# CRUD USUARIOS (Admin)
# ============================================================================
@app.get("/api/usuarios", tags=["Usuarios"])
async def listar_usuarios(admin: dict = Depends(require_admin)):
    """Listar todos los usuarios (Admin)"""
    return db.get_all_usuarios()

@app.get("/api/usuarios/{id}", tags=["Usuarios"])
async def obtener_usuario(id: int, admin: dict = Depends(require_admin)):
    """Obtener usuario por ID (Admin)"""
    user = db.get_usuario_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@app.put("/api/usuarios/{id}", tags=["Usuarios"])
async def actualizar_usuario(id: int, data: UsuarioUpdate, admin: dict = Depends(require_admin)):
    """Actualizar usuario (Admin)"""
    if not db.get_usuario_by_id(id):
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    password_hash = None
    if data.password:
        password_hash = get_password_hash(data.password)
    
    db.update_usuario(id, data.nombre, data.email, password_hash, data.rol, data.activo)
    return db.get_usuario_by_id(id)

@app.get("/api/usuarios/{id}/boletas-count", tags=["Usuarios"])
async def contar_boletas_usuario(id: int, admin: dict = Depends(require_admin)):
    """Contar boletas de un usuario (Admin)"""
    boletas = db.execute_query("SELECT COUNT(*) as count FROM boletas WHERE usuario_id = ?", (id,))
    count = boletas[0].get('count', 0) if boletas else 0
    return {"count": count}

@app.delete("/api/usuarios/{id}", tags=["Usuarios"])
async def eliminar_usuario(id: int, delete_boletas: bool = Query(False), admin: dict = Depends(require_admin)):
    """Eliminar usuario (Admin) - Con opciones para boletas"""
    usuario = db.get_usuario_by_id(id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    try:
        if delete_boletas:
            # Eliminar boleta_items primero (por foreign key)
            db.execute_update("DELETE FROM boleta_items WHERE boleta_id IN (SELECT id FROM boletas WHERE usuario_id = ?)", (id,))
            # Eliminar boletas
            db.execute_update("DELETE FROM boletas WHERE usuario_id = ?", (id,))
        else:
            # Conservar boletas pero quitar la referencia al usuario (SET NULL)
            db.execute_update("UPDATE boletas SET usuario_id = NULL WHERE usuario_id = ?", (id,))
        
        # Eliminar direcciones del usuario
        db.execute_update("DELETE FROM direcciones WHERE usuario_id = ?", (id,))
        # Eliminar favoritos del usuario
        db.execute_update("DELETE FROM favoritos WHERE usuario_id = ?", (id,))
        # Eliminar reseñas del usuario
        db.execute_update("DELETE FROM resenas WHERE usuario_id = ?", (id,))
        
        # Finalmente eliminar el usuario
        db.delete_usuario(id)
        return {"message": "Usuario eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al eliminar: {str(e)}")


# ============================================================================
# CRUD DIRECCIONES (Usuario)
# ============================================================================
@app.get("/api/direcciones", tags=["Direcciones"])
async def listar_mis_direcciones(user: dict = Depends(get_current_user)):
    """Listar direcciones del usuario actual"""
    return db.get_direcciones_by_usuario(user["id"])

@app.post("/api/direcciones", tags=["Direcciones"])
async def crear_direccion(data: DireccionCreate, user: dict = Depends(get_current_user)):
    """Crear nueva dirección"""
    dir_id = db.create_direccion(
        user["id"], data.direccion, data.ciudad,
        data.codigo_postal, data.pais, data.es_principal
    )
    return db.get_direccion_by_id(dir_id)

@app.put("/api/direcciones/{id}", tags=["Direcciones"])
async def actualizar_direccion(id: int, data: DireccionUpdate, user: dict = Depends(get_current_user)):
    """Actualizar dirección"""
    dir_data = db.get_direccion_by_id(id)
    if not dir_data or dir_data["usuario_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    db.update_direccion(id, data.direccion, data.ciudad, data.codigo_postal, data.pais, data.es_principal)
    return db.get_direccion_by_id(id)

@app.delete("/api/direcciones/{id}", tags=["Direcciones"])
async def eliminar_direccion(id: int, user: dict = Depends(get_current_user)):
    """Eliminar dirección"""
    dir_data = db.get_direccion_by_id(id)
    if not dir_data or dir_data["usuario_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    db.delete_direccion(id)
    return {"message": "Dirección eliminada"}


# ============================================================================
# MÉTODOS DE PAGO
# ============================================================================
@app.get("/api/metodos-pago", tags=["Métodos de Pago"])
async def listar_metodos_pago():
    """Listar métodos de pago disponibles"""
    return db.get_all_metodos_pago()


# ============================================================================
# CUPONES
# ============================================================================
@app.get("/api/cupones", tags=["Cupones"])
async def listar_cupones(admin: dict = Depends(require_admin)):
    """Listar todos los cupones (Admin)"""
    return db.get_all_cupones()

@app.post("/api/cupones", tags=["Cupones"])
async def crear_cupon(data: CuponCreate, admin: dict = Depends(require_admin)):
    """Crear nuevo cupón (Admin)"""
    cupon_id = db.create_cupon(
        data.codigo, data.tipo_descuento, data.valor_descuento,
        data.fecha_inicio, data.fecha_fin, data.usos_maximos
    )
    return {"id": cupon_id, "message": "Cupón creado"}

@app.get("/api/cupones/validar/{codigo}", tags=["Cupones"])
async def validar_cupon(codigo: str):
    """Validar un código de cupón"""
    cupon = db.get_cupon_by_codigo(codigo)
    if not cupon:
        raise HTTPException(status_code=404, detail="Cupón no válido o expirado")
    return cupon


# ============================================================================
# INVENTARIO (3+ entidades: inventario + productos + proveedores)
# ============================================================================
@app.get("/api/inventario", tags=["Inventario"])
async def listar_inventario(admin: dict = Depends(require_admin)):
    """Listar movimientos de inventario (Admin)"""
    return db.get_all_inventario()

@app.get("/api/inventario/producto/{producto_id}", tags=["Inventario"])
async def obtener_inventario_producto(producto_id: int, admin: dict = Depends(require_admin)):
    """Obtener movimientos de inventario de un producto (Admin)"""
    return db.get_inventario_by_producto(producto_id)

@app.post("/api/inventario", tags=["Inventario"])
async def crear_movimiento_inventario(data: MovimientoInventarioCreate, admin: dict = Depends(require_admin)):
    """Crear movimiento de inventario (Admin)"""
    if not db.get_producto_by_id(data.producto_id):
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    if data.proveedor_id and not db.get_proveedor_by_id(data.proveedor_id):
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    
    mov_id = db.create_movimiento_inventario(
        data.producto_id, data.tipo_movimiento, data.cantidad,
        data.proveedor_id, data.notas
    )
    return {"id": mov_id, "message": "Movimiento registrado"}


# ============================================================================
# CRUD BOLETAS (3+ entidades: boletas + items + productos + usuarios + cupones)
# ============================================================================
@app.get("/api/boletas", tags=["Boletas"])
async def listar_boletas(
    user: dict = Depends(get_current_user),
    estado: Optional[str] = None,
    limit: int = Query(100, le=500),
    offset: int = 0
):
    """Listar boletas del usuario (o todas si es admin)"""
    if user.get("rol") == "admin":
        boletas = db.get_all_boletas(estado=estado, limit=limit, offset=offset)
    else:
        boletas = db.get_all_boletas(usuario_id=user["id"], estado=estado, limit=limit, offset=offset)
    return boletas

@app.get("/api/boletas/{id}", tags=["Boletas"])
async def obtener_boleta(id: int, user: dict = Depends(get_current_user)):
    """Obtener boleta con items"""
    boleta = db.get_boleta_with_items(id)
    if not boleta:
        raise HTTPException(status_code=404, detail="Boleta no encontrada")
    
    # Solo admin o propietario pueden ver
    if user.get("rol") != "admin" and boleta["usuario_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    # Formatear imágenes de items
    if boleta.get("items"):
        boleta["items"] = _formatear_lista(boleta["items"])
    
    return boleta

@app.post("/api/boletas", tags=["Boletas"])
async def crear_boleta(data: BoletaCreate, user: dict = Depends(get_current_user)):
    """Crear nueva boleta/pedido"""
    if not data.items:
        raise HTTPException(status_code=400, detail="Debe incluir al menos un producto")
    
    # Combinar items con el mismo producto_id
    items_combinados = {}
    for item in data.items:
        if item.producto_id in items_combinados:
            items_combinados[item.producto_id] += item.cantidad
        else:
            items_combinados[item.producto_id] = item.cantidad
    
    # Calcular totales
    subtotal = 0
    items_procesados = []
    
    for producto_id, cantidad in items_combinados.items():
        producto = db.get_producto_by_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail=f"Producto {producto_id} no encontrado")
        if producto["stock"] < cantidad:
            raise HTTPException(status_code=400, detail=f"Stock insuficiente para {producto['nombre']}")
        
        item_subtotal = producto["precio"] * cantidad
        subtotal += item_subtotal
        items_procesados.append({
            "producto_id": producto_id,
            "cantidad": cantidad,
            "precio_unitario": producto["precio"],
            "subtotal": item_subtotal
        })
    
    # Procesar cupón si existe
    descuento = 0
    cupon_id = None
    if data.cupon_codigo:
        cupon = db.get_cupon_by_codigo(data.cupon_codigo)
        if cupon:
            cupon_id = cupon["id"]
            if cupon["tipo_descuento"] == "porcentaje":
                descuento = subtotal * (cupon["valor_descuento"] / 100)
            else:
                descuento = cupon["valor_descuento"]
            db.incrementar_uso_cupon(data.cupon_codigo)
    
    # Calcular impuestos y total
    impuestos = (subtotal - descuento) * 0.18  # 18% IGV
    total = subtotal - descuento + impuestos
    
    # Crear boleta
    boleta_id = db.create_boleta(
        user["id"], subtotal, impuestos, total,
        data.metodo_pago_id, data.direccion_envio, cupon_id, descuento
    )
    
    # Crear items y actualizar stock
    for item in items_procesados:
        db.create_boleta_item(boleta_id, item["producto_id"], item["cantidad"],
                             item["precio_unitario"], item["subtotal"])
        # Registrar salida de inventario
        db.create_movimiento_inventario(item["producto_id"], "salida", item["cantidad"],
                                        notas=f"Venta - Boleta #{boleta_id}")
    
    return db.get_boleta_with_items(boleta_id)

@app.put("/api/boletas/{id}/estado", tags=["Boletas"])
async def actualizar_estado_boleta(id: int, data: BoletaEstadoUpdate, admin: dict = Depends(require_admin)):
    """Actualizar estado de boleta (Admin)"""
    if not db.get_boleta_by_id(id):
        raise HTTPException(status_code=404, detail="Boleta no encontrada")
    
    estados_validos = ["pendiente", "pagado", "enviado", "entregado", "cancelado"]
    if data.estado not in estados_validos:
        raise HTTPException(status_code=400, detail=f"Estado inválido. Válidos: {estados_validos}")
    
    db.update_boleta_estado(id, data.estado)
    return db.get_boleta_by_id(id)

@app.delete("/api/boletas/{id}", tags=["Boletas"])
async def eliminar_boleta(id: int, admin: dict = Depends(require_admin)):
    """Eliminar boleta (Admin)"""
    if not db.get_boleta_by_id(id):
        raise HTTPException(status_code=404, detail="Boleta no encontrada")
    db.delete_boleta(id)
    return {"message": "Boleta eliminada"}


# ============================================================================
# RESEÑAS
# ============================================================================
@app.get("/api/resenas/producto/{producto_id}", tags=["Reseñas"])
async def listar_resenas_producto(producto_id: int):
    """Listar reseñas de un producto"""
    return db.get_resenas_by_producto(producto_id)

@app.post("/api/resenas", tags=["Reseñas"])
async def crear_resena(data: ResenaCreate, user: dict = Depends(get_current_user)):
    """Crear reseña de producto"""
    if not db.get_producto_by_id(data.producto_id):
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    resena_id = db.create_resena(data.producto_id, user["id"], data.calificacion, data.comentario)
    return db.get_resena_by_id(resena_id)

@app.put("/api/resenas/{id}", tags=["Reseñas"])
async def actualizar_resena(id: int, data: ResenaUpdate, user: dict = Depends(get_current_user)):
    """Actualizar reseña propia"""
    resena = db.get_resena_by_id(id)
    if not resena or resena["usuario_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    
    db.update_resena(id, data.calificacion, data.comentario)
    return db.get_resena_by_id(id)

@app.delete("/api/resenas/{id}", tags=["Reseñas"])
async def eliminar_resena(id: int, user: dict = Depends(get_current_user)):
    """Eliminar reseña propia o como admin"""
    resena = db.get_resena_by_id(id)
    if not resena:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    
    if resena["usuario_id"] != user["id"] and user.get("rol") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    
    db.delete_resena(id)
    return {"message": "Reseña eliminada"}


# ============================================================================
# FAVORITOS
# ============================================================================
@app.get("/api/favoritos", tags=["Favoritos"])
async def listar_favoritos(user: dict = Depends(get_current_user)):
    """Listar productos favoritos del usuario"""
    favoritos = db.get_favoritos_by_usuario(user["id"])
    return _formatear_lista(favoritos)

@app.post("/api/favoritos/{producto_id}", tags=["Favoritos"])
async def agregar_favorito(producto_id: int, user: dict = Depends(get_current_user)):
    """Agregar producto a favoritos"""
    if not db.get_producto_by_id(producto_id):
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    fav_id = db.add_favorito(user["id"], producto_id)
    return {"id": fav_id, "message": "Agregado a favoritos"}

@app.delete("/api/favoritos/{producto_id}", tags=["Favoritos"])
async def quitar_favorito(producto_id: int, user: dict = Depends(get_current_user)):
    """Quitar producto de favoritos"""
    db.remove_favorito(user["id"], producto_id)
    return {"message": "Eliminado de favoritos"}


# ============================================================================
# REPORTES Y EXCEL (Admin)
# ============================================================================
@app.get("/api/reportes/dashboard", tags=["Reportes"])
async def obtener_dashboard(admin: dict = Depends(require_admin)):
    """Obtener estadísticas del dashboard"""
    return db.get_estadisticas_dashboard()

@app.get("/api/reportes/ventas", tags=["Reportes"])
async def reporte_ventas(
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None,
    formato: str = Query("json", regex="^(json|excel)$"),
    admin: dict = Depends(require_admin)
):
    """Reporte de ventas con opción de exportar a Excel"""
    data = db.get_reporte_ventas(fecha_inicio, fecha_fin)
    
    if formato == "excel":
        return _generar_excel(data, "reporte_ventas")
    return data

@app.get("/api/reportes/productos-vendidos", tags=["Reportes"])
async def reporte_productos_vendidos(
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None,
    formato: str = Query("json", regex="^(json|excel)$"),
    admin: dict = Depends(require_admin)
):
    """Reporte de productos más vendidos"""
    data = db.get_reporte_productos_vendidos(fecha_inicio, fecha_fin)
    
    if formato == "excel":
        return _generar_excel(data, "productos_vendidos")
    return data

@app.get("/api/reportes/inventario", tags=["Reportes"])
async def reporte_inventario(
    formato: str = Query("json", regex="^(json|excel)$"),
    admin: dict = Depends(require_admin)
):
    """Reporte de inventario actual"""
    data = db.get_reporte_inventario()
    
    if formato == "excel":
        return _generar_excel(data, "inventario")
    return data

@app.get("/api/reportes/clientes", tags=["Reportes"])
async def reporte_clientes(
    formato: str = Query("json", regex="^(json|excel)$"),
    admin: dict = Depends(require_admin)
):
    """Reporte de clientes"""
    data = db.get_reporte_clientes()
    
    if formato == "excel":
        return _generar_excel(data, "clientes")
    return data


def _generar_excel(data: list, nombre: str) -> StreamingResponse:
    """Genera un archivo Excel a partir de una lista de diccionarios"""
    try:
        import openpyxl
        from openpyxl import Workbook
    except ImportError:
        raise HTTPException(
            status_code=500, 
            detail="Módulo openpyxl no instalado. Ejecute: pip install openpyxl"
        )
    
    wb = Workbook()
    ws = wb.active
    ws.title = nombre[:31]  # Excel limita a 31 caracteres
    
    if not data:
        ws.append(["Sin datos"])
    else:
        # Headers
        headers = list(data[0].keys())
        ws.append(headers)
        
        # Datos
        for row in data:
            ws.append([row.get(h) for h in headers])
        
        # Auto-ajustar columnas
        for column in ws.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)
            ws.column_dimensions[column_letter].width = adjusted_width
    
    # Guardar en buffer
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    
    filename = f"{nombre}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


# ============================================================================
# UTILIDADES
# ============================================================================
@app.get("/api/health", tags=["Sistema"])
async def health_check():
    """Verificar estado del sistema"""
    try:
        tables = db.check_tables()
        return {
            "status": "healthy",
            "database": "connected",
            "tables": tables,
            "total_tables": len(tables)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

@app.post("/api/admin/init-db", tags=["Sistema"])
async def inicializar_base_datos(admin: dict = Depends(require_admin)):
    """Reinicializar base de datos (Admin - CUIDADO: borra todos los datos)"""
    try:
        db.init_database()
        return {"message": "Base de datos inicializada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# EVENTO DE INICIO
# ============================================================================
@app.on_event("startup")
async def startup_event():
    """Inicializar base de datos al arrancar"""
    try:
        tables = db.check_tables()
        if not tables:
            print("⚠️ Base de datos vacía. Inicializando...")
            db.init_database()
        else:
            print(f"✅ Base de datos conectada. Tablas: {list(tables.keys())}")
    except Exception as e:
        print(f"⚠️ Error verificando base de datos: {e}")
        print("Intentando inicializar...")
        try:
            db.init_database()
        except Exception as init_error:
            print(f"❌ Error inicializando: {init_error}")
