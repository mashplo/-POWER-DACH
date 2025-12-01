from backend.database import get_db, inicializar_db

def crear_proteinas_ejemplo():
    # Primero inicializar la base de datos
    inicializar_db()
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Verificar si ya hay productos
    cursor.execute("SELECT COUNT(*) FROM productos")
    if cursor.fetchone()[0] > 0:
        print("Ya hay proteínas en la base de datos")
        conn.close()
        return
    
    # Solo proteínas para el proyecto universitario
    proteinas = [
        {
            "title": "Whey Protein Gold Standard",
            "description": "Proteína de suero de leche premium, ideal para ganar masa muscular. 24g de proteína por porción.",
            "price": 120.00,
            "images": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400,https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400",
            "category": "Whey Protein"
        },
        {
            "title": "Proteína Caseína Premium",
            "description": "Proteína de absorción lenta perfecta para tomar antes de dormir. 25g de proteína por porción.",
            "price": 95.00,
            "images": "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=400,https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400",
            "category": "Caseína"
        },
        {
            "title": "Proteína Vegana Plant Power",
            "description": "Mezcla de proteínas vegetales. Sin lactosa. 22g de proteína por porción.",
            "price": 110.00,
            "images": "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400",
            "category": "Proteína Vegana"
        },
        {
            "title": "Whey Isolate Ultra Pure",
            "description": "Proteína aislada de suero 90% pura. Baja en grasas y carbohidratos. 28g de proteína.",
            "price": 150.00,
            "images": "https://images.unsplash.com/photo-1594737626072-90dc274bc2bd?w=400,https://images.unsplash.com/photo-1591884245034-8caa564f5f3e?w=400",
            "category": "Whey Isolate"
        },
        {
            "title": "Proteína de Carne Beef Pro",
            "description": "Proteína hidrolizada de carne. Alta absorción. 24g de proteína por porción.",
            "price": 140.00,
            "images": "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400",
            "category": "Proteína de Carne"
        },
        {
            "title": "Mass Gainer Extreme",
            "description": "Ganador de peso con proteína y carbohidratos. Ideal para volumen. 50g de proteína.",
            "price": 160.00,
            "images": "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400,https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
            "category": "Mass Gainer"
        },
        {
            "title": "Proteína de Huevo Egg Pro",
            "description": "Proteína pura de clara de huevo. Sin lactosa. 23g de proteína por porción.",
            "price": 130.00,
            "images": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
            "category": "Proteína de Huevo"
        },
        {
            "title": "Whey Concentrate Básica",
            "description": "Proteína concentrada económica para comenzar. 20g de proteína por porción.",
            "price": 85.00,
            "images": "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400,https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
            "category": "Whey Protein"
        }
    ]
    
    for proteina in proteinas:
        cursor.execute("""
            INSERT INTO productos (title, description, price, images, category)
            VALUES (?, ?, ?, ?, ?)
        """, (
            proteina["title"],
            proteina["description"],
            proteina["price"],
            proteina["images"],
            proteina["category"]
        ))
    
    conn.commit()
    conn.close()
    print("¡Proteínas de ejemplo creadas exitosamente!")

if __name__ == "__main__":
    crear_proteinas_ejemplo()