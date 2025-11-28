from typing import List
from backend.repos.product_repo import ProductRepo


class ProductService:
    def __init__(self, repo: ProductRepo | None = None):
        self.repo = repo or ProductRepo('productos')

    def list_products(self, min_price: float | None = None, max_price: float | None = None, category: str | None = None, search: str | None = None) -> List[dict]:
        clauses = []
        params = {}
        if min_price is not None:
            clauses.append("price >= :min_price")
            params['min_price'] = min_price
        if max_price is not None:
            clauses.append("price <= :max_price")
            params['max_price'] = max_price
        if category:
            clauses.append("category LIKE :category")
            params['category'] = f"%{category}%"
        if search:
            clauses.append("title LIKE :search")
            params['search'] = f"%{search}%"
        where = ' AND '.join(clauses)
        return self.repo.list(where, params)

    # Generic create/update/delete delegating to repo
    def create(self, data: dict):
        return self.repo.create(data)

    def update(self, id: int, data: dict):
        return self.repo.update(id, data)

    def delete(self, id: int):
        return self.repo.delete(id)


class CreatinaService(ProductService):
    def __init__(self, repo: ProductRepo | None = None):
        super().__init__(repo or ProductRepo('creatinas'))


class PreentrenoService(ProductService):
    def __init__(self, repo: ProductRepo | None = None):
        super().__init__(repo or ProductRepo('preentrenos'))
