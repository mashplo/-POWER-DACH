from pydantic import BaseModel
from typing import List


class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    images: List[str] | str = []
    category: str | None = ""


class ProductCreate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: int
