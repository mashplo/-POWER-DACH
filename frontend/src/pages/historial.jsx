import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, normalizeImageUrl } from "../herramientas/config";
import { FileText, Calendar, CreditCard, ShoppingBag, Eye, Package, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function HistorialPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Debes iniciar sesión para ver tu historial");
      navigate("/login");
      return;
    }
    cargarPedidos();
  }, [navigate, token]);

  const cargarPedidos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/boletas`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Sesión expirada. Inicia sesión nuevamente.");
          navigate("/login");
          return;
        }
        throw new Error("Error al cargar historial");
      }

      const data = await response.json();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando historial:", err);
      setError("No se pudo cargar el historial de pedidos");
      toast.error("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  const verBoleta = (pedidoId) => {
    navigate(`/boleta/${pedidoId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      // Las fechas de SQLite vienen en UTC, agregar 'Z' para indicarlo
      const utcDate = dateString.includes('Z') || dateString.includes('+') 
          ? dateString 
          : dateString.replace(' ', 'T') + 'Z';
      return new Date(utcDate).toLocaleString('es-PE', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
        timeZone: 'America/Lima'
      });
    } catch {
      return dateString;
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: 'badge-warning',
      pagado: 'badge-info',
      enviado: 'badge-primary',
      entregado: 'badge-success',
      cancelado: 'badge-error'
    };
    return badges[estado] || 'badge-ghost';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-error mb-4">{error}</p>
          <button onClick={cargarPedidos} className="btn btn-primary gap-2">
            <RefreshCw size={20} /> Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FileText size={40} />
            Historial de Pedidos
          </h1>
          <button onClick={cargarPedidos} className="btn btn-ghost gap-2">
            <RefreshCw size={20} /> Actualizar
          </button>
        </div>

        {pedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No tienes pedidos aún</h2>
            <p className="text-gray-600 mb-6">Realiza tu primer pedido para verlo aquí</p>
            <button onClick={() => navigate("/productos")} className="btn btn-primary">
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Info del Pedido */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Package className="text-primary" size={20} />
                      </div>
                      <h3 className="text-xl font-bold">
                        Pedido #{String(pedido.id).padStart(6, '0')}
                      </h3>
                      <span className={`badge ${getEstadoBadge(pedido.estado)}`}>
                        {pedido.estado?.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDate(pedido.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} />
                        <span>{pedido.metodo_pago_nombre || "Efectivo"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={16} />
                        <span>Subtotal: S/ {pedido.subtotal?.toFixed(2)}</span>
                      </div>
                    </div>

                    {pedido.direccion_envio && (
                      <p className="text-sm text-gray-500 mt-2">
                        📍 {pedido.direccion_envio}
                      </p>
                    )}
                  </div>

                  {/* Total y Acciones */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-3xl font-bold text-primary">
                        S/ {pedido.total?.toFixed(2)}
                      </p>
                    </div>
                    <button onClick={() => verBoleta(pedido.id)} className="btn btn-primary btn-sm gap-2">
                      <Eye size={16} /> Ver Boleta
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                  S/ {pedidos.reduce((sum, p) => sum + (p.total || 0), 0).toFixed(2)}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Pedidos Entregados</div>
                <div className="stat-value">
                  {pedidos.filter(p => p.estado === 'entregado').length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
