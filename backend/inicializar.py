#!/usr/bin/env python3
"""Script para inicializar la base de datos con proteínas, creatinas y usuarios"""

from sqlalchemy import text
from backend.database import inicializar_db, get_db
from passlib.context import CryptContext

# Configurar bcrypt para hashear contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Crear las tablas
print("Inicializando base de datos...")
inicializar_db()

conn = get_db()

# ===== CREAR PROTEÍNAS DE EJEMPLO =====
result = conn.execute(text("SELECT COUNT(*) FROM productos"))
count = result.scalar()

if count > 0:
    print(f"✓ Ya hay {count} proteínas en la base de datos")
else:
    print("Creando proteínas de ejemplo...")
    
    proteinas = [
        {
            "title": "Whey Protein Gold Standard",
            "description": "Suplemento de proteína en polvo reconocido mundialmente por su calidad y eficacia. Contiene 24g de proteína de alta calidad por porción, con más de 5.5g de BCAA naturales y 4g de glutamina. Bajo en calorías (120 cal), grasas (1.5g) y carbohidratos (3g). Certificación Informed-Choice que garantiza pureza y calidad. Fácil de mezclar, ideal para antes o después del ejercicio. Disponible en más de 20 sabores deliciosos.",
            "price": 120.00,
            "images": "http://127.0.0.1:8000/assets/productos/whey-protein-gold-2.webp,http://127.0.0.1:8000/assets/productos/whey-protein-gold-1.webp",
            "category": "Whey Protein"
        },
        {
            "title": "Protein Iso Whey 90",
            "description": "Suplemento a base de aislado de suero de leche de alta pureza (90%), diseñado para favorecer la ganancia de masa muscular magra, acelerar la recuperación y apoyar dietas bajas en carbohidratos. Bajo en lactosa y grasa. 24g de proteína por servicio. Envase de 5kg (aprox. 167 servicios). Ideal para desarrollo muscular, recuperación post-entrenamiento y control de peso. Fácil de mezclar en agua o leche.",
            "price": 95.00,
            "images": "http://127.0.0.1:8000/assets/productos/iso-whey-1.png,http://127.0.0.1:8000/assets/productos/iso-whey-2.webp",
            "category": "Whey Isolate"
        },
        {
            "title": "Mutant Mass",
            "description": "La Proteína Universe Nutrition UN Iso Whey 90 es un suplemento a base de aislado de suero de leche de alta pureza, diseñado para favorecer la ganancia de masa muscular magra, acelerar la recuperación y apoyar dietas bajas en carbohidratos. Bajo en lactosa y grasa. 24g de proteína por servicio. Envase de 5kg (aprox. 167 servicios). Ideal para desarrollo muscular, recuperación post-entrenamiento y control de peso. Fácil de mezclar en agua o leche.",
            "price": 110.00,
            "images": "http://127.0.0.1:8000/assets/productos/mutant-mass-1.webp,http://127.0.0.1:8000/assets/productos/mutant-mass-2.webp",
            "category": "Mass Gainer"
        },
        {
            "title": "Big M 5 Kg",
            "description": "BIGM de Universe Nutrition en presentación de 5 kg es un suplemento tipo ganador de peso (mass gainer), diseñado para personas que buscan aumentar su masa muscular y peso corporal a través de un mayor aporte de calorías, proteínas y carbohidratos. Características Principales: Objetivo: Ganancia de peso y volumen muscular (etapa de volumen). Presentación: Saco o bolsa de 5 kg (equivalente a aproximadamente 48 servicios, dependiendo del tamaño del scoop). Perfil Nutricional: Combina múltiples fuentes de proteínas de alta calidad con carbohidratos complejos para una liberación de energía sostenida. Ingredientes Clave: Contiene una mezcla de proteína de suero de leche, albúmina de huevo y proteína aislada de soya. Además, está fortificado con BCAA, L-glutamina y creatina para optimizar la recuperación y el crecimiento muscular. Información Nutricional Aproximada (por servicio de 3 scoops ~105 g): Calorías: ~412 kcal. Proteínas: ~34 g (verificar etiqueta del producto específico). Carbohidratos: Alto contenido para energía y recuperación. Grasas: Bajo contenido. Beneficios: Recuperación post-entrenamiento, balance calórico positivo, desarrollo muscular y versatilidad para hombres y mujeres con metabolismo acelerado. Modo de Uso Sugerido: Mezclar un servicio (3 scoops) en 400 ml de agua fría o leche en un shaker. Consumir a media mañana, a media tarde o 30-40 minutos después del entrenamiento.",
            "price": 150.00,
            "images": "http://127.0.0.1:8000/assets/productos/D_NQ_NP_2X_770322-MPE89325400230_082025-F-ganador-de-peso-universe-nutrition-bigm-3-kg.webp,http://127.0.0.1:8000/assets/productos/D_NQ_NP_2X_674831-MPE48461124455_122021-F.webp",
            "category": "Mass Gainer"
        },
        {
            "title": "Gold Standard Isolate",
            "description": "Proteína Optimum Nutrition Gold Standard 100% Isolate de ultra alta pureza, diseñada para crecimiento y recuperación muscular rápidos con mínimo de grasa y carbohidratos. Pureza excepcional con procesos avanzados de microfiltración. 25g de proteína por porción (más del 80% proteína pura). Menos de 1g de grasa y azúcar. Rápida absorción con proteína hidrolizada. Rica en más de 5.5g de BCAA naturales. Libre de lactosa y gluten. Certificada Informed-Choice.",
            "price": 140.00,
            "images": "http://127.0.0.1:8000/assets/productos/157616-1600-auto.png,http://127.0.0.1:8000/assets/productos/157997-1600-auto.webp,http://127.0.0.1:8000/assets/productos/157998-1600-auto.webp",
            "category": "Whey Isolate"
        },
        {
            "title": "Gold Standard Plant",
            "description": "Optimum Nutrition Gold Standard 100% Plant es un suplemento de proteína vegana y sin gluten para adultos activos que buscan proteína de alta calidad y origen vegetal. 24g de proteína vegetal por porción. Perfil completo de aminoácidos con proteínas de guisante, arroz integral y haba (9 EAAs, más de 5.5g BCAA). Fórmula orgánica certificada USDA, Non-GMO, libre de artificiales. 0g de azúcar, mínimo de grasa. Enriquecida con granos antiguos sin gluten (amaranto, quinua, trigo sarraceno, mijo, chía), polvo de granada orgánica, vitaminas C y B12. Fácil de mezclar, sin textura arenosa.",
            "price": 160.00,
            "images": "http://127.0.0.1:8000/assets/productos/157619-1600-auto.png,http://127.0.0.1:8000/assets/productos/157620-1600-auto.png",
            "category": "Proteína Vegana"
        },
        {
            "title": "Nutrex Research Isofit",
            "description": "Proteína de suero aislada de alta pureza para absorción ultrarrrápida, eficaz para recuperación muscular y crecimiento de masa magra. Baja en grasas y carbohidratos, sabor premium. Pureza excepcional mediante microfiltración de flujo cruzado. 25g de proteína pura, <1g grasa, 1g carbohidratos por porción. 12g de aminoácidos esenciales (EAAs) y 6g de BCAAs. Libre de lactosa y gluten. Sabor gourmet con aceite MCT y fibra de inulina orgánica. Ideal para aumentar masa muscular magra o control de peso.",
            "price": 130.00,
            "images": "http://127.0.0.1:8000/assets/productos/157936-1600-auto.webp,http://127.0.0.1:8000/assets/productos/157937-1600-auto.webp",
            "category": "Whey Isolate"
        },
        {
            "title": "OWYN Plant-Based Protein",
            "description": "OWYN (Only What You Need) Plant-Based Protein ofrece nutrición limpia y completa, apto para alergias y dietas veganas. Mezcla de proteínas de guisante, calabaza orgánica y linaza orgánica con perfil completo de 9 aminoácidos esenciales. Batidos estándar con 20g de proteína, línea Pro Elite hasta 35g. Bajo en azúcar (0g en polvos) y grasas. Libre de 8 alérgenos principales (lácteos, soja, gluten, huevo, cacahuete, frutos secos, pescado, mariscos). Incluye superalimentos verdes (col rizada, espinaca, brócoli) y 500mg+ de omega-3 vegetal. Sin ingredientes artificiales, sabores naturales con fruta monje. Textura suave y cremosa, sin regusto calcáreo.",
            "price": 85.00,
            "images": "http://127.0.0.1:8000/assets/productos/158057-1600-auto.webp,http://127.0.0.1:8000/assets/productos/158059-1600-auto.webp",
            "category": "Proteína Vegana"
        }
    ]
    
    for proteina in proteinas:
        conn.execute(text("""
            INSERT INTO productos (title, description, price, images, category)
            VALUES (:title, :description, :price, :images, :category)
        """), proteina)
    
    conn.commit()
    print(f"✓ ¡{len(proteinas)} proteínas creadas exitosamente!")

# ===== CREAR CREATINAS DE EJEMPLO =====
result = conn.execute(text("SELECT COUNT(*) FROM creatinas"))
count_creatinas = result.scalar()

if count_creatinas > 0:
    print(f"✓ Ya hay {count_creatinas} creatinas en la base de datos")
else:
    print("\nCreando creatinas de ejemplo...")
    
    creatinas = [
        {
            "title": "Optimum Nutrition Creatine",
            "description": "La Creatina 100% 1200 G de Optimum Nutrition es un suplemento de monohidrato de creatina micronizada pura diseñado para mejorar la fuerza, la potencia y el rendimiento muscular en entrenamientos de moderada a alta intensidad. Es un polvo sin sabor, lo que facilita su mezcla con agua o cualquier otra bebida. Monohidrato de Creatina Pura: Contiene 100% monohidrato de creatina de alta calidad, uno de los ingredientes más estudiados y efectivos en la nutrición deportiva. Micronizada para una Mejor Absorción: El proceso de micronización reduce el tamaño de las partículas del polvo, lo que mejora significativamente su solubilidad y absorción en el organismo, optimizando los resultados y reduciendo posibles molestias gastrointestinales. Aumento de Fuerza y Rendimiento: Favorece la regeneración de ATP (trifosfato de adenosina), la fuente de energía del organismo para los músculos, lo que permite realizar movimientos explosivos y series de ejercicio más intensas y duraderas. Promueve el Crecimiento Muscular: Ayuda en la ganancia de masa muscular y mejora el volumen celular (hidratación celular), lo cual, combinado con entrenamiento de resistencia regular, apoya el crecimiento magro. Perfil Nutricional Limpio: No aporta calorías, carbohidratos, grasas ni azúcares, lo que la hace compatible con dietas específicas para aumentar masa muscular magra o definir. Versátil y Combinable: Al ser sin sabor, se puede mezclar fácilmente con batidos de proteínas (como Gold Standard 100% Whey), jugos u otras bebidas sin alterar su sabor.",
            "price": 89.00,
            "images": "http://127.0.0.1:8000/assets/productos/156728-1600-auto.webp,http://127.0.0.1:8000/assets/productos/156729-1600-auto.webp",
            "category": "Monohidrato"
        }
    ]
    
    for creatina in creatinas:
        conn.execute(text("""
            INSERT INTO creatinas (title, description, price, images, category)
            VALUES (:title, :description, :price, :images, :category)
        """), creatina)
    
    conn.commit()
    print(f"✓ ¡{len(creatinas)} creatina creada exitosamente!")

# ===== CREAR PREENTRENOS DE EJEMPLO =====
result = conn.execute(text("SELECT COUNT(*) FROM preentrenos"))
count_preentrenos = result.scalar()

if count_preentrenos > 0:
    print(f"✓ Ya hay {count_preentrenos} preentrenos en la base de datos")
else:
    print("\nCreando preentrenos de ejemplo...")
    
    preentrenos = [
        {
            "title": "C4 Original Pre-Workout",
            "description": "C4 Original de Cellucor es el pre-entreno número 1 en ventas en Estados Unidos, diseñado para energía explosiva, resistencia muscular y bombeo. Contiene 1.6g de Beta-Alanina CarnoSyn para retardar la fatiga, 1g de Nitrato de Creatina (NO3-T) para fuerza y bombeo, 150mg de Cafeína Anhidra para energía y enfoque, y 1g de Arginina AKG. Ideal para principiantes y avanzados. Sabores deliciosos como Icy Blue Razz y Fruit Punch. Sin azúcar.",
            "price": 110.00,
            "images": "http://127.0.0.1:8000/assets/productos/c4-original.webp",
            "category": "Pre-Entreno"
        },
        {
            "title": "Psychotic Gold",
            "description": "Psychotic Gold de Insane Labz es un pre-entreno de alta estimulación para energía extrema, enfoque mental láser y resistencia. Formulado con Beta-Alanina, Citrulina Malato, Agmatina Sulfato y una mezcla potente de cafeína (incluyendo Infinergy y Cafeína Anhidra). Diseñado para entrenamientos intensos. No apto para principiantes. Proporciona energía sostenida sin el 'bajón' posterior.",
            "price": 130.00,
            "images": "http://127.0.0.1:8000/assets/productos/psychotic-gold.webp",
            "category": "Pre-Entreno Extremo"
        },
        {
            "title": "Total War",
            "description": "Total War de Redcon1 es un pre-entreno completo que combina estimulantes para energía y enfoque con ingredientes para bombeo muscular (pump). Contiene 6g de Citrulina Malato, 3.2g de Beta-Alanina, 1g de Agmatina Sulfato y 250mg de Cafeína Anhidra más 100mg de Di-Cafeína Malato. Ofrece energía intensa, vascularización y resistencia. Transparencia total en la etiqueta (sin mezclas patentadas).",
            "price": 145.00,
            "images": "http://127.0.0.1:8000/assets/productos/total-war.webp",
            "category": "Pre-Entreno Completo"
        }
    ]
    
    for preentreno in preentrenos:
        conn.execute(text("""
            INSERT INTO preentrenos (title, description, price, images, category)
            VALUES (:title, :description, :price, :images, :category)
        """), preentreno)
    
    conn.commit()
    print(f"✓ ¡{len(preentrenos)} preentrenos creados exitosamente!")

# ===== CREAR USUARIO DE PRUEBA =====
result = conn.execute(text("SELECT COUNT(*) FROM usuarios"))
count_usuarios = result.scalar()

if count_usuarios > 0:
    print(f"✓ Ya hay {count_usuarios} usuarios en la base de datos")
else:
    print("\nCreando usuarios de prueba...")
    
    # Usuario normal
    conn.execute(
        text("INSERT INTO usuarios (nombre, email, password, role) VALUES (:nombre, :email, :password, :role)"),
        {"nombre": "Usuario Prueba", "email": "test@test.com", "password": pwd_context.hash("1234"), "role": "user"}
    )
    
    # Usuario admin
    conn.execute(
        text("INSERT INTO usuarios (nombre, email, password, role) VALUES (:nombre, :email, :password, :role)"),
        {"nombre": "Administrador", "email": "admin@test.com", "password": pwd_context.hash("admin"), "role": "admin"}
    )
    
    conn.commit()
    print("✓ Usuarios creados:")
    print("  1. User: test@test.com / 1234")
    print("  2. Admin: admin@test.com / admin")

conn.close()
print("\n✅ Base de datos inicializada correctamente")
