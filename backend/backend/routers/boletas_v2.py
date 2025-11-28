from fastapi import APIRouter, Request, HTTPException
from backend.core.security import require_admin
from backend.services.boleta_service import BoletaService
from backend.schemas.boleta import BoletaRead, BoletaCreate

router = APIRouter(prefix="/api/v2", tags=["boletas-v2"])


@router.get("/boletas", response_model=list[BoletaRead])
def list_boletas(request: Request):
    require_admin(request)
    svc = BoletaService()
    return svc.list()


@router.delete("/boletas/{boleta_id}")
def delete_boleta(boleta_id: int, request: Request):
    require_admin(request)
    BoletaService().delete(boleta_id)
    return {"status": "success", "mensaje": "Boleta eliminada"}


@router.post("/boletas")
def create_boleta(data: BoletaCreate, request: Request):
    # Opcional: permitir creación vía API (puede ser pública o autenticada según negocio)
    require_admin(request)
    new_id = BoletaService().create(data.dict())
    return {"status": "success", "id": new_id}
