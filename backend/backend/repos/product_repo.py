from typing import List
from backend.database import engine
from sqlalchemy import text


class ProductRepo:
    def __init__(self, table_name: str = 'productos'):
        self.engine = engine
        self.table = table_name

    def list(self, where_clause: str = '', params: dict | None = None) -> List[dict]:
        sql = f"SELECT * FROM {self.table} "
        if where_clause:
            sql += " WHERE " + where_clause
        sql += " ORDER BY title ASC"
        with self.engine.connect() as conn:
            rows = conn.execute(text(sql), params or {}).all()
            return [dict(r._mapping) for r in rows]

    def create(self, data: dict) -> None:
        cols = ','.join(data.keys())
        vals = ','.join([f":{k}" for k in data.keys()])
        sql = f"INSERT INTO {self.table} ({cols}) VALUES ({vals})"
        with self.engine.begin() as conn:
            conn.execute(text(sql), data)

    def update(self, id: int, data: dict) -> None:
        sets = ','.join([f"{k}=:{k}" for k in data.keys()])
        sql = f"UPDATE {self.table} SET {sets} WHERE id = :id"
        params = data.copy()
        params['id'] = id
        with self.engine.begin() as conn:
            conn.execute(text(sql), params)

    def delete(self, id: int) -> None:
        sql = f"DELETE FROM {self.table} WHERE id = :id"
        with self.engine.begin() as conn:
            conn.execute(text(sql), {"id": id})
