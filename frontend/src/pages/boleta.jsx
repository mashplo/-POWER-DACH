import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerPedidoPorId } from "../herramientas/pedidos";
import { normalizeImageUrl } from "../herramientas/config";
import { FileText, Calendar, CreditCard, CheckCircle, ArrowLeft, Printer } from "lucide-react";

export default function BoletaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const data = await obtenerPedidoPorId(id);
        
        if (!data) {
          setError("Boleta no encontrada");
          return;
        }

        setPedido(data);
      } catch (error) {
        console.error("Error cargando boleta:", error);
        setError("Error al cargar la boleta");
      } finally {
        setLoading(false);
      }
    };

    cargarPedido();
  }, [id]);

  const imprimirBoleta = () => {
    window.print();
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    // Las fechas de SQLite vienen en UTC, agregar 'Z' para indicarlo
    const utcDate = fecha.includes('Z') || fecha.includes('+') 
        ? fecha 
        : fecha.replace(' ', 'T') + 'Z';
    return new Date(utcDate).toLocaleString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Lima"
    });
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: "badge-warning",
      procesando: "badge-info",
      enviado: "badge-primary",
      entregado: "badge-success",
      cancelado: "badge-error"
    };
    return colores[estado] || "badge-ghost";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-error mb-4">{error || "Boleta no encontrada"}</p>
          <button onClick={() => navigate("/historial")} className="btn btn-primary">
            Ver Historial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Botones de acción */}
        <div className="flex justify-between mb-6 print:hidden">
          <button onClick={() => navigate("/historial")} className="btn btn-ghost gap-2">
            <ArrowLeft size={20} />
            Ver Historial
          </button>
          <button onClick={imprimirBoleta} className="btn btn-primary gap-2">
            <Printer size={20} />
            Imprimir
          </button>
        </div>

        {/* Boleta */}
        <div className="bg-white rounded-lg shadow-xl p-8 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-primary pb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">POWER DACH</h1>
            <p className="text-gray-600">Suplementos Deportivos Premium</p>
          </div>

          {/* Título y número */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">BOLETA DE VENTA</h2>
            <p className="text-lg text-primary font-mono">
              N° {String(pedido.id).padStart(8, '0')}
            </p>
            <div className={`badge ${getEstadoColor(pedido.estado)} mt-2`}>
              {pedido.estado?.toUpperCase() || "PENDIENTE"}
            </div>
          </div>

          {/* Información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-base-100 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span className="font-semibold">Fecha:</span>
              <span>{formatearFecha(pedido.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              <span className="font-semibold">Método:</span>
              <span className="capitalize">{pedido.metodo_pago || "Efectivo"}</span>
            </div>
          </div>

          {/* Dirección de envío */}
          {pedido.direccion_envio && (
            <div className="mb-6 bg-base-100 p-4 rounded-lg">
              <p><span className="font-semibold">Dirección:</span> {pedido.direccion_envio}</p>
            </div>
          )}

          {/* Detalle de productos */}
          <div className="mb-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileText size={20} />
              Detalle del Pedido
            </h3>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-right">P. Unit.</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.items?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={normalizeImageUrl(item.imagen_url)} 
                            alt={item.nombre}
                            className="w-12 h-12 object-cover rounded print:hidden"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <span>{item.nombre}</span>
                        </div>
                      </td>
                      <td className="text-center">{item.cantidad}</td>
                      <td className="text-right">S/ {item.precio_unitario?.toFixed(2)}</td>
                      <td className="text-right font-semibold">S/ {item.subtotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="border-t-2 border-primary pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>S/ {pedido.subtotal?.toFixed(2)}</span>
                </div>
                {pedido.descuento > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Descuento:</span>
                    <span>- S/ {pedido.descuento?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>IGV (18%):</span>
                  <span>S/ {pedido.impuestos?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold bg-primary text-white p-3 rounded-lg">
                  <span>TOTAL:</span>
                  <span>S/ {pedido.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2 text-success mb-2">
              <CheckCircle size={20} />
              <span className="font-semibold">¡Gracias por tu compra!</span>
            </div>
            <p className="text-xs">
              Esta boleta fue generada electrónicamente y es válida sin firma.
            </p>
          </div>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
