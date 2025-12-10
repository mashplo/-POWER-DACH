import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, normalizeImageUrl } from "../herramientas/config";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { addItemCarrito } from "../herramientas/carrito";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProducto = async () => {
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
        setProducto(data);
      } catch (error) {
        console.error("Error al obtener producto:", error);
        setError(error.message);
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    obtenerProducto();
  }, [id]);

  const agregarAlCarrito = () => {
    addItemCarrito({
      id: producto.id,
      title: producto.nombre,
      price: producto.precio,
      image: normalizeImageUrl(producto.imagen_url),
      tipo: "producto",
    });
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !producto) {
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
              src={normalizeImageUrl(producto.imagen_url)}
              alt={producto.nombre}
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
            {producto.categoria_nombre && (
              <span className="badge badge-primary">{producto.categoria_nombre}</span>
            )}
            {producto.marca_nombre && (
              <span className="badge badge-ghost">{producto.marca_nombre}</span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
          
          <p className="text-gray-600 mb-4">{producto.descripcion}</p>
          
          <div className="flex gap-4 mb-4 flex-wrap">
            {producto.sabor && (
              <span className="badge badge-outline">Sabor: {producto.sabor}</span>
            )}
            {producto.tamano && (
              <span className="badge badge-outline">Tamaño: {producto.tamano}</span>
            )}
          </div>

          {/* Especificaciones */}
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-3">📋 Especificaciones</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {producto.categoria_nombre && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Tipo</span>
                  <p className="font-semibold">{producto.categoria_nombre}</p>
                </div>
              )}
              {producto.tamano && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Porciones</span>
                  <p className="font-semibold">{producto.tamano}</p>
                </div>
              )}
              {producto.marca_nombre && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Marca</span>
                  <p className="font-semibold">{producto.marca_nombre}</p>
                </div>
              )}
              {producto.sabor && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Sabor</span>
                  <p className="font-semibold">{producto.sabor}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información Nutricional */}
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-3">🥗 Información Nutricional</h3>
            <div className="text-sm space-y-2">
              <p className="text-gray-600">Producto de alta calidad para complementar tu entrenamiento. Consulta la etiqueta del producto para información nutricional detallada.</p>
            </div>
          </div>

          <p className="text-4xl font-bold text-primary mb-6">
            S/ {producto.precio?.toFixed(2)}
          </p>

          <p className={`mb-4 ${producto.stock > 0 ? "text-success" : "text-error"}`}>
            {producto.stock > 0 ? `Stock disponible: ${producto.stock} unidades` : "Sin stock"}
          </p>

          <button 
            onClick={agregarAlCarrito} 
            className="btn btn-primary btn-lg"
            disabled={producto.stock <= 0}
          >
            <ShoppingCart size={20} />
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
