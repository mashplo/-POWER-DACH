// Funciones para manejar pedidos
import { API_BASE_URL } from './config.js';

const BOLETAS_URL = API_BASE_URL ? `${API_BASE_URL}/api/v1/boletas` : null;

export async function crearPedido({ items, total, metodoPago }) {
  const usuario = localStorage.getItem("usuarioActual")
    ? JSON.parse(localStorage.getItem("usuarioActual"))
    : null;

  if (!usuario) {
    return { success: false, error: "Debes iniciar sesión para realizar un pedido" };
  }

  if (!BOLETAS_URL) {
    return { success: false, error: "API no configurada" };
  }

  // Preparar datos para el backend
  const boletaData = {
    user_id: usuario.id,
    total: total,
    items: items.map(item => ({
      product_id: item.id,
      product_type: item.tipo, // Asegurarse que 'tipo' coincida con lo esperado (productos, creatinas, preentrenos)
      quantity: item.cantidad,
      price: item.price,
      title: item.title
    }))
  };

  try {
    const response = await fetch(BOLETAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(boletaData)
    });

    if (response.ok) {
      const data = await response.json();

      // Mantener compatibilidad con localStorage para historial local si se desea
      // O simplemente confiar en el backend.
      // Por ahora, retornamos el ID de la boleta del backend
      return { success: true, pedido: { id: data.boleta_id } };
    } else {
      const errorData = await response.json();
      let errorMessage = "Error al crear el pedido";
      if (errorData.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(err => err.msg).join(", ");
        } else {
          errorMessage = JSON.stringify(errorData.detail);
        }
      }
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    return { success: false, error: "Error de conexión con el servidor" };
  }
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
