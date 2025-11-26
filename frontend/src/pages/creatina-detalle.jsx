import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function CreatinaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creatina, setCreatina] = useState(null);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    const obtenerCreatina = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/creatinas");
        const data = await response.json();
        const creatinaEncontrada = data.find(p => p.id === parseInt(id));
        setCreatina(creatinaEncontrada);
      } catch (error) {
        console.error("Error al obtener creatina:", error);
        toast.error("Error al cargar el producto");
      }
    };
    obtenerCreatina();
  }, [id]);

  const siguienteImagen = () => {
    if (creatina && creatina.images) {
      setImagenActual((prev) => (prev + 1) % creatina.images.length);
    }
  };

  const imagenAnterior = () => {
    if (creatina && creatina.images) {
      setImagenActual((prev) => (prev - 1 + creatina.images.length) % creatina.images.length);
    }
  };

  const agregarAlCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existe = carrito.find(item => item.id === creatina.id && item.tipo === "creatina");
    
    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...creatina, cantidad: 1, tipo: "creatina" });
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    toast.success("¡Agregado al carrito!");
  };

  if (!creatina) {
    return <div className="px-10 py-20">Cargando...</div>;
  }

  return (
    <div className="px-10 py-20">
      <button onClick={() => navigate("/creatina")} className="btn btn-ghost mb-6">
        <ArrowLeft size={20} />
        Volver a Creatinas
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Galería de imágenes */}
        <div className="lg:w-1/2">
          <div className="relative bg-base-200 rounded-lg overflow-hidden mb-4" style={{ height: "500px" }}>
            <img
              src={creatina.images[imagenActual]}
              alt={creatina.title}
              className="w-full h-full object-contain"
            />
            
            {creatina.images.length > 1 && (
              <>
                <button
                  onClick={imagenAnterior}
                  className="btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2 bg-base-100/80 hover:bg-base-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={siguienteImagen}
                  className="btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 bg-base-100/80 hover:bg-base-100"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {creatina.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {creatina.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${creatina.title} ${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    idx === imagenActual ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setImagenActual(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="lg:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{creatina.title}</h1>
          <p className="text-4xl font-bold text-primary mb-6">S/{creatina.price}</p>
          
          <button onClick={agregarAlCarrito} className="btn btn-primary mb-8">
            Agregar al Carrito
          </button>

          <div className="overflow-y-auto flex-1 pr-4 space-y-6 h-[600px]">
            {creatina.id === 1 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">Descripción del Producto</h2>
                  <p className="text-lg leading-relaxed">
                    La Creatina 100% 1200 G de Optimum Nutrition es un suplemento de monohidrato de creatina micronizada pura diseñado para mejorar la fuerza, la potencia y el rendimiento muscular en entrenamientos de moderada a alta intensidad. Es un polvo sin sabor, lo que facilita su mezcla con agua o cualquier otra bebida.
                  </p>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">Características y Beneficios Principales</h2>
                  <ul className="space-y-3 text-lg">
                    <li>
                      <span className="font-bold text-primary">• Monohidrato de Creatina Pura:</span> Contiene 100% monohidrato de creatina de alta calidad, uno de los ingredientes más estudiados y efectivos en la nutrición deportiva.
                    </li>
                    <li>
                      <span className="font-bold text-primary">• Micronizada para una Mejor Absorción:</span> El proceso de micronización reduce el tamaño de las partículas del polvo, lo que mejora significativamente su solubilidad y absorción en el organismo, optimizando los resultados y reduciendo posibles molestias gastrointestinales.
                    </li>
                    <li>
                      <span className="font-bold text-primary">• Aumento de Fuerza y Rendimiento:</span> Favorece la regeneración de ATP (trifosfato de adenosina), la fuente de energía del organismo para los músculos, lo que permite realizar movimientos explosivos y series de ejercicio más intensas y duraderas.
                    </li>
                    <li>
                      <span className="font-bold text-primary">• Promueve el Crecimiento Muscular:</span> Ayuda en la ganancia de masa muscular y mejora el volumen celular (hidratación celular), lo cual, combinado con entrenamiento de resistencia regular, apoya el crecimiento magro.
                    </li>
                    <li>
                      <span className="font-bold text-primary">• Perfil Nutricional Limpio:</span> No aporta calorías, carbohidratos, grasas ni azúcares, lo que la hace compatible con dietas específicas para aumentar masa muscular magra o definir.
                    </li>
                    <li>
                      <span className="font-bold text-primary">• Versátil y Combinable:</span> Al ser sin sabor, se puede mezclar fácilmente con batidos de proteínas (como Gold Standard 100% Whey), jugos u otras bebidas sin alterar su sabor.
                    </li>
                  </ul>
                </div>

                <div className="divider"></div>

                <div>
                  <h2 className="text-2xl font-bold text-primary mb-3">Uso Sugerido</h2>
                  <ul className="space-y-3 text-lg">
                    <li>
                      <span className="font-bold text-primary">• Dosis recomendada:</span> 5 gramos diarios (equivalente a una cucharadita pequeña).
                    </li>
                    <li>
                      <span className="font-bold text-primary">• Modo de empleo:</span> Mezclar una porción con 240 ml de agua o tu bebida preferida. Se disuelve fácilmente.
                    </li>
                    <li>
                      <span className="font-bold text-primary">• Cuándo tomarla:</span> Se puede tomar en cualquier momento del día, siendo común consumirla después del entrenamiento o por la mañana los días de descanso. La constancia diaria es más importante que el momento exacto de la toma.
                    </li>
                    <li>
                      <span className="font-bold text-primary">• Fase de Carga (Opcional):</span> Algunos atletas optan por una fase de carga durante los primeros 5-7 días, consumiendo 20 gramos al día (divididos en 4 tomas de 5g), para saturar los músculos más rápidamente, aunque no es un paso obligatorio.
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-primary mb-3">Descripción</h2>
                <p className="text-lg leading-relaxed">{creatina.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
