from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from backend.core.config import settings
from fastapi import Request, HTTPException
from backend.repos.user_repo import UserRepo

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:
        return False


ALGORITHM = "HS256"


def create_access_token(data: dict, expires_minutes: int | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=(expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    key = settings.SECRET_KEY or "dev-secret"
    return jwt.encode(to_encode, key, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY or "dev-secret", algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise


def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no provisto")
    token = auth_header.split(" ", 1)[1]
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")
    repo = UserRepo()
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no existe")
    return user


def require_admin(request: Request) -> dict:
    user = get_current_user(request)
    if not user.get('is_admin'):
        raise HTTPException(status_code=403, detail="Acceso restringido: requiere rol admin")
    return user
