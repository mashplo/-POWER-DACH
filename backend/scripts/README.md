# Scripts de mantenimiento y carga de datos

Este directorio centraliza los scripts utilitarios (seed, carga masiva, limpieza) que no forman parte del runtime de la API v2.

## Qué mover aquí

- agregar_creatina_*.py
- agregar_preentreno_*.py
- crear_productos.py
- eliminar_duplicado.py
- runner.py (si solo orquesta scripts)

## Cómo ejecutarlos

Ejemplo:

```bash
# PowerShell
python backend/agregar_creatina.py
python backend/crear_productos.py
```

Sugerencia: renombrar o reubicar los scripts dentro de `backend/scripts/` para mantener el backend limpio y la API v2 separada del tooling.

## Advertencias
- Siempre haz backup de `backend/backend/proteinas.db` antes de correr scripts que modifiquen datos.
- Verifica que el esquema (`backend/backend/schema.sql`) esté alineado con los campos que inserta cada script.
