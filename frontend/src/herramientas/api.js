import { API_BASE_URL } from './config.js';

/**
 * Función helper para construir query params
 * @param {Object} filters - Objeto con filtros
 * @returns {string} Query string formateado
 */
function buildQueryParams(filters) {
  const params = new URLSearchParams();

  // Soportar ambos formatos de nombre de parámetros
  const minPrice = filters.min_price ?? filters.minPrice;
  const maxPrice = filters.max_price ?? filters.maxPrice;

  if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
    params.append("min_price", minPrice);
  }

  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
    params.append("max_price", maxPrice);
  }

  if (filters.category && filters.category !== "") {
    params.append("category", filters.category);
  }

  if (filters.product_type && filters.product_type !== "") {
    params.append("product_type", filters.product_type);
  }

  if (filters.search && filters.search !== "") {
    params.append("search", filters.search);
  }

  return params.toString();
}

/**
 * Función helper para hacer fetch con manejo de errores
 * @param {string} url - URL a consultar
 * @returns {Promise<Array>} Datos obtenidos o array vacío en caso de error
 */
async function safeFetch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} ${response.statusText}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    return [];
  }
}

export async function fetchProteinaData(filters = {}) {
  if (!API_BASE_URL) return [];
  
  const BASE_URL = `${API_BASE_URL}/api/v1/products`;
  const queryString = buildQueryParams(filters);
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  
  return safeFetch(url);
}

export async function fetchCreatinaData(filters = {}) {
  if (!API_BASE_URL) return [];
  
  const BASE_URL = `${API_BASE_URL}/api/v1/creatinas`;
  const queryString = buildQueryParams(filters);
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  
  return safeFetch(url);
}

export async function fetchPreentrenoData(filters = {}) {
  if (!API_BASE_URL) return [];
  
  const BASE_URL = `${API_BASE_URL}/api/v1/preentrenos`;
  const queryString = buildQueryParams(filters);
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  
  return safeFetch(url);
}

/**
 * Obtiene un producto por ID y tipo
 * @param {string|number} id - ID del producto
 * @param {string} type - Tipo: 'products', 'creatinas', 'preentrenos'
 * @returns {Promise<Object|null>} Producto o null
 */
export async function fetchProductById(id, type = 'products') {
  if (!API_BASE_URL) return null;
  
  const validTypes = ['products', 'creatinas', 'preentrenos'];
  if (!validTypes.includes(type)) {
    console.error(`Tipo de producto inválido: ${type}`);
    return null;
  }
  
  const url = `${API_BASE_URL}/api/v1/${type}/${id}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) return null;
      console.error(`Error obteniendo producto: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    return null;
  }
}
