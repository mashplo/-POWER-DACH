import sqlite3

def ver_todas_tablas():
    conn = sqlite3.connect('proteinas.db')
    cursor = conn.cursor()
    
    # Obtener todas las tablas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tablas = cursor.fetchall()
    
    print("=" * 80)
    print("📊 BASE DE DATOS: proteinas.db")
    print("=" * 80)
    
    for (tabla,) in tablas:
        print(f"\n{'=' * 80}")
        print(f"📋 TABLA: {tabla.upper()}")
        print("=" * 80)
        
        # Obtener estructura de la tabla
        cursor.execute(f"PRAGMA table_info({tabla})")
        columnas = cursor.fetchall()
        
        print("\n🔧 Estructura:")
        for col in columnas:
            col_id, nombre, tipo, notnull, default, pk = col
            pk_text = " [PRIMARY KEY]" if pk else ""
            notnull_text = " NOT NULL" if notnull else ""
            print(f"  - {nombre}: {tipo}{pk_text}{notnull_text}")
        
        # Obtener datos
        cursor.execute(f"SELECT * FROM {tabla}")
        registros = cursor.fetchall()
        
        print(f"\n📦 Total de registros: {len(registros)}")
        
        if len(registros) > 0:
            print("\n📄 Datos:")
            nombres_columnas = [col[1] for col in columnas]
            
            for i, registro in enumerate(registros, 1):
                print(f"\n  Registro #{i}:")
                for nombre, valor in zip(nombres_columnas, registro):
                    # Truncar valores muy largos
                    valor_str = str(valor)
                    if len(valor_str) > 100:
                        valor_str = valor_str[:100] + "..."
                    print(f"    {nombre}: {valor_str}")
    
    print("\n" + "=" * 80)
    conn.close()

if __name__ == "__main__":
    ver_todas_tablas()
