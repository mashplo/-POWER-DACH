import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, normalizeImageUrl } from "../herramientas/config";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { addItemCarrito } from "../herramientas/carrito";

export default function ProteinaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proteina, setProteina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProteina = async () => {
      try {
        setLoading(true);
        if (!API_BASE_URL) {
          setError("API no configurada");
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/proteinas/${id}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setProteina(data);
      } catch (error) {
        console.error("Error al obtener proteína:", error);
        setError(error.message);
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    obtenerProteina();
  }, [id]);

  const agregarAlCarrito = () => {
    addItemCarrito({
      id: proteina.producto_id,
      title: proteina.nombre,
      price: proteina.precio,
      image: normalizeImageUrl(proteina.imagen_url),
      tipo: "proteina",
    });
    toast.success(`${proteina.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !proteina) {
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
              src={normalizeImageUrl(proteina.imagen_url)}
              alt={proteina.nombre}
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
            {proteina.tipo_proteina && (
              <span className="badge badge-primary">{proteina.tipo_proteina}</span>
            )}
            {proteina.marca_nombre && (
              <span className="badge badge-ghost">{proteina.marca_nombre}</span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{proteina.nombre}</h1>
          
          <p className="text-gray-600 mb-4">{proteina.descripcion}</p>
          
          <div className="flex gap-4 mb-4 flex-wrap">
            {proteina.sabor && (
              <span className="badge badge-outline">Sabor: {proteina.sabor}</span>
            )}
            {proteina.tamano && (
              <span className="badge badge-outline">Tamaño: {proteina.tamano}</span>
            )}
            {proteina.porciones && (
              <span className="badge badge-outline">{proteina.porciones} porciones</span>
            )}
          </div>

          {/* Especificaciones */}
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-3">📋 Especificaciones</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {proteina.tipo_proteina && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Tipo</span>
                  <p className="font-semibold">{proteina.tipo_proteina}</p>
                </div>
              )}
              {proteina.porciones && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Porciones</span>
                  <p className="font-semibold">{proteina.porciones}</p>
                </div>
              )}
              {proteina.tamano && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Tamaño</span>
                  <p className="font-semibold">{proteina.tamano}</p>
                </div>
              )}
              {proteina.marca_nombre && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Marca</span>
                  <p className="font-semibold">{proteina.marca_nombre}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información Nutricional */}
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-3">🥗 Información Nutricional (por porción)</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {proteina.proteina_por_porcion && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Proteína</span>
                  <p className="font-semibold">{proteina.proteina_por_porcion}g</p>
                </div>
              )}
              {proteina.calorias_por_porcion && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Calorías</span>
                  <p className="font-semibold">{proteina.calorias_por_porcion}</p>
                </div>
              )}
              {proteina.carbohidratos !== null && proteina.carbohidratos !== undefined && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Carbohidratos</span>
                  <p className="font-semibold">{proteina.carbohidratos}g</p>
                </div>
              )}
              {proteina.grasas !== null && proteina.grasas !== undefined && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Grasas</span>
                  <p className="font-semibold">{proteina.grasas}g</p>
                </div>
              )}
              {proteina.azucares !== null && proteina.azucares !== undefined && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Azúcares</span>
                  <p className="font-semibold">{proteina.azucares}g</p>
                </div>
              )}
              {proteina.sodio_mg && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Sodio</span>
                  <p className="font-semibold">{proteina.sodio_mg}mg</p>
                </div>
              )}
              {proteina.aminoacidos_bcaa && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">BCAAs</span>
                  <p className="font-semibold">{proteina.aminoacidos_bcaa}g</p>
                </div>
              )}
              {proteina.glutamina && (
                <div className="bg-base-100 p-2 rounded">
                  <span className="text-gray-500">Glutamina</span>
                  <p className="font-semibold">{proteina.glutamina}g</p>
                </div>
              )}
            </div>
          </div>

          {/* Certificaciones */}
          {proteina.certificaciones && (
            <div className="mb-4">
              <span className="badge badge-success gap-1">
                ✓ {proteina.certificaciones}
              </span>
            </div>
          )}

          <p className="text-4xl font-bold text-primary mb-6">
            S/ {proteina.precio?.toFixed(2)}
          </p>

          <p className={`mb-4 ${proteina.stock > 0 ? "text-success" : "text-error"}`}>
            {proteina.stock > 0 ? `Stock disponible: ${proteina.stock} unidades` : "Sin stock"}
          </p>

          <button 
            onClick={agregarAlCarrito} 
            className="btn btn-primary btn-lg"
            disabled={proteina.stock <= 0}
          >
            <ShoppingCart size={20} />
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
