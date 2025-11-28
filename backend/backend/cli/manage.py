import json
import typer
from backend.database import inicializar_db, engine
from backend.services.auth_service import AuthService
from backend.services.product_service import ProductService, CreatinaService, PreentrenoService
from backend.services.boleta_service import BoletaService
from sqlalchemy import text

app = typer.Typer()


@app.command()
def init_db():
    """Inicializa las tablas (usa la función existente)."""
    inicializar_db()
    typer.echo("DB inicializada.")


@app.command()
def seed_user(nombre: str = "seed", email: str = "seed@example.com", password: str = "abc123"):
    """Crear usuario seed - usa el servicio de autenticación."""
    svc = AuthService()
    try:
        u = svc.register(nombre, email, password)
        typer.echo(f"Usuario creado: {u}")
    except Exception as e:
        typer.echo(f"Error: {e}")


@app.command()
def list_tables():
    """Lista tablas existentes en la base de datos."""
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"))
        names = [r[0] for r in rows]
        typer.echo("Tablas:\n" + "\n".join(names))


@app.command()
def seed_products(kind: str = typer.Argument(..., help="products|creatinas|preentrenos")):
    """Inserta ejemplos mínimos para la tabla indicada."""
    ejemplo = {
        "title": "Ejemplo",
        "description": "Producto de ejemplo",
        "price": 9.99,
        "images": "",
        "category": "general",
    }
    if kind == "products":
        ProductService().create(ejemplo)
    elif kind == "creatinas":
        CreatinaService().create(ejemplo)
    elif kind == "preentrenos":
        PreentrenoService().create(ejemplo)
    else:
        typer.echo("kind inválido")
        raise typer.Exit(code=1)
    typer.echo(f"Seed insertado en {kind}")


@app.command()
def list_boletas():
    """Lista boletas (JSON)."""
    data = BoletaService().list()
    typer.echo(json.dumps(data, ensure_ascii=False))


@app.command()
def delete_boleta(boleta_id: int):
    """Elimina boleta por ID."""
    BoletaService().delete(boleta_id)
    typer.echo("Boleta eliminada")


if __name__ == "__main__":
    app()
