import os
import sqlite3

# Permite configurar la ruta de la BD vía variable de entorno para Railway
# Por defecto usa un archivo local 'proteinas.db' en el working directory.
DB_PATH = os.getenv("DB_PATH", "proteinas.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def inicializar_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Tabla de productos (proteínas)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            images TEXT NOT NULL,
            category TEXT NOT NULL
        )
    ''')
    
    # Tabla de creatinas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS creatinas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            images TEXT NOT NULL,
            category TEXT NOT NULL
        )
    ''')
    
    # Tabla de pre-entrenos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS preentrenos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            images TEXT NOT NULL,
            category TEXT NOT NULL
        )
    ''')
    
    # Tabla de usuarios (simple)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()
