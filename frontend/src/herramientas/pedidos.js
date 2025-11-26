// Funciones para manejar pedidos

export function crearPedido({ items, total, metodoPago }) {
  const usuario = localStorage.getItem("usuarioActual")
    ? JSON.parse(localStorage.getItem("usuarioActual"))
    : null;

  if (!usuario) {
    return { success: false, error: "Debes iniciar sesión para realizar un pedido" };
  }

  const pedido = {
    id: Date.now(),
    numeroPedido: `PD-${Date.now().toString().slice(-8)}`,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
    },
    items: items.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      cantidad: item.cantidad,
      tipo: item.tipo,
      subtotal: item.price * item.cantidad,
    })),
    total: total,
    metodoPago: metodoPago,
    fecha: new Date().toISOString(),
    estado: "Completado",
  };

  // Guardar en localStorage
  const pedidos = localStorage.getItem("pedidos")
    ? JSON.parse(localStorage.getItem("pedidos"))
    : [];

  pedidos.unshift(pedido); // Agregar al inicio
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  return { success: true, pedido };
}

export function obtenerPedidos() {
  const usuario = localStorage.getItem("usuarioActual")
    ? JSON.parse(localStorage.getItem("usuarioActual"))
    : null;

  if (!usuario) {
    return [];
  }

  const todosPedidos = localStorage.getItem("pedidos")
    ? JSON.parse(localStorage.getItem("pedidos"))
    : [];

  // Filtrar solo los pedidos del usuario actual
  return todosPedidos.filter(p => p.usuario.id === usuario.id);
}

export function obtenerPedidoPorId(id) {
  const pedidos = localStorage.getItem("pedidos")
    ? JSON.parse(localStorage.getItem("pedidos"))
    : [];

  return pedidos.find(p => p.id === parseInt(id));
}

export function obtenerTodosPedidos() {
  return localStorage.getItem("pedidos")
    ? JSON.parse(localStorage.getItem("pedidos"))
    : [];
}
