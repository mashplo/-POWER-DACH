import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerPedidoPorId } from "../herramientas/pedidos";
import { FileText, Calendar, CreditCard, User, Mail, Clock } from "lucide-react";

export default function BoletaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPedido = () => {
      const pedidoData = obtenerPedidoPorId(id);
      
      if (!pedidoData) {
        navigate("/historial");
        return;
      }
      
      setPedido(pedidoData);
      setLoading(false);
    };

    cargarPedido();
  }, [id, navigate]);

  const imprimirBoleta = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!pedido) {
    return null;
  }

  const fecha = new Date(pedido.fecha);
  const fechaFormateada = fecha.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const horaFormateada = fecha.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Botones de acción (no se imprimen) */}
        <div className="flex justify-between mb-6 print:hidden">
          <button onClick={() => navigate("/historial")} className="btn btn-ghost">
            ← Volver al Historial
          </button>
          <button onClick={imprimirBoleta} className="btn btn-primary">
            🖨️ Imprimir Boleta
          </button>
        </div>

        {/* Boleta */}
        <div className="bg-white rounded-lg shadow-xl p-8 print:shadow-none">
          {/* Header con Logo */}
          <div className="text-center mb-8 border-b-2 border-primary pb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src="/logo.png" alt="Power Dutch" className="h-16 w-auto" />
              <h1 className="text-4xl font-bold">Power Dutch</h1>
            </div>
            <p className="text-gray-600">Suplementos Deportivos de Calidad</p>
            <p className="text-sm text-gray-500 mt-2">
              Jr. Los Deportistas 123, Lima - Perú | Tel: (01) 234-5678
            </p>
          </div>

          {/* Título de Boleta */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">BOLETA DE VENTA</h2>
            <p className="text-lg font-semibold text-primary">
              N° {pedido.numeroPedido}
            </p>
          </div>

          {/* Información del Cliente y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-base-100 p-4 rounded-lg">
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <User size={20} />
                Datos del Cliente
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Nombre:</span> {pedido.usuario.nombre}</p>
                <p className="flex items-center gap-2">
                  <Mail size={14} />
                  {pedido.usuario.email}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Calendar size={20} />
                Fecha y Hora
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Fecha:</span> {fechaFormateada}</p>
                <p className="flex items-center gap-2">
                  <Clock size={14} />
                  <span className="font-semibold">Hora:</span> {horaFormateada}
                </p>
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="mb-8 bg-base-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <CreditCard size={20} />
              Método de Pago
            </h3>
            <p className="text-lg capitalize">{pedido.metodoPago}</p>
          </div>

          {/* Detalle de Productos */}
          <div className="mb-8">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
              <FileText size={20} />
              Detalle del Pedido
            </h3>
            
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th className="text-left">Producto</th>
                    <th className="text-center">Categoría</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-right">Precio Unit.</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{item.title}</td>
                      <td className="text-center capitalize">{item.tipo}</td>
                      <td className="text-center font-semibold">{item.cantidad}</td>
                      <td className="text-right">S/ {item.price.toFixed(2)}</td>
                      <td className="text-right font-semibold">
                        S/ {item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="border-t-2 border-primary pt-4">
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-lg mb-2">
                  <span className="font-semibold">Subtotal:</span> S/ {pedido.total.toFixed(2)}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-semibold">IGV (0%):</span> S/ 0.00
                </p>
                <div className="bg-primary text-primary-content p-4 rounded-lg mt-2">
                  <p className="text-2xl font-bold">
                    TOTAL: S/ {pedido.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
            <p className="mb-2">¡Gracias por tu compra!</p>
            <p>Estado del pedido: <span className="font-bold text-success">{pedido.estado}</span></p>
            <p className="mt-4 text-xs">
              Esta boleta fue generada electrónicamente y es válida sin firma
            </p>
          </div>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
