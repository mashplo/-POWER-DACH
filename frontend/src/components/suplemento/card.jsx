import { useNavigate } from "react-router-dom";
import { ShoppingCart, Pill, Package } from "lucide-react";
import { toast } from "sonner";
import { addItemCarrito } from "../../herramientas/carrito";
import { normalizeImageUrl } from "../../herramientas/config";

export default function Card({ producto }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/suplemento/${producto.id}`);
  };

  const handleAgregarCarrito = (e) => {
    e.stopPropagation();
    addItemCarrito({
      id: producto.id,
      title: producto.nombre,
      price: producto.precio,
      image: normalizeImageUrl(producto.imagen_url),
      tipo: "suplemento",
    });
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  // Determinar el tipo de suplemento basado en el nombre
  const getTipoSuplemento = (nombre) => {
    if (nombre?.toLowerCase().includes('bcaa')) return 'BCAA';
    if (nombre?.toLowerCase().includes('amino')) return 'Aminoácidos';
    if (nombre?.toLowerCase().includes('glutam')) return 'Glutamina';
    if (nombre?.toLowerCase().includes('opti-men') || nombre?.toLowerCase().includes('opti-women')) return 'Multivitamínico';
    if (nombre?.toLowerCase().includes('hydroxycut')) return 'Quemador';
    return 'Suplemento';
  };

  const getBadgeColor = (tipo) => {
    switch(tipo) {
      case 'BCAA': return 'badge-primary';
      case 'Aminoácidos': return 'badge-secondary';
      case 'Glutamina': return 'badge-accent';
      case 'Multivitamínico': return 'badge-success';
      case 'Quemador': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const tipoSuplemento = getTipoSuplemento(producto.nombre);

  return (
    <div
      onClick={handleClick}
      className="card rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
    >
      <img
        src={normalizeImageUrl(producto.imagen_url)}
        alt={producto.nombre}
        className="card-image"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x300?text=Sin+Imagen";
        }}
      />
      <div className="card-content px-5 py-4 flex flex-col gap-2">
        <div className="flex gap-1 flex-wrap">
          <span className={`badge badge-sm ${getBadgeColor(tipoSuplemento)}`}>
            <Pill size={10} /> {tipoSuplemento}
          </span>
          {producto.marca_nombre && (
            <span className="badge badge-ghost badge-sm">{producto.marca_nombre}</span>
          )}
        </div>
        <h2 className="card-title text-lg font-semibold">{producto.nombre}</h2>
        
        {/* Info específica de suplemento */}
        {producto.tamano && (
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Package size={12} className="text-purple-500" />
              {producto.tamano}
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
