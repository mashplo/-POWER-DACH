from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr
from backend.core.security import require_admin
from backend.services.user_service import UserService


class UserAdminOut(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    is_admin: int | None = 0


class UserEdit(BaseModel):
    nombre: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    is_admin: int | None = None


router = APIRouter(prefix="/api/v2/users", tags=["users-v2"]) 


@router.get("/", response_model=list[UserAdminOut])
def list_users(request: Request):
    require_admin(request)
    svc = UserService()
    return [UserAdminOut(**u) for u in svc.list()]


@router.get("/{usuario_id}", response_model=UserAdminOut)
def get_user(usuario_id: int, request: Request):
    require_admin(request)
    svc = UserService()
    u = svc.get(usuario_id)
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return UserAdminOut(**u)


@router.put("/{usuario_id}")
def update_user(usuario_id: int, data: UserEdit, request: Request):
    require_admin(request)
    svc = UserService()
    if not svc.get(usuario_id):
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    svc.update(usuario_id, nombre=data.nombre, email=data.email, password=data.password, is_admin=data.is_admin)
    return {"status": "success", "mensaje": "Usuario actualizado"}


@router.delete("/{usuario_id}")
def delete_user(usuario_id: int, request: Request):
    require_admin(request)
    svc = UserService()
    if not svc.get(usuario_id):
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    svc.delete(usuario_id)
    return {"status": "success", "mensaje": "Usuario eliminado"}
