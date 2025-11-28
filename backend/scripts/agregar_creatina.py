# MOVIDO desde backend/backend/agregar_creatina.py
from backend.database import get_db, inicializar_db

def agregar_creatina_si_no_existe():
    inicializar_db()
    conn = get_db()
    cursor = conn.cursor()

    titulo = "CREATINA 300G - OPTIMUM NUTRITION"
    cursor.execute("SELECT id FROM creatinas WHERE title = ?", (titulo,))
    existente = cursor.fetchone()
    if existente:
        print(f"✓ La creatina '{titulo}' ya existe (id={existente['id']})")
        conn.close()
        return

    descripcion = (
        "La Creatina 100% 300 G de Optimum Nutrition es un suplemento popular de monohidrato de creatina micronizada pura, diseñado para apoyar el aumento de fuerza, potencia y rendimiento muscular durante ejercicios de alta intensidad. Es un polvo sin sabor que se mezcla fácilmente. \n"
        "Características y Beneficios Principales\n"
        "Monohidrato de Creatina Pura: Contiene 100% monohidrato de creatina de alta calidad, un ingrediente ampliamente estudiado y de eficacia probada en la nutrición deportiva.\n"
        "Micronización para Mejor Absorción: El polvo es micronizado, lo que significa que las partículas son más finas, facilitando su disolución rápida en líquidos y minimizando las molestias gastrointestinales que a veces se asocian con la creatina convencional.\n"
        "Aumento del Rendimiento: Ayuda a regenerar el ATP (trifosfato de adenosina), la principal fuente de energía muscular para movimientos explosivos y series de ejercicio intensas, permitiendo entrenamientos más duros y duraderos.\n"
        "Apoyo al Crecimiento Muscular: El uso diario y constante, combinado con ejercicio de resistencia, apoya el crecimiento de la masa muscular y mejora el volumen celular.\n"
        "Perfil Nutricional Limpio: Es libre de azúcar, grasas y aditivos, aportando solo creatina pura, lo que la hace compatible con dietas específicas.\n"
        "Versatilidad: Al ser sin sabor, se puede añadir a batidos de proteínas, jugos u otras bebidas sin alterar su gusto. \n"
        "Uso Sugerido\n"
        "Dosis: Una porción típica es de 5 gramos (una cucharadita redondeada). El envase de 300 g rinde aproximadamente 60 servicios.\n"
        "Instrucciones: Mezclar la porción con un vaso de agua, jugo o batido de proteínas y revolver hasta que el polvo se disuelva completamente.\n"
        "Momento de Consumo: La consistencia diaria es clave. Se puede consumir antes o después del entrenamiento, o en cualquier momento del día, incluso en días de descanso, para mantener elevados los niveles de creatina muscular. Se recomienda beber al menos ocho vasos de agua al día mientras se usa creatina."
    )

    precio = 95.00
    imagenes = (
        "http://127.0.0.1:8000/assets/productos/155853-1600-auto.webp,"
        "http://127.0.0.1:8000/assets/productos/157673-1600-auto.webp"
    )
    categoria = "Monohidrato"

    cursor.execute(
        "INSERT INTO creatinas (title, description, price, images, category) VALUES (?, ?, ?, ?, ?)",
        (titulo, descripcion, precio, imagenes, categoria)
    )
    conn.commit()
    nuevo_id = cursor.lastrowid
    conn.close()
    print(f"✓ Creatina agregada correctamente (id={nuevo_id})")

if __name__ == "__main__":
    agregar_creatina_si_no_existe()
