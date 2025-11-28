from fastapi import APIRouter, Depends, HTTPException, Request
from backend.services.product_service import ProductService, CreatinaService, PreentrenoService
from backend.schemas.product import ProductRead, ProductCreate
from backend.core.security import require_admin

router = APIRouter(prefix="/api/v2", tags=["products-v2"])


@router.get("/products", response_model=list[ProductRead])
def list_products(min_price: float | None = None, max_price: float | None = None, category: str | None = None, search: str | None = None):
    svc = ProductService()
    rows = svc.list_products(min_price, max_price, category, search)
    # normalize images field
    for r in rows:
        imgs = r.get('images', '')
        r['images'] = imgs.split(',') if imgs else []
    return rows


@router.get("/creatinas", response_model=list[ProductRead])
def list_creatinas(min_price: float | None = None, max_price: float | None = None, category: str | None = None, search: str | None = None):
    svc = CreatinaService()
    rows = svc.list_products(min_price, max_price, category, search)
    for r in rows:
        imgs = r.get('images', '')
        r['images'] = imgs.split(',') if imgs else []
    return rows


@router.get("/preentrenos", response_model=list[ProductRead])
def list_preentrenos(min_price: float | None = None, max_price: float | None = None, category: str | None = None, search: str | None = None):
    svc = PreentrenoService()
    rows = svc.list_products(min_price, max_price, category, search)
    for r in rows:
        imgs = r.get('images', '')
        r['images'] = imgs.split(',') if imgs else []
    return rows


@router.post("/products")
def create_product(product: ProductCreate, request: Request):
    require_admin(request)
    svc = ProductService()
    data = product.dict()
    data['images'] = ','.join(data['images']) if isinstance(data['images'], list) else str(data['images'])
    svc.create(data)
    return {"status": "success", "mensaje": "Producto creado"}


@router.put("/products/{product_id}")
def update_product(product_id: int, product: ProductCreate, request: Request):
    require_admin(request)
    svc = ProductService()
    data = product.dict()
    data['images'] = ','.join(data['images']) if isinstance(data['images'], list) else str(data['images'])
    svc.update(product_id, data)
    return {"status": "success", "mensaje": "Producto actualizado"}


@router.delete("/products/{product_id}")
def delete_product(product_id: int, request: Request):
    require_admin(request)
    svc = ProductService()
    svc.delete(product_id)
    return {"status": "success", "mensaje": "Producto eliminado"}


@router.post("/creatinas")
def create_creatina(product: ProductCreate, request: Request):
    require_admin(request)
    svc = CreatinaService()
    data = product.dict()
    data['images'] = ','.join(data['images']) if isinstance(data['images'], list) else str(data['images'])
    svc.create(data)
    return {"status": "success", "mensaje": "Creatina creada"}


@router.put("/creatinas/{product_id}")
def update_creatina(product_id: int, product: ProductCreate, request: Request):
    require_admin(request)
    svc = CreatinaService()
    data = product.dict()
    data['images'] = ','.join(data['images']) if isinstance(data['images'], list) else str(data['images'])
    svc.update(product_id, data)
    return {"status": "success", "mensaje": "Creatina actualizada"}


@router.delete("/creatinas/{product_id}")
def delete_creatina(product_id: int, request: Request):
    require_admin(request)
    svc = CreatinaService()
    svc.delete(product_id)
    return {"status": "success", "mensaje": "Creatina eliminada"}


@router.post("/preentrenos")
def create_preentreno(product: ProductCreate, request: Request):
    require_admin(request)
    svc = PreentrenoService()
    data = product.dict()
    data['images'] = ','.join(data['images']) if isinstance(data['images'], list) else str(data['images'])
    svc.create(data)
    return {"status": "success", "mensaje": "Pre-entreno creado"}


@router.put("/preentrenos/{product_id}")
def update_preentreno(product_id: int, product: ProductCreate, request: Request):
    require_admin(request)
    svc = PreentrenoService()
    data = product.dict()
    data['images'] = ','.join(data['images']) if isinstance(data['images'], list) else str(data['images'])
    svc.update(product_id, data)
    return {"status": "success", "mensaje": "Pre-entreno actualizado"}


@router.delete("/preentrenos/{product_id}")
def delete_preentreno(product_id: int, request: Request):
    require_admin(request)
    svc = PreentrenoService()
    svc.delete(product_id)
    return {"status": "success", "mensaje": "Pre-entreno eliminado"}
