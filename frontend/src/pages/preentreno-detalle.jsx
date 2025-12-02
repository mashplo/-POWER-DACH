import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, normalizeImageUrl } from "../herramientas/config";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { addItemCarrito } from "../herramientas/carrito";

export default function PreentrenoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preentreno, setPreentreno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerPreentreno = async () => {
      try {
        setLoading(true);
        if (!API_BASE_URL) {
          setError("API no configurada");
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/preentrenos/${id}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setPreentreno(data);
      } catch (error) {
        console.error("Error al obtener pre-entreno:", error);
        setError(error.message);
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    obtenerPreentreno();
  }, [id]);

  const agregarAlCarrito = () => {
    addItemCarrito({
      id: preentreno.producto_id, // Usar producto_id para la boleta
      title: preentreno.nombre,
      price: preentreno.precio,
      image: normalizeImageUrl(preentreno.imagen_url),
      tipo: "preentreno",
    });
    toast.success(`${preentreno.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !preentreno) {
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
              src={normalizeImageUrl(preentreno.imagen_url)}
              alt={preentreno.nombre}
              className="w-full h-[500px] object-contain"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x500?text=Sin+Imagen";
              }}
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="lg:w-1/2 flex flex-col">
          <span className="badge badge-secondary mb-2">{preentreno.marca_nombre || "Pre-Entreno"}</span>
          <h1 className="text-3xl font-bold mb-4">{preentreno.nombre}</h1>
          
          <p className="text-gray-600 mb-4">{preentreno.descripcion}</p>
          
          <div className="flex gap-4 mb-4 flex-wrap">
            {preentreno.sabor && (
              <span className="badge badge-outline">Sabor: {preentreno.sabor}</span>
            )}
            {preentreno.tamano && (
              <span className="badge badge-outline">Tamaño: {preentreno.tamano}</span>
            )}
            {preentreno.nivel_estimulante && (
              <span className="badge badge-warning">Estimulación: {preentreno.nivel_estimulante}</span>
            )}
          </div>

          {/* Información específica de pre-entreno */}
          {(preentreno.cafeina_mg || preentreno.beta_alanina || preentreno.citrulina) && (
            <div className="bg-base-200 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2">Ingredientes Clave</h3>
              <ul className="space-y-1 text-sm">
                {preentreno.cafeina_mg && (
                  <li><strong>Cafeína:</strong> {preentreno.cafeina_mg}mg</li>
                )}
                {preentreno.beta_alanina && (
                  <li><strong>Beta-Alanina:</strong> {preentreno.beta_alanina}g</li>
                )}
                {preentreno.citrulina && (
                  <li><strong>Citrulina:</strong> {preentreno.citrulina}g</li>
                )}
              </ul>
            </div>
          )}

          <p className="text-4xl font-bold text-primary mb-6">
            S/ {preentreno.precio?.toFixed(2)}
          </p>

          <p className={`mb-4 ${preentreno.stock > 0 ? "text-success" : "text-error"}`}>
            {preentreno.stock > 0 ? `Stock disponible: ${preentreno.stock} unidades` : "Sin stock"}
          </p>

          <button 
            onClick={agregarAlCarrito} 
            className="btn btn-primary btn-lg"
            disabled={preentreno.stock <= 0}
          >
            <ShoppingCart size={20} />
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
