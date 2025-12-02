import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
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
        <h2 className="card-title text-lg font-semibold">{producto.nombre}</h2>
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
