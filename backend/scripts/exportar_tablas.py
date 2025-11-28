import sqlite3
import json

def ver_todas_tablas_json():
    conn = sqlite3.connect('proteinas.db')
    cursor = conn.cursor()
    
    # Obtener todas las tablas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tablas = cursor.fetchall()
    
    resultado = {}
    
    for (tabla,) in tablas:
        # Obtener estructura de la tabla
        cursor.execute(f"PRAGMA table_info({tabla})")
        columnas = cursor.fetchall()
        
        # Obtener datos
        cursor.execute(f"SELECT * FROM {tabla}")
        registros = cursor.fetchall()
        
        nombres_columnas = [col[1] for col in columnas]
        
        resultado[tabla] = {
            "estructura": [
                {
                    "nombre": col[1],
                    "tipo": col[2],
                    "primary_key": bool(col[5]),
                    "not_null": bool(col[3])
                }
                for col in columnas
            ],
            "total_registros": len(registros),
            "datos": [
                dict(zip(nombres_columnas, registro))
                for registro in registros
            ]
        }
    
    conn.close()
    
    # Guardar en archivo JSON
    with open('tablas_info.json', 'w', encoding='utf-8') as f:
        json.dump(resultado, f, indent=2, ensure_ascii=False)
    
    print("✅ Información guardada en tablas_info.json")
    
    # Mostrar resumen
    print("\n" + "=" * 80)
    print("📊 RESUMEN DE LA BASE DE DATOS")
    print("=" * 80)
    for tabla, info in resultado.items():
        print(f"\n📋 {tabla.upper()}")
        print(f"   Total de registros: {info['total_registros']}")
        print(f"   Columnas: {', '.join([col['nombre'] for col in info['estructura']])}")

if __name__ == "__main__":
    ver_todas_tablas_json()
