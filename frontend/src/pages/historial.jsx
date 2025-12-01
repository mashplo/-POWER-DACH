import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPedidos } from "../herramientas/pedidos";
import { FileText, Calendar, CreditCard, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";

export default function HistorialPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = localStorage.getItem("usuarioActual");
    if (!usuario) {
      toast.error("Debes iniciar sesión para ver tu historial");
      navigate("/login");
      return;
    }

    cargarPedidos();
  }, [navigate]);

  const cargarPedidos = () => {
    const pedidosData = obtenerPedidos();
    setPedidos(pedidosData);
    setLoading(false);
  };

  const verBoleta = (pedidoId) => {
    navigate(`/boleta/${pedidoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <FileText size={40} />
          Historial de Pedidos
        </h1>

        {pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No tienes pedidos aún</h2>
            <p className="text-gray-600 mb-6">
              Realiza tu primer pedido para verlo aquí
            </p>
            <button
              onClick={() => navigate("/productos")}
              className="btn btn-primary"
            >
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => {
              const fecha = new Date(pedido.fecha);
              const fechaFormateada = fecha.toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              const horaFormateada = fecha.toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={pedido.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Info del Pedido */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold">
                          Pedido #{pedido.numeroPedido}
                        </h3>
                        <span className="badge badge-success">{pedido.estado}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} />
                          <span>{fechaFormateada} - {horaFormateada}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard size={16} />
                          <span className="capitalize">{pedido.metodoPago}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <ShoppingBag size={16} />
                          <span>{pedido.items.length} producto(s)</span>
                        </div>
                      </div>

                      {/* Lista de Productos */}
                      <div className="mt-4 space-y-2">
                        {pedido.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm bg-base-100 p-2 rounded"
                          >
                            <span className="font-medium">
                              {item.cantidad}x {item.title}
                            </span>
                            <span className="text-gray-600">
                              S/ {item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total y Acciones */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total</p>
                        <p className="text-3xl font-bold text-primary">
                          S/ {pedido.total.toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => verBoleta(pedido.id)}
                        className="btn btn-primary btn-sm"
                      >
                        <Eye size={16} />
                        Ver Boleta
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resumen Total */}
        {pedidos.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Resumen Total</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat">
                <div className="stat-title">Total de Pedidos</div>
                <div className="stat-value text-primary">{pedidos.length}</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Total Gastado</div>
                <div className="stat-value text-success">
                  S/ {pedidos.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Productos Comprados</div>
                <div className="stat-value">
                  {pedidos.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.cantidad, 0), 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
