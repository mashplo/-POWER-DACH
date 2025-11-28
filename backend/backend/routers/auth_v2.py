from fastapi import APIRouter, Depends, HTTPException
from backend.schemas.user import UserCreate, UserOut
from backend.schemas.auth import LoginIn, TokenOut
from backend.services.auth_service import AuthService
from backend.core.security import get_current_user
from fastapi import Request

router = APIRouter(prefix="/api/v2/auth", tags=["auth-v2"])


@router.post("/register", response_model=UserOut)
def register(user: UserCreate):
    svc = AuthService()
    try:
        new = svc.register(user.nombre, user.email, user.password)
        return UserOut(**new)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn):
    svc = AuthService()
    user = svc.authenticate(data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = svc.create_token_for_user(user)
    return TokenOut(access_token=token)


@router.get('/me', response_model=UserOut)
def me(request: Request):
    user = get_current_user(request)
    # map to UserOut schema (UserRepo returns id,nombre,email,is_admin)
    return UserOut(id=user['id'], nombre=user['nombre'], email=user['email'], is_admin=user.get('is_admin', 0))
