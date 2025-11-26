import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, CreditCard } from "lucide-react";
import { toast } from "sonner";
import {
  getCarrito,
  changeItemCantidad,
  removeItemCarrito,
  clearCarrito,
  getCarritoTotal,
} from "../herramientas/carrito";
import { crearPedido } from "../herramientas/pedidos";

export default function CarritoPage() {
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
    
    // Escuchar cambios en el carrito
    const handleCarritoActualizado = () => {
      cargarCarrito();
    };
    
    window.addEventListener('carritoActualizado', handleCarritoActualizado);
    
    return () => {
      window.removeEventListener('carritoActualizado', handleCarritoActualizado);
    };
  }, []);

  const cargarCarrito = () => {
    try {
      const items = getCarrito();
      console.log("Carrito cargado:", items); // Para depurar
      setCarrito(items);
      setError(null);
    } catch (error) {
      console.error("Error cargando carrito:", error);
      setCarrito([]);
      setError(error.message);
      toast.error("Error al cargar el carrito");
    }
  };

  const handleSumar = (id, tipo) => {
    try {
      changeItemCantidad({ id, tipo, delta: 1 });
      cargarCarrito();
    } catch (error) {
      console.error("Error al sumar:", error);
      toast.error("Error al actualizar cantidad");
    }
  };

  const handleRestar = (id, tipo) => {
    try {
      changeItemCantidad({ id, tipo, delta: -1 });
      cargarCarrito();
    } catch (error) {
      console.error("Error al restar:", error);
      toast.error("Error al actualizar cantidad");
    }
  };

  const handleEliminar = (id, tipo, title) => {
    removeItemCarrito({ id, tipo });
    cargarCarrito();
    toast.success(`${title} eliminado del carrito`);
  };

  const handleProcederPago = () => {
    if (carrito.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }
    setMostrarCheckout(true);
  };

  const handleConfirmarPedido = () => {
    if (!metodoPago) {
      toast.error("Por favor selecciona un método de pago");
      return;
    }

    // Crear el pedido
    const resultado = crearPedido({
      items: carrito,
      total: total,
      metodoPago: metodoPago,
    });

    if (resultado.success) {
      // Limpiar carrito
      clearCarrito();
      setCarrito([]);
      setMostrarCheckout(false);
      
      // Redirigir a la boleta
      toast.success("¡Pedido realizado con éxito!");
      navigate(`/boleta/${resultado.pedido.id}`);
    } else {
      toast.error(resultado.error || "Error al crear el pedido");
    }
  };

  const total = getCarritoTotal();
  const cantidadItems = carrito.reduce((sum, item) => sum + (parseInt(item.cantidad) || 0), 0);

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="alert alert-error max-w-md">
            <span>Error al cargar el carrito: {error}</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("carrito");
              window.location.reload();
            }}
            className="btn btn-primary mt-4"
          >
            Limpiar y Recargar
          </button>
        </div>
      </div>
    );
  }

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart size={80} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">
            Agrega productos para comenzar tu pedido
          </p>
          <button
            onClick={() => navigate("/productos")}
            className="btn btn-primary"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <ShoppingCart size={40} />
          Carrito de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Productos */}
          <div className="lg:col-span-2 space-y-4">
            {carrito.map((item) => (
              <div
                key={`${item.tipo}-${item.id}`}
                className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
              >
                {/* Imagen */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100?text=Producto";
                    }}
                  />
                </div>

                {/* Info del Producto */}
                <div className="flex-grow">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 capitalize mb-2">
                    {item.tipo}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    S/ {item.price.toFixed(2)}
                  </p>
                </div>

                {/* Controles de Cantidad */}
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 bg-base-200 rounded-lg p-2">
                    <button
                      onClick={() => handleRestar(item.id, item.tipo)}
                      className="btn btn-sm btn-circle btn-ghost"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-lg w-8 text-center">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => handleSumar(item.id, item.tipo)}
                      className="btn btn-sm btn-circle btn-ghost"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-sm font-semibold">
                    Subtotal: S/ {(item.price * item.cantidad).toFixed(2)}
                  </p>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => handleEliminar(item.id, item.tipo, item.title)}
                    className="btn btn-sm btn-error btn-outline"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>

              <div className="divider my-2"></div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Cantidad de items:</span>
                  <span className="font-semibold">{cantidadItems}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="divider my-2"></div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total:</span>
                <span className="text-primary">S/ {total.toFixed(2)}</span>
              </div>

              {!mostrarCheckout ? (
                <button
                  onClick={handleProcederPago}
                  className="btn btn-primary w-full"
                >
                  <CreditCard size={20} />
                  Proceder al Pago
                </button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Método de Pago</h3>

                  {/* Opciones de Pago */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-base-200">
                      <input
                        type="radio"
                        name="metodo-pago"
                        value="efectivo"
                        checked={metodoPago === "efectivo"}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="radio radio-primary"
                      />
                      <span className="font-medium">Efectivo</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-base-200">
                      <input
                        type="radio"
                        name="metodo-pago"
                        value="tarjeta"
                        checked={metodoPago === "tarjeta"}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="radio radio-primary"
                      />
                      <span className="font-medium">Tarjeta de Crédito</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-base-200">
                      <input
                        type="radio"
                        name="metodo-pago"
                        value="yape"
                        checked={metodoPago === "yape"}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="radio radio-primary"
                      />
                      <span className="font-medium">Yape / Plin</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-base-200">
                      <input
                        type="radio"
                        name="metodo-pago"
                        value="transferencia"
                        checked={metodoPago === "transferencia"}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="radio radio-primary"
                      />
                      <span className="font-medium">Transferencia Bancaria</span>
                    </label>
                  </div>

                  <button
                    onClick={handleConfirmarPedido}
                    className="btn btn-success w-full"
                  >
                    Confirmar Pedido
                  </button>

                  <button
                    onClick={() => setMostrarCheckout(false)}
                    className="btn btn-ghost w-full"
                  >
                    Volver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
