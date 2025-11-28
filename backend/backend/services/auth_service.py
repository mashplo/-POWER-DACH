from backend.repos.user_repo import UserRepo
from backend.core import security


class AuthService:
    def __init__(self, user_repo: UserRepo | None = None):
        self.user_repo = user_repo or UserRepo()

    def register(self, nombre: str, email: str, password: str) -> dict:
        existing = self.user_repo.get_by_email(email)
        if existing:
            raise ValueError("Email ya registrado")
        hashed = security.hash_password(password)
        return self.user_repo.create(nombre, email, hashed, is_admin=0)

    def authenticate(self, email: str, password: str) -> dict | None:
        user = self.user_repo.get_by_email(email)
        if not user:
            return None
        if not security.verify_password(password, user.get('password', '')):
            return None
        return user

    def create_token_for_user(self, user: dict) -> str:
        # create token with subject as user id
        return security.create_access_token({"sub": str(user['id']), "email": user['email']})
