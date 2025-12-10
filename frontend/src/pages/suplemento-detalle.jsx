import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, normalizeImageUrl } from "../herramientas/config";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { addItemCarrito } from "../herramientas/carrito";

export default function SuplementoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suplemento, setSuplemento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerSuplemento = async () => {
      try {
        setLoading(true);
        if (!API_BASE_URL) {
          setError("API no configurada");
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/productos/${id}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setSuplemento(data);
      } catch (error) {
        console.error("Error al obtener suplemento:", error);
        setError(error.message);
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    obtenerSuplemento();
  }, [id]);

  const agregarAlCarrito = () => {
    addItemCarrito({
      id: suplemento.id,
      title: suplemento.nombre,
      price: suplemento.precio,
      image: normalizeImageUrl(suplemento.imagen_url),
      tipo: "suplemento",
    });
    toast.success(`${suplemento.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !suplemento) {
    return (
      <div className="px-10 py-20 text-center">
        <p className="text-xl text-error mb-4">{error || "Producto no encontrado"}</p>
        <button onClick={() => navigate("/suplementos")} className="btn btn-primary">
          Volver a Suplementos
        </button>
      </div>
    );
  }

  return (
    <div className="px-10 py-20 max-w-6xl mx-auto">
      <button
        onClick={() => navigate("/productos")}
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Productos
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Imagen del producto */}
        <div className="lg:w-1/2">
          <div className="bg-base-200 rounded-lg overflow-hidden">
            <img
              src={normalizeImageUrl(suplemento.imagen_url)}
              alt={suplemento.nombre}
              className="w-full h-[500px] object-contain"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Sin+Imagen";
              }}
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="flex gap-2 mb-2">
            <span className="badge badge-secondary">Suplemento</span>
            {suplemento.marca_nombre && (
              <span className="badge badge-ghost">{suplemento.marca_nombre}</span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{suplemento.nombre}</h1>
          
          <p className="text-gray-600 mb-4">{suplemento.descripcion}</p>
          
          <div className="flex gap-4 mb-4 flex-wrap">
            {suplemento.sabor && (
              <span className="badge badge-outline">Sabor: {suplemento.sabor}</span>
            )}
            {suplemento.tamano && (
              <span className="badge badge-outline">Tamaño: {suplemento.tamano}</span>
            )}
          </div>

          {/* Especificaciones */}
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-3">📋 Especificaciones</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {suplemento.nombre && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Tipo</span>
                  <p className="font-semibold">{suplemento.nombre.split(' ')[0]}</p>
                </div>
              )}
              {suplemento.tamano && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Porciones</span>
                  <p className="font-semibold">{suplemento.tamano}</p>
                </div>
              )}
              {suplemento.marca_nombre && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Marca</span>
                  <p className="font-semibold">{suplemento.marca_nombre}</p>
                </div>
              )}
              {suplemento.categoria_nombre && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Categoría</span>
                  <p className="font-semibold">{suplemento.categoria_nombre}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información Nutricional */}
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-3">🥗 Información Nutricional</h3>
            <div className="text-sm space-y-2">
              <p className="text-gray-600">Suplemento de alta calidad para complementar tu entrenamiento. Consulta la etiqueta del producto para información nutricional detallada.</p>
            </div>
          </div>

          <p className="text-4xl font-bold text-primary mb-6">
            S/ {suplemento.precio?.toFixed(2)}
          </p>

          <p className={`mb-4 ${suplemento.stock > 0 ? "text-success" : "text-error"}`}>
            {suplemento.stock > 0 ? `Stock disponible: ${suplemento.stock} unidades` : "Sin stock"}
          </p>

          <button 
            onClick={agregarAlCarrito} 
            className="btn btn-primary btn-lg"
            disabled={suplemento.stock <= 0}
          >
            <ShoppingCart size={20} />
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
