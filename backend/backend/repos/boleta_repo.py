from typing import List, Optional
from backend.database import engine
from sqlalchemy import text


class BoletaRepo:
    def __init__(self):
        self.engine = engine

    def list(self) -> List[dict]:
        with self.engine.connect() as conn:
            rows = conn.execute(text("SELECT id, usuario_id, numeroPedido, items, total, metodoPago, fecha FROM boletas ORDER BY id DESC")).all()
            return [dict(r._mapping) for r in rows]

    def delete(self, boleta_id: int) -> None:
        with self.engine.begin() as conn:
            conn.execute(text("DELETE FROM boletas WHERE id = :id"), {"id": boleta_id})

    def create(self, data: dict) -> int:
        with self.engine.begin() as conn:
            conn.execute(text("INSERT INTO boletas (usuario_id, numeroPedido, items, total, metodoPago, fecha) VALUES (:usuario_id, :numeroPedido, :items, :total, :metodoPago, :fecha)"), data)
            # SQLite last row id helper (optional):
            if engine.url.get_backend_name() == 'sqlite':
                new_id = conn.execute(text("SELECT last_insert_rowid() as id")).first()[0]
                return int(new_id)
        return 0
