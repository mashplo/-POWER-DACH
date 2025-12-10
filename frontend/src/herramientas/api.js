import { API_BASE_URL, normalizeImageUrl } from './config.js';

/**
 * Función helper para construir query params
 */
function buildQueryParams(filters) {
  const params = new URLSearchParams();
  if (filters.categoria_id) params.append("categoria_id", filters.categoria_id);
  if (filters.marca_id) params.append("marca_id", filters.marca_id);
  if (filters.q) params.append("q", filters.q);
  if (filters.limit) params.append("limit", filters.limit);
  if (filters.offset) params.append("offset", filters.offset);
  return params.toString();
}

/**
 * Función helper para hacer fetch con manejo de errores
 */
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChange'));
      }
      return options.returnArray !== false ? [] : null;
    }
    const data = await response.json();
    
    // Normalizar URLs de imágenes
    if (Array.isArray(data)) {
      return data.map(item => ({
        ...item,
        imagen_url: normalizeImageUrl(item.imagen_url)
      }));
    } else if (data && typeof data === 'object') {
      return {
        ...data,
        imagen_url: normalizeImageUrl(data.imagen_url)
      };
    }
    return data;
  } catch (error) {
    console.error("Error de conexión:", error);
    return options.returnArray !== false ? [] : null;
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ============================================================================
// PRODUCTOS
// ============================================================================

export async function fetchProteinaData(filters = {}) {
  if (!API_BASE_URL) return [];
  const params = new URLSearchParams();
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/api/proteinas?${queryString}` : `${API_BASE_URL}/api/proteinas`;
  return safeFetch(url);
}

export async function fetchProteinaById(id) {
  if (!API_BASE_URL) return null;
  return safeFetch(`${API_BASE_URL}/api/proteinas/${id}`, { returnArray: false });
}

export async function fetchProteinaNutricion(productoId) {
  if (!API_BASE_URL) return null;
  return safeFetch(`${API_BASE_URL}/api/proteinas/producto/${productoId}`, { returnArray: false });
}

export async function fetchCreatinaData(filters = {}) {
  if (!API_BASE_URL) return [];
  const params = new URLSearchParams();
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/api/creatinas?${queryString}` : `${API_BASE_URL}/api/creatinas`;
  return safeFetch(url);
}

export async function fetchPreentrenoData(filters = {}) {
  if (!API_BASE_URL) return [];
  const params = new URLSearchParams();
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}/api/preentrenos?${queryString}` : `${API_BASE_URL}/api/preentrenos`;
  return safeFetch(url);
}

export async function fetchSuplementoData(filters = {}) {
  if (!API_BASE_URL) return [];
  const params = new URLSearchParams();
  params.append("categoria_id", "7"); // Categoria Suplementos
  if (filters.min_price) params.append("min_price", filters.min_price);
  if (filters.max_price) params.append("max_price", filters.max_price);
  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/productos?${queryString}`;
  return safeFetch(url);
}

export async function fetchAllProductos(filters = {}) {
  if (!API_BASE_URL) return [];
  const queryString = buildQueryParams(filters);
  const url = queryString ? `${API_BASE_URL}/api/productos?${queryString}` : `${API_BASE_URL}/api/productos`;
  return safeFetch(url);
}

export async function searchProductos(query) {
  if (!API_BASE_URL || !query) return [];
  return safeFetch(`${API_BASE_URL}/api/productos/buscar?q=${encodeURIComponent(query)}`);
}

export async function fetchProductById(id, type = 'productos') {
  if (!API_BASE_URL) return null;
  const validTypes = ['productos', 'creatinas', 'preentrenos', 'proteinas'];
  if (!validTypes.includes(type)) return null;
  return safeFetch(`${API_BASE_URL}/api/${type}/${id}`, { returnArray: false });
}

// ============================================================================
// CATEGORÍAS Y MARCAS
// ============================================================================

export async function fetchCategorias() {
  if (!API_BASE_URL) return [];
  return safeFetch(`${API_BASE_URL}/api/categorias`);
}

export async function fetchMarcas() {
  if (!API_BASE_URL) return [];
  return safeFetch(`${API_BASE_URL}/api/marcas`);
}

// ============================================================================
// AUTENTICACIÓN
// ============================================================================

export async function login(email, password) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al iniciar sesión');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  window.dispatchEvent(new Event('authChange'));
  return data;
}

export async function register(nombre, email, password) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al registrarse');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  window.dispatchEvent(new Event('authChange'));
  return data;
}

export async function getCurrentUser() {
  if (!API_BASE_URL) return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('authChange'));
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function getStoredUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAdmin() {
  const user = getStoredUser();
  return user?.rol === 'admin';
}

// ============================================================================
// BOLETAS / PEDIDOS
// ============================================================================

export async function fetchBoletas() {
  if (!API_BASE_URL) return [];
  return safeFetch(`${API_BASE_URL}/api/boletas`, { headers: getAuthHeaders() });
}

export async function fetchBoletaById(id) {
  if (!API_BASE_URL) return null;
  const response = await fetch(`${API_BASE_URL}/api/boletas/${id}`, { headers: getAuthHeaders() });
  if (!response.ok) return null;
  const data = await response.json();
  if (data.items) {
    data.items = data.items.map(item => ({
      ...item,
      imagen_url: normalizeImageUrl(item.imagen_url)
    }));
  }
  return data;
}

export async function createBoleta(items, metodo_pago_id = null, direccion_envio = null, cupon_codigo = null) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  
  const response = await fetch(`${API_BASE_URL}/api/boletas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      items: items.map(item => ({
        producto_id: item.producto_id || item.id,
        cantidad: item.cantidad || item.quantity
      })),
      metodo_pago_id,
      direccion_envio,
      cupon_codigo
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al crear pedido');
  }
  return await response.json();
}

export async function updateBoletaEstado(id, estado) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  
  const response = await fetch(`${API_BASE_URL}/api/boletas/${id}/estado`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ estado })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al actualizar estado');
  }
  return await response.json();
}

// ============================================================================
// MÉTODOS DE PAGO Y CUPONES
// ============================================================================

export async function fetchMetodosPago() {
  if (!API_BASE_URL) return [];
  return safeFetch(`${API_BASE_URL}/api/metodos-pago`);
}

export async function validarCupon(codigo) {
  if (!API_BASE_URL) return null;
  const response = await fetch(`${API_BASE_URL}/api/cupones/validar/${encodeURIComponent(codigo)}`);
  if (!response.ok) return null;
  return await response.json();
}

// ============================================================================
// DIRECCIONES
// ============================================================================

export async function fetchDirecciones() {
  if (!API_BASE_URL) return [];
  return safeFetch(`${API_BASE_URL}/api/direcciones`, { headers: getAuthHeaders() });
}

export async function createDireccion(data) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  const response = await fetch(`${API_BASE_URL}/api/direcciones`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al crear dirección');
  }
  return await response.json();
}

// ============================================================================
// FAVORITOS
// ============================================================================

export async function fetchFavoritos() {
  if (!API_BASE_URL) return [];
  return safeFetch(`${API_BASE_URL}/api/favoritos`, { headers: getAuthHeaders() });
}

export async function addFavorito(producto_id) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  const response = await fetch(`${API_BASE_URL}/api/favoritos/${producto_id}`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al agregar favorito');
  }
  return await response.json();
}

export async function removeFavorito(producto_id) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  const response = await fetch(`${API_BASE_URL}/api/favoritos/${producto_id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al eliminar favorito');
  }
  return await response.json();
}

// ============================================================================
// RESEÑAS
// ============================================================================

export async function fetchResenas(producto_id) {
  if (!API_BASE_URL) return [];
  return safeFetch(`${API_BASE_URL}/api/resenas/producto/${producto_id}`);
}

export async function createResena(producto_id, calificacion, comentario) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  const response = await fetch(`${API_BASE_URL}/api/resenas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ producto_id, calificacion, comentario })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al crear reseña');
  }
  return await response.json();
}

// ============================================================================
// ADMIN - USUARIOS
// ============================================================================

export async function fetchUsuarios() {
  if (!API_BASE_URL) return [];
  return safeFetch(`${API_BASE_URL}/api/usuarios`, { headers: getAuthHeaders() });
}

export async function updateUsuario(id, data) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al actualizar usuario');
  }
  return await response.json();
}

export async function deleteUsuario(id) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al eliminar usuario');
  }
  return await response.json();
}

// ============================================================================
// ADMIN - PRODUCTOS
// ============================================================================

export async function createProducto(data) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  const response = await fetch(`${API_BASE_URL}/api/productos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al crear producto');
  }
  return await response.json();
}

export async function updateProducto(id, data) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  const response = await fetch(`${API_BASE_URL}/api/productos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al actualizar producto');
  }
  return await response.json();
}

export async function deleteProducto(id) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  const response = await fetch(`${API_BASE_URL}/api/productos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al eliminar producto');
  }
  return await response.json();
}

// ============================================================================
// REPORTES
// ============================================================================

export async function fetchDashboard() {
  if (!API_BASE_URL) return null;
  const response = await fetch(`${API_BASE_URL}/api/reportes/dashboard`, { headers: getAuthHeaders() });
  if (!response.ok) return null;
  return await response.json();
}

export async function downloadReporte(tipo, formato = 'excel', fechaInicio = null, fechaFin = null) {
  if (!API_BASE_URL) throw new Error('API no configurada');
  
  let url = `${API_BASE_URL}/api/reportes/${tipo}?formato=${formato}`;
  if (fechaInicio) url += `&fecha_inicio=${fechaInicio}`;
  if (fechaFin) url += `&fecha_fin=${fechaFin}`;
  
  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Error al descargar reporte');
  
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${tipo}_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export async function checkHealth() {
  if (!API_BASE_URL) return { status: 'error', message: 'API no configurada' };
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
