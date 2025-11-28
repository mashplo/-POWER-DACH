from typing import List, Optional
from backend.repos.boleta_repo import BoletaRepo


class BoletaService:
    def __init__(self, repo: BoletaRepo | None = None):
        self.repo = repo or BoletaRepo()

    def list(self) -> List[dict]:
        return self.repo.list()

    def delete(self, boleta_id: int) -> None:
        return self.repo.delete(boleta_id)

    def create(self, data: dict) -> int:
        return self.repo.create(data)
