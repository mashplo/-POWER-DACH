import { useNavigate } from "react-router-dom";
import { ShoppingCart, Dumbbell, Flame } from "lucide-react";
import { toast } from "sonner";
import { addItemCarrito } from "../../herramientas/carrito";
import { normalizeImageUrl } from "../../herramientas/config";

export default function Card({ producto }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/proteina/${producto.id}`);
  };

  const handleAgregarCarrito = (e) => {
    e.stopPropagation(); // Evitar que se active el click del card
    addItemCarrito({
      id: producto.producto_id || producto.id,
      title: producto.nombre,
      price: producto.precio,
      image: normalizeImageUrl(producto.imagen_url),
      tipo: "proteina",
    });
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  return (
    <div 
      onClick={handleClick}
      className="card rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      <img src={normalizeImageUrl(producto.imagen_url)} alt={producto.nombre} className="card-image" />
      <div className="card-content px-5 py-4 flex flex-col gap-2">
        <div className="flex gap-1 flex-wrap">
          {producto.tipo_proteina && (
            <span className="badge badge-primary badge-sm">{producto.tipo_proteina}</span>
          )}
          {producto.marca_nombre && (
            <span className="badge badge-ghost badge-sm">{producto.marca_nombre}</span>
          )}
        </div>
        <h2 className="card-title text-lg font-semibold">{producto.nombre}</h2>
        
        {/* Info nutricional básica */}
        {(producto.proteina_por_porcion || producto.calorias_por_porcion) && (
          <div className="flex gap-3 text-xs text-gray-500">
            {producto.proteina_por_porcion && (
              <span className="flex items-center gap-1">
                <Dumbbell size={12} className="text-blue-500" />
                {producto.proteina_por_porcion}g proteína
              </span>
            )}
            {producto.calorias_por_porcion && (
              <span className="flex items-center gap-1">
                <Flame size={12} className="text-orange-500" />
                {producto.calorias_por_porcion} cal
              </span>
            )}
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