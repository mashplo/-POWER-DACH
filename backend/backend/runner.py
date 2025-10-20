import uvicorn

def ejecutar_api():
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)