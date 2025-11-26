import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function PreentrenoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preentreno, setPreentreno] = useState(null);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    const obtenerPreentreno = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/preentrenos"
        );
        const data = await response.json();
        const preentrenoEncontrado = data.find((p) => p.id === parseInt(id));
        setPreentreno(preentrenoEncontrado);
      } catch (error) {
        console.error("Error al obtener pre-entreno:", error);
        toast.error("Error al cargar el producto");
      }
    };
    obtenerPreentreno();
  }, [id]);

  const siguienteImagen = () => {
    if (preentreno && preentreno.images) {
      setImagenActual((prev) => (prev + 1) % preentreno.images.length);
    }
  };

  const imagenAnterior = () => {
    if (preentreno && preentreno.images) {
      setImagenActual(
        (prev) =>
          (prev - 1 + preentreno.images.length) % preentreno.images.length
      );
    }
  };

  const agregarAlCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existe = carrito.find(
      (item) => item.id === preentreno.id && item.tipo === "preentreno"
    );

    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...preentreno, cantidad: 1, tipo: "preentreno" });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    toast.success("¡Agregado al carrito!");
  };

  if (!preentreno) {
    return <div className="px-10 py-20">Cargando...</div>;
  }

  return (
    <div className="px-10 py-20">
      <button
        onClick={() => navigate("/productos")}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Productos
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Galería de imágenes */}
        <div className="lg:w-1/2">
          <div
            className="relative bg-base-200 rounded-lg overflow-hidden mb-4"
            style={{ height: "500px" }}
          >
            <img
              src={preentreno.images[imagenActual]}
              alt={preentreno.title}
              className="w-full h-full object-contain"
            />

            {preentreno.images.length > 1 && (
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
          {preentreno.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {preentreno.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${preentreno.title} ${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    idx === imagenActual
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setImagenActual(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="lg:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{preentreno.title}</h1>
          <p className="text-4xl font-bold text-primary mb-6">
            S/{preentreno.price}
          </p>

          <button onClick={agregarAlCarrito} className="btn btn-primary mb-8">
            Agregar al Carrito
          </button>

          <div className="divider"></div>

          <div
            className="overflow-y-auto flex-1 pr-4 space-y-6"
            style={{ maxHeight: "500px" }}
          >
            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Descripción del Producto
              </h2>
              <p className="text-lg leading-relaxed">
                {preentreno.description}
              </p>
            </div>

            <div className="divider"></div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Composición y Beneficios
              </h2>
              <ul className="space-y-3 text-lg">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong>Energía y Concentración:</strong> Contiene
                    ingredientes que potencian la energía mental y física para
                    entrenamientos intensos.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong>Rendimiento Mejorado:</strong> Ayuda a maximizar la
                    fuerza y resistencia durante el ejercicio de alta
                    intensidad.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong>Vasodilatación:</strong> Mejora el flujo sanguíneo
                    hacia los músculos, favoreciendo la entrega de nutrientes.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong>Recuperación Muscular:</strong> Componentes que
                    ayudan a reducir la fatiga y acelerar la recuperación
                    post-entrenamiento.
                  </span>
                </li>
              </ul>
            </div>

            <div className="divider"></div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Uso Recomendado
              </h2>
              <ul className="space-y-3 text-lg">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong>Dosis recomendada:</strong> Una porción (según
                    indicaciones del envase) mezclada con agua fría.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong>Momento de consumo:</strong> Tomar 20-30 minutos
                    antes del entrenamiento para obtener máximos beneficios.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong>Importante:</strong> No exceder la dosis
                    recomendada. Evitar consumir cerca de la hora de dormir
                    debido al contenido de estimulantes.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong>Hidratación:</strong> Mantener una ingesta adecuada
                    de agua durante el entrenamiento al usar pre-entrenos.
                  </span>
                </li>
              </ul>
            </div>

            <div className="divider"></div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-3">
                Opciones de Compra
              </h2>
              <p className="text-lg leading-relaxed">
                Disponible en diversos sabores para adaptarse a tus
                preferencias. Presentación en polvo de fácil disolución para
                preparación rápida antes del entrenamiento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
