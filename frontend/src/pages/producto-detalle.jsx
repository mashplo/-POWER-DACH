import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [imagenActual, setImagenActual] = useState(0);
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/products");
        const productos = await response.json();
        const productoEncontrado = productos.find(p => p.id === parseInt(id));
        setProducto(productoEncontrado);
      } catch (error) {
        console.error("Error al cargar producto:", error);
        toast.error("Error al cargar el producto");
      }
    };
    fetchProducto();
  }, [id]);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = () => {
    setCarrito((prevCarrito) => [...prevCarrito, producto.id]);
    toast.success(`${producto.title} agregado al carrito`);
  };

  const siguienteImagen = () => {
    if (producto && producto.images) {
      setImagenActual((prev) => (prev + 1) % producto.images.length);
    }
  };

  const imagenAnterior = () => {
    if (producto && producto.images) {
      setImagenActual((prev) => (prev - 1 + producto.images.length) % producto.images.length);
    }
  };

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="px-10 py-20 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate("/proteina")}
        className="btn btn-ghost gap-2 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a productos
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Carrusel de imágenes */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <img 
              src={producto.images[imagenActual]} 
              alt={producto.title}
              className="w-full h-[500px] object-contain rounded-lg shadow-lg bg-white"
            />
            {producto.images.length > 1 && (
              <>
                <button 
                  onClick={imagenAnterior}
                  className="btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-none"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={siguienteImagen}
                  className="btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 border-none"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          
          {/* Miniaturas */}
          {producto.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {producto.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setImagenActual(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    imagenActual === index ? 'border-primary' : 'border-gray-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${producto.title} ${index + 1}`}
                    className="w-full h-full object-contain bg-white"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto con scroll */}
        <div className="flex flex-col gap-4 h-[600px]">
          <div className="sticky top-0 bg-base-100 z-10 pb-4">
            <span className="badge badge-primary mb-2">{producto.category}</span>
            <h1 className="text-4xl font-bold mb-4">{producto.title}</h1>
            <p className="text-3xl font-bold text-primary mb-4">S/{producto.price}</p>
            <button 
              onClick={agregarAlCarrito}
              className="btn btn-primary btn-lg w-full"
            >
              Agregar al carrito
            </button>
          </div>

          <div className="divider"></div>

          {/* Descripción con scroll */}
          <div className="overflow-y-auto flex-1 pr-4 space-y-6">
            {producto.id === 1 ? (
              // Descripción para Whey Protein Gold Standard
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Descripción del Producto</h2>
                  <p className="text-lg leading-relaxed">
                    Optimum Nutrition Gold Standard 100% Whey Protein es un suplemento de proteína en polvo 
                    reconocido mundialmente por su calidad y eficacia para el crecimiento y recuperación muscular. 
                    Contiene una mezcla de aislado, concentrado y péptidos de proteína de suero de leche para una 
                    absorción rápida.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Especificaciones y Beneficios Clave</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    Cada porción del producto ofrece un perfil nutricional diseñado para apoyar a atletas y 
                    entusiastas del fitness.
                  </p>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Alto contenido proteico:</strong> Aproximadamente 24 gramos de proteína de suero de alta calidad por porción, siendo el aislado de proteína de suero el ingrediente principal.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Aminoácidos esenciales:</strong> Contiene más de 5.5 gramos de BCAA (aminoácidos de cadena ramificada) naturales y 4 gramos de glutamina por porción, cruciales para la síntesis de proteínas y la recuperación muscular.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Bajo en macronutrientes no deseados:</strong> Cada porción suele tener alrededor de 120 calorías, con un bajo contenido de grasa (aprox. 1.5g) y carbohidratos (aprox. 3g).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Fácil de mezclar:</strong> El polvo está "instantaneizado" para disolverse fácilmente con solo una cuchara y un vaso, sin dejar grumos.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Certificación de calidad:</strong> El producto cuenta con la certificación Informed-Choice, lo que garantiza que se prueba regularmente para detectar sustancias prohibidas, ofreciendo confianza a los atletas profesionales.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Versatilidad:</strong> Se puede consumir a primera hora de la mañana, antes o después del ejercicio, o entre comidas para complementar la ingesta diaria de proteínas.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Opiniones de Usuarios</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    Las reseñas de los consumidores son mayoritariamente positivas, elogiando su sabor y eficacia.
                  </p>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Sabor:</strong> Viene en una amplia gama de sabores (más de 20 opciones, incluyendo Double Rich Chocolate, Vanilla Ice Cream y Cookies & Cream) que son generalmente bien recibidos por su sabor agradable y no artificial.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Calidad y resultados:</strong> Los usuarios a menudo reportan buenos resultados en el aumento de masa muscular y la recuperación, y muchos lo consideran la mejor proteína del mercado por su calidad y consistencia.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Mezclabilidad:</strong> La facilidad con la que se mezcla, sin grumos, es un punto fuerte frecuentemente mencionado por los usuarios.</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : producto.id === 2 ? (
              // Descripción para Protein Iso Whey 90
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Descripción del Producto</h2>
                  <p className="text-lg leading-relaxed">
                    La Proteína Universe Nutrition UN Iso Whey 90 es un suplemento a base de aislado de suero de leche 
                    de alta pureza, diseñado para favorecer la ganancia de masa muscular magra, acelerar la recuperación 
                    y apoyar dietas bajas en carbohidratos.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Características Principales</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Tipo de Proteína:</strong> Aislado de suero de leche (Whey Protein Isolate).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Pureza:</strong> Ofrece un alto contenido de proteína, cerca del 90% de pureza.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Presentación:</strong> El envase de 5 kg (aprox. 167 servicios) es una opción económica y duradera para usuarios regulares.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Bajo en Lactosa y Grasa:</strong> El proceso de aislado elimina la mayoría de las grasas, carbohidratos y lactosa, haciéndola una opción ideal para personas con sensibilidad digestiva o que buscan una definición muscular estricta.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Objetivo:</strong> Ideal para el desarrollo de masa muscular magra, la recuperación muscular post-entrenamiento y dietas de control de peso.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Información Nutricional (por servicio)</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    Si bien los valores exactos pueden variar ligeramente según el sabor, un servicio típico (generalmente 30g) contiene aproximadamente:
                  </p>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Proteína:</strong> 24 gramos</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Grasa:</strong> Muy bajo contenido (cercano a cero)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Carbohidratos/Lactosa:</strong> Muy bajo contenido (cercano a cero)</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Beneficios Clave</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Promueve la recuperación muscular:</strong> Aporta los aminoácidos necesarios para reparar los tejidos musculares después de un ejercicio intenso.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Apoya la síntesis proteica:</strong> Su alto valor biológico estimula eficazmente la creación de nueva proteína muscular.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Versatilidad de uso:</strong> Puede tomarse a primera hora de la mañana, entre comidas, o inmediatamente después del entrenamiento para un aporte rápido de proteína.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Facilidad de mezcla:</strong> Está diseñada para disolverse fácilmente en agua o leche, sin necesidad de licuadora.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Modo de Uso</h2>
                  <p className="text-lg leading-relaxed">
                    Mezclar un servicio (medida incluida) de UN Iso Whey 90 en 200 a 300 ml de agua fría o su bebida 
                    favorita en un shaker. Se recomienda consumir de una a dos veces al día, dependiendo de sus 
                    requerimientos proteicos y objetivos físicos.
                  </p>
                </div>
              </>
            ) : producto.id === 3 ? (
              // Descripción para Mutant Mass
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Descripción del Producto</h2>
                  <p className="text-lg leading-relaxed">
                    La Proteína Universe Nutrition UN Iso Whey 90 es un suplemento a base de aislado de suero de leche 
                    de alta pureza, diseñado para favorecer la ganancia de masa muscular magra, acelerar la recuperación 
                    y apoyar dietas bajas en carbohidratos.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Características Principales</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Tipo de Proteína:</strong> Aislado de suero de leche (Whey Protein Isolate).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Pureza:</strong> Ofrece un alto contenido de proteína, cerca del 90% de pureza.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Presentación:</strong> El envase de 5 kg (aprox. 167 servicios) es una opción económica y duradera para usuarios regulares.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Bajo en Lactosa y Grasa:</strong> El proceso de aislado elimina la mayoría de las grasas, carbohidratos y lactosa, haciéndola una opción ideal para personas con sensibilidad digestiva o que buscan una definición muscular estricta.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Objetivo:</strong> Ideal para el desarrollo de masa muscular magra, la recuperación muscular post-entrenamiento y dietas de control de peso.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Información Nutricional (por servicio)</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    Si bien los valores exactos pueden variar ligeramente según el sabor, un servicio típico (generalmente 30 g) contiene aproximadamente:
                  </p>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Proteína:</strong> 24 gramos</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Grasa:</strong> Muy bajo contenido (cercano a cero)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Carbohidratos/Lactosa:</strong> Muy bajo contenido (cercano a cero)</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Beneficios Clave</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Promueve la recuperación muscular:</strong> Aporta los aminoácidos necesarios para reparar los tejidos musculares después de un ejercicio intenso.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Apoya la síntesis proteica:</strong> Su alto valor biológico estimula eficazmente la creación de nueva proteína muscular.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Versatilidad de uso:</strong> Puede tomarse a primera hora de la mañana, entre comidas, o inmediatamente después del entrenamiento para un aporte rápido de proteína.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Facilidad de mezcla:</strong> Está diseñada para disolverse fácilmente en agua o leche, sin necesidad de licuadora.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Modo de Uso</h2>
                  <p className="text-lg leading-relaxed">
                    Mezclar un servicio (medida incluida) de UN Iso Whey 90 en 200 a 300 ml de agua fría o su bebida 
                    favorita en un shaker. Se recomienda consumir de una a dos veces al día, dependiendo de sus 
                    requerimientos proteicos y objetivos físicos.
                  </p>
                </div>
              </>
            ) : producto.id === 4 ? (
              // Descripción para Big M 5 Kg
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Descripción del Producto</h2>
                  <p className="text-lg leading-relaxed">
                    BIGM de Universe Nutrition en presentación de 5 kg es un suplemento tipo ganador de peso (mass gainer),
                    diseñado para personas que buscan aumentar su masa muscular y peso corporal mediante un mayor aporte de
                    calorías de calidad, proteínas y carbohidratos complejos para energía sostenida.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Características Principales</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Objetivo:</strong> Ganancia de peso y volumen muscular (etapa de volumen).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Presentación:</strong> Bolsa de 5 kg (aprox. 48 servicios según tamaño del scoop).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Perfil Nutricional:</strong> Múltiples fuentes de proteína y carbohidratos complejos para energía prolongada.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Ingredientes Clave:</strong> Suero de leche, albúmina de huevo y aislado de soya, fortificado con BCAA, L-glutamina y creatina.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Información Nutricional Aproximada</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    Un servicio típico (3 scoops ~105 g) aporta:
                  </p>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Calorías:</strong> ~412 kcal</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Proteínas:</strong> ~34 g (verificar etiqueta específica)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Carbohidratos:</strong> Alto contenido para energía y recuperación</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Grasas:</strong> Bajo contenido</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Beneficios</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Recuperación Post-entrenamiento:</strong> Aporta nutrientes esenciales para reparar tejidos musculares.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Balance Calórico Positivo:</strong> Facilita cubrir requerimientos diarios para aumentar masa.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Desarrollo Muscular:</strong> Combinación de proteínas y aminoácidos que apoyan la síntesis proteica.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Versatilidad:</strong> Útil para hombres y mujeres con metabolismo acelerado o alto rendimiento.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Modo de Uso Sugerido</h2>
                  <p className="text-lg leading-relaxed">
                    Mezclar un servicio (3 scoops) en 400 ml de agua fría o leche en un shaker. Consumir a media mañana,
                    a media tarde o 30–40 minutos después del entrenamiento para maximizar recuperación y aporte calórico.
                  </p>
                </div>
              </>
            ) : producto.id === 5 ? (
              // Descripción para Gold Standard Isolate
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Descripción del Producto</h2>
                  <p className="text-lg leading-relaxed">
                    La proteína Optimum Nutrition Gold Standard 100% Isolate es un suplemento de proteína de suero de ultra alta pureza,
                    diseñado para un crecimiento y recuperación muscular rápidos y eficientes con un mínimo de grasa y carbohidratos.
                    Es una opción ideal para atletas y personas que buscan una fuente de proteína magra y de rápida absorción.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Características Principales</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Pureza Excepcional:</strong> Proteína sometida a procesos avanzados de microfiltración y ultrafiltración para eliminar grasa, colesterol, azúcares y otras impurezas, preservando los nutrientes esenciales.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Alto Contenido Proteico:</strong> 25 gramos de proteína de suero hidrolizado y aislado por porción, con más del 80% de proteína pura.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Perfil Nutricional Magro:</strong> Menos de 1 gramo de grasa y menos de 1 gramo de azúcar por porción, ideal para dietas estrictas o fases de definición muscular.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Rápida Absorción:</strong> Proteína hidrolizada que asegura absorción rápida para acelerar la reparación y reconstrucción de fibras musculares después del ejercicio intenso.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Aminoácidos Clave:</strong> Rica en más de 5.5 gramos de BCAA naturales por porción, fundamentales para la síntesis de proteínas musculares y la recuperación.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Libre de Lactosa y Gluten:</strong> Su proceso de purificación la hace apta para personas con sensibilidad a la lactosa o al gluten.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Certificada como Libre de Sustancias Prohibidas:</strong> Cuenta con la certificación Informed-Choice, garantizando que cada lote ha sido analizado y está libre de sustancias prohibidas.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Uso Sugerido</h2>
                  <p className="text-lg leading-relaxed">
                    Se recomienda mezclar aproximadamente una cucharada medidora (31 g) de polvo de Gold Standard 100% Isolate
                    con 6-8 oz líq. (aproximadamente 180-240 ml) de agua, leche u otra bebida fría. Simplemente revuelve, agita
                    o mezcla durante unos 30 segundos hasta que se disuelva completamente. Se puede consumir a primera hora de
                    la mañana, antes o después del ejercicio, o entre comidas para un impulso proteico.
                  </p>
                </div>
              </>
            ) : producto.id === 6 ? (
              // Descripción para Gold Standard Plant
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Descripción del Producto</h2>
                  <p className="text-lg leading-relaxed">
                    La Optimum Nutrition Gold Standard 100% Plant es un suplemento de proteína vegana y sin gluten diseñado
                    para adultos activos que buscan una fuente de proteína de alta calidad y origen vegetal para apoyar la
                    recuperación y el crecimiento muscular.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Características Principales</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Alto Contenido Proteico:</strong> Cada porción contiene 24 gramos de proteína de origen vegetal de alta calidad.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Perfil Completo de Aminoácidos:</strong> Combina proteínas de guisante (pea), arroz integral (brown rice) y haba (fava bean) para proporcionar un perfil completo de los 9 aminoácidos esenciales (EAAs), incluyendo más de 5.5 gramos de BCAA naturales por porción.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Ingredientes de Calidad:</strong> Fórmula orgánica certificada por el USDA y no modificada genéticamente (Non-GMO), libre de colorantes, saborizantes y edulcorantes artificiales.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Bajo en Azúcar y Grasa:</strong> Contiene 0g de azúcar y un mínimo de grasa por porción, haciéndola una opción magra y saludable.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Enriquecida con Vitaminas y Superalimentos:</strong> Incluye un complejo de granos antiguos sin gluten como amaranto, quinua, trigo sarraceno, mijo y chía, así como polvo de granada orgánica y vitaminas C y B12 añadidas.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Fácil de Mezclar:</strong> Diseñada para mezclarse fácilmente con agua o leche de almendras, sin dejar textura arenosa o calcárea.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Uso Sugerido y Beneficios</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    Se puede consumir en cualquier momento del día para aumentar la ingesta de proteínas, pero es especialmente
                    útil como batido post-entrenamiento (entre 30 y 60 minutos después de ejercitarse) para ayudar en la
                    reparación y el crecimiento muscular.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Es una excelente alternativa para personas con sensibilidad a la lactosa o que siguen dietas veganas o vegetarianas.
                  </p>
                </div>
              </>
            ) : producto.id === 7 ? (
              // Descripción para Nutrex Research Isofit
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Descripción del Producto</h2>
                  <p className="text-lg leading-relaxed">
                    Nutrex Research Isofit es una proteína de suero aislada de alta pureza, diseñada para una absorción
                    ultrarrápida, lo que la convierte en una opción eficaz para la recuperación muscular y el crecimiento de
                    masa magra. Es conocida por ser baja en grasas y carbohidratos, y por su sabor premium.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Detalles y Beneficios del Producto</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Pureza y Absorción Rápida:</strong> Isofit utiliza proteína de suero aislada obtenida mediante microfiltración de flujo cruzado, garantizando una pureza excepcional y una digestión y absorción muy rápidas. Los nutrientes vitales llegan a los músculos de manera eficiente inmediatamente después del entrenamiento.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Perfil Nutricional:</strong> Cada porción contiene 25 gramos de proteína pura, menos de 1 gramo de grasa y 1 gramo de carbohidratos. Ideal para aumentar masa muscular magra o controlar peso sin calorías adicionales.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Aminoácidos Esenciales:</strong> Cargada con 12 gramos de aminoácidos esenciales (EAAs) y casi 6 gramos de aminoácidos de cadena ramificada (BCAAs) por porción, cruciales para iniciar la síntesis de proteínas musculares y acelerar la recuperación.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Fácil Digestión:</strong> Libre de lactosa y gluten, excelente para personas con sensibilidades digestivas o intolerancia, evitando la hinchazón o malestar.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Sabor Gourmet:</strong> A diferencia de otras proteínas aisladas, Isofit tiene un sabor cremoso y delicioso en sabores gourmet como Double Chocolate y Vanilla Bean Ice Cream. Contiene polvo de aceite MCT y fibra de inulina orgánica para una textura suave y mejor sabor.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Uso Sugerido</h2>
                  <p className="text-lg leading-relaxed">
                    Para obtener mejores resultados, mezclar una cucharada de Nutrex Research Isofit con aproximadamente
                    5 a 6 onzas de agua fría inmediatamente después del entrenamiento. También se puede tomar en cualquier
                    momento del día como un batido rico en proteínas entre comidas para apoyar la recuperación y el
                    crecimiento muscular magro.
                  </p>
                </div>
              </>
            ) : producto.id === 8 ? (
              // Descripción para OWYN Plant-Based Protein
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Descripción del Producto</h2>
                  <p className="text-lg leading-relaxed">
                    OWYN (Only What You Need) Plant-Based Protein ofrece batidos listos para beber y polvos que proporcionan
                    una nutrición limpia y completa, enfocándose en ser aptos para personas con alergias y dietas veganas.
                    Estos productos combinan proteínas de origen vegetal con ingredientes como verduras y omega-3, evitando
                    alérgenos comunes e ingredientes artificiales.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Características Principales</h2>
                  <ul className="space-y-3 text-lg">
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Proteína de Origen Vegetal:</strong> Mezcla de proteínas de guisante, semilla de calabaza orgánica y linaza orgánica para ofrecer un perfil completo de los 9 aminoácidos esenciales.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Contenido Nutricional:</strong> Los batidos estándar contienen 20 gramos de proteína, mientras que la línea "Pro Elite" ofrece hasta 35 gramos por batido. Todos los productos son bajos en azúcar (0g en polvos, bajo en batidos RTD) y grasas.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Libre de Alérgenos Mayores:</strong> Todos los productos OWYN son rigurosamente probados por terceros para garantizar que estén libres de los 8 alérgenos principales: lácteos, soja, gluten/trigo, huevo, cacahuete, frutos secos, pescado y mariscos.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Ingredientes Adicionales Saludables:</strong> Cada porción incluye una mezcla de superalimentos verdes (col rizada, espinaca, brócoli) y un mínimo de 500mg de ácidos grasos omega-3 de origen vegetal, conocidos por sus propiedades antiinflamatorias.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Sin Ingredientes Artificiales:</strong> La marca se compromete a utilizar sabores naturales y extracto de fruta monje como edulcorante, evitando alcoholes de azúcar, sabores artificiales, colorantes o conservantes.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span><strong>Textura y Sabor:</strong> Los usuarios encuentran que los productos OWYN tienen un sabor agradable y una textura suave y cremosa, evitando el regusto calcáreo o arenoso común en otras proteínas vegetales.</span>
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold mb-3 text-primary">Uso Sugerido</h2>
                  <p className="text-lg leading-relaxed">
                    Los batidos listos para beber son convenientes para llevar, mientras que el polvo se puede mezclar en
                    casa con agua, leche vegetal, o añadir a batidos y recetas. Son ideales para un impulso de proteínas
                    en cualquier momento del día, especialmente después de un entrenamiento intenso para favorecer la
                    recuperación muscular.
                  </p>
                </div>
              </>
            ) : (
              // Descripción genérica para otros productos
              <div>
                <h2 className="text-2xl font-bold mb-3 text-primary">Descripción</h2>
                <p className="text-lg leading-relaxed">{producto.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
