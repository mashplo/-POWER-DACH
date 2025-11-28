from pydantic import BaseModel
from typing import Any


class BoletaRead(BaseModel):
    id: int
    usuario_id: int
    numeroPedido: str
    items: str
    total: float
    metodoPago: str | None = None
    fecha: str


class BoletaCreate(BaseModel):
    usuario_id: int
    numeroPedido: str
    items: str
    total: float
    metodoPago: str | None = None
    fecha: str
