from .auth_v2 import router as auth_v2_router
from .products_v2 import router as products_v2_router
from .boletas_v2 import router as boletas_v2_router
from .users_v2 import router as users_v2_router

__all__ = ["auth_v2_router", "products_v2_router", "boletas_v2_router", "users_v2_router"]
