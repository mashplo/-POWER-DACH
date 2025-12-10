import { useNavigate } from "react-router-dom";
import { ShoppingCart, Zap, Coffee } from "lucide-react";
import { toast } from "sonner";
import { addItemCarrito } from "../../herramientas/carrito";
import { normalizeImageUrl } from "../../herramientas/config";

export default function Card({ producto }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/preentreno/${producto.id}`);
  };

  const handleAgregarCarrito = (e) => {
    e.stopPropagation();
    addItemCarrito({
      id: producto.producto_id, // Usar producto_id para la boleta
      title: producto.nombre,
      price: producto.precio,
      image: normalizeImageUrl(producto.imagen_url),
      tipo: "preentreno",
    });
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  const getNivelColor = (nivel) => {
    switch(nivel) {
      case 'bajo': return 'badge-success';
      case 'moderado': return 'badge-warning';
      case 'alto': return 'badge-error';
      case 'extremo': return 'badge-error bg-red-800';
      default: return 'badge-ghost';
    }
  };

  return (
    <div
      onClick={handleClick}
      className="card rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
    >
      <img
        src={normalizeImageUrl(producto.imagen_url)}
        alt={producto.nombre}
        className="card-image"
      />
      <div className="card-content px-5 py-4 flex flex-col gap-2">
        <div className="flex gap-1 flex-wrap">
          {producto.nivel_estimulante && (
            <span className={`badge badge-sm ${getNivelColor(producto.nivel_estimulante)}`}>
              <Zap size={10} /> {producto.nivel_estimulante}
            </span>
          )}
          {producto.marca_nombre && (
            <span className="badge badge-ghost badge-sm">{producto.marca_nombre}</span>
          )}
        </div>
        <h2 className="card-title text-lg font-semibold">{producto.nombre}</h2>
        
        {/* Info específica de preentreno */}
        {producto.cafeina_mg && (
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Coffee size={12} className="text-amber-600" />
              {producto.cafeina_mg}mg cafeína
            </span>
          </div>
        )}
        
        <p className="card-price text-2xl font-bold text-primary">S/{producto.precio}</p>
        <button
          onClick={handleAgregarCarrito}
          className="btn btn-primary btn-sm mt-2 w-full"
        >
          <ShoppingCart size={16} />
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}
