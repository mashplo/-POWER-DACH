import { useNavigate } from "react-router-dom";
import { ShoppingCart, Beaker, Hash } from "lucide-react";
import { toast } from "sonner";
import { addItemCarrito } from "../../herramientas/carrito";
import { normalizeImageUrl } from "../../herramientas/config";

export default function Card({ producto }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/creatina/${producto.id}`);
  };

  const handleAgregarCarrito = (e) => {
    e.stopPropagation();
    addItemCarrito({
      id: producto.producto_id, // Usar producto_id para la boleta
      title: producto.nombre,
      price: producto.precio,
      image: normalizeImageUrl(producto.imagen_url),
      tipo: "creatina",
    });
    toast.success(`${producto.nombre} agregado al carrito`);
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
          {producto.tipo_creatina && (
            <span className="badge badge-secondary badge-sm">{producto.tipo_creatina}</span>
          )}
          {producto.marca_nombre && (
            <span className="badge badge-ghost badge-sm">{producto.marca_nombre}</span>
          )}
        </div>
        <h2 className="card-title text-lg font-semibold">{producto.nombre}</h2>
        
        {/* Info específica de creatina */}
        {(producto.gramos_por_porcion || producto.porciones) && (
          <div className="flex gap-3 text-xs text-gray-500">
            {producto.gramos_por_porcion && (
              <span className="flex items-center gap-1">
                <Beaker size={12} className="text-purple-500" />
                {producto.gramos_por_porcion}g/porción
              </span>
            )}
            {producto.porciones && (
              <span className="flex items-center gap-1">
                <Hash size={12} className="text-gray-500" />
                {producto.porciones} porciones
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
