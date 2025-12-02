// Funciones para manejar pedidos
import { API_BASE_URL } from './config.js';

export async function crearPedido({ items, total, metodoPago }) {
  // Obtener usuario desde localStorage (token y user)
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const usuario = userStr ? JSON.parse(userStr) : null;

  if (!usuario || !token) {
    return { success: false, error: "Debes iniciar sesión para realizar un pedido" };
  }

  if (!API_BASE_URL) {
    return { success: false, error: "API no configurada" };
  }

  // Preparar datos para el backend
  // Mapear método de pago string a ID (1=efectivo, 2=tarjeta, 3=yape, etc)
  const metodoPagoMap = {
    "efectivo": 1,
    "tarjeta": 2,
    "yape": 3,
    "plin": 4,
    "transferencia": 5
  };

  const boletaData = {
    items: items.map(item => ({
      producto_id: item.id,
      cantidad: item.cantidad
    })),
    metodo_pago_id: metodoPagoMap[metodoPago] || 1,
    direccion_envio: "Dirección predeterminada"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/boletas`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(boletaData)
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, pedido: { id: data.id } };
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
    console.error("Error creando pedido:", error);
    return { success: false, error: "Error de conexión con el servidor" };
  }
}

export function obtenerPedidos() {
  const usuario = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
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

export async function obtenerPedidoPorId(id) {
  const token = localStorage.getItem("token");
  
  if (!API_BASE_URL) {
    return null;
  }

  try {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/boletas/${id}`, {
      method: "GET",
      headers
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo boleta:", error);
    return null;
  }
}

export function obtenerTodosPedidos() {
  return localStorage.getItem("pedidos")
    ? JSON.parse(localStorage.getItem("pedidos"))
    : [];
}
