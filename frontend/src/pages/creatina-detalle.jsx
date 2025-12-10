import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, normalizeImageUrl } from "../herramientas/config";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { addItemCarrito } from "../herramientas/carrito";

export default function CreatinaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creatina, setCreatina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCreatina = async () => {
      try {
        setLoading(true);
        if (!API_BASE_URL) {
          setError("API no configurada");
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/creatinas/${id}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setCreatina(data);
      } catch (error) {
        console.error("Error al obtener creatina:", error);
        setError(error.message);
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    obtenerCreatina();
  }, [id]);

  const agregarAlCarrito = () => {
    addItemCarrito({
      id: creatina.producto_id, // Usar producto_id para la boleta
      title: creatina.nombre,
      price: creatina.precio,
      image: normalizeImageUrl(creatina.imagen_url),
      tipo: "creatina",
    });
    toast.success(`${creatina.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !creatina) {
    return (
      <div className="px-10 py-20 text-center">
        <p className="text-xl text-error mb-4">{error || "Producto no encontrado"}</p>
        <button onClick={() => navigate("/productos")} className="btn btn-primary">
          Volver a Productos
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
              src={normalizeImageUrl(creatina.imagen_url)}
              alt={creatina.nombre}
              className="w-full h-[500px] object-contain"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Sin+Imagen";
              }}
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="lg:w-1/2 flex flex-col">
          <span className="badge badge-primary mb-2">{creatina.marca_nombre || "Creatina"}</span>
          <h1 className="text-3xl font-bold mb-4">{creatina.nombre}</h1>
          
          <p className="text-gray-600 mb-4">{creatina.descripcion}</p>
          
          <div className="flex gap-4 mb-4">
            {creatina.sabor && (
              <span className="badge badge-outline">Sabor: {creatina.sabor}</span>
            )}
            {creatina.tamano && (
              <span className="badge badge-outline">Tamaño: {creatina.tamano}</span>
            )}
          </div>

          {/* Especificaciones */}
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-3">📋 Especificaciones</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {creatina.tipo_creatina && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Tipo</span>
                  <p className="font-semibold">{creatina.tipo_creatina}</p>
                </div>
              )}
              {creatina.porciones && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Porciones</span>
                  <p className="font-semibold">{creatina.porciones}</p>
                </div>
              )}
              {creatina.gramos_porcion && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Por porción</span>
                  <p className="font-semibold">{creatina.gramos_porcion}g</p>
                </div>
              )}
              {creatina.tamano && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Tamaño</span>
                  <p className="font-semibold">{creatina.tamano}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información Nutricional */}
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-3">🥗 Información Nutricional</h3>
            <div className="text-sm space-y-2">
              <p className="text-gray-600">Cada porción de {creatina.gramos_porcion || 5}g proporciona creatina pura para mejorar el rendimiento deportivo, aumentar la fuerza y acelerar la recuperación muscular.</p>
            </div>
          </div>

          <p className="text-4xl font-bold text-primary mb-6">
            S/ {creatina.precio?.toFixed(2)}
          </p>

          <p className={`mb-4 ${creatina.stock > 0 ? "text-success" : "text-error"}`}>
            {creatina.stock > 0 ? `Stock disponible: ${creatina.stock} unidades` : "Sin stock"}
          </p>

          <button 
            onClick={agregarAlCarrito} 
            className="btn btn-primary btn-lg"
            disabled={creatina.stock <= 0}
          >
            <ShoppingCart size={20} />
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
