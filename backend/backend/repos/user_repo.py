from typing import Optional
from backend.database import engine
from sqlalchemy import text


class UserRepo:
    def __init__(self):
        self.engine = engine

    def get_by_email(self, email: str) -> Optional[dict]:
        with self.engine.connect() as conn:
            row = conn.execute(text("SELECT id, nombre, email, password, is_admin FROM usuarios WHERE email = :email"), {"email": email}).first()
            if not row:
                return None
            return dict(row._mapping)

    def get_by_id(self, id: int) -> Optional[dict]:
        with self.engine.connect() as conn:
            row = conn.execute(text("SELECT id, nombre, email, is_admin FROM usuarios WHERE id = :id"), {"id": id}).first()
            if not row:
                return None
            return dict(row._mapping)

    def create(self, nombre: str, email: str, password_hashed: str, is_admin: int = 0) -> dict:
        with self.engine.begin() as conn:
            conn.execute(text("INSERT INTO usuarios (nombre, email, password, is_admin) VALUES (:nombre, :email, :password, :is_admin)"), {
                "nombre": nombre,
                "email": email,
                "password": password_hashed,
                "is_admin": is_admin,
            })
            row = conn.execute(text("SELECT id, nombre, email, is_admin FROM usuarios WHERE email = :email"), {"email": email}).first()
            return dict(row._mapping)

    def list_all(self) -> list[dict]:
        with self.engine.connect() as conn:
            rows = conn.execute(text("SELECT id, nombre, email, is_admin FROM usuarios ORDER BY id DESC")).all()
            return [dict(r._mapping) for r in rows]

    def update(self, usuario_id: int, nombre: str | None = None, email: str | None = None, password_hashed: str | None = None, is_admin: int | None = None) -> None:
        updates = []
        params: dict = {"id": usuario_id}
        if nombre is not None:
            updates.append("nombre = :nombre")
            params["nombre"] = nombre
        if email is not None:
            updates.append("email = :email")
            params["email"] = email
        if password_hashed is not None:
            updates.append("password = :password")
            params["password"] = password_hashed
        if is_admin is not None:
            updates.append("is_admin = :is_admin")
            params["is_admin"] = int(is_admin)
        if not updates:
            return
        stmt = "UPDATE usuarios SET " + ", ".join(updates) + " WHERE id = :id"
        with self.engine.begin() as conn:
            conn.execute(text(stmt), params)

    def delete(self, usuario_id: int) -> None:
        with self.engine.begin() as conn:
            conn.execute(text("DELETE FROM usuarios WHERE id = :id"), {"id": usuario_id})
