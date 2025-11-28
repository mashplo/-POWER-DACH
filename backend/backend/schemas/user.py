from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    is_admin: int | None = 0
