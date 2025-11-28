from typing import Optional
from backend.repos.user_repo import UserRepo
from backend.core.security import hash_password


class UserService:
    def __init__(self, repo: UserRepo | None = None):
        self.repo = repo or UserRepo()

    def list(self) -> list[dict]:
        return self.repo.list_all()

    def get(self, usuario_id: int) -> Optional[dict]:
        return self.repo.get_by_id(usuario_id)

    def update(self, usuario_id: int, nombre: str | None = None, email: str | None = None, password: str | None = None, is_admin: int | None = None) -> None:
        hashed = hash_password(password) if password else None
        self.repo.update(usuario_id, nombre=nombre, email=email, password_hashed=hashed, is_admin=is_admin)

    def delete(self, usuario_id: int) -> None:
        self.repo.delete(usuario_id)
