import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../herramientas/config";
import { toast } from "sonner";

export default function BoletasAdmin() {
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")).access_token
    : null;

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/boletas`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error("No autorizado");
      const data = await res.json();
      setBoletas(data || []);
    } catch (e) {
      toast.error(String(e));
      setBoletas([]);
    }
    setLoading(false);
  };

  const eliminar = async (b) => {
    if (!confirm("Eliminar boleta?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/boletas/${b.id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error("Error");
      toast.success("Boleta eliminada");
      cargar();
    } catch (e) {
      toast.error(String(e));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Boletas (Admin)</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pedido</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {boletas.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.numeroPedido}</td>
                  <td>{b.usuario_id}</td>
                  <td>S/ {Number(b.total).toFixed(2)}</td>
                  <td>{b.fecha}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => eliminar(b)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
