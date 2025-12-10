// Configuración central de la URL base de la API
// En producción (deploy), NO hacemos fallback a localhost para evitar que el navegador
// solicite permiso de "red local" al intentar escanear/consultar dispositivos.
// En desarrollo local (hostname === 'localhost' o '127.0.0.1'), sí usamos el puerto 8000 como fallback.

const ENV_API = import.meta.env.VITE_API_URL;

const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE_URL = ENV_API && ENV_API.trim() !== ''
  ? ENV_API.replace(/\/$/, '') // quitar barra final si existe
  : (isLocalDev ? 'http://localhost:8000' : null);

// Helper para construir endpoints, lanza error claro si falta configuración en producción
export function apiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL no configurada. Define VITE_API_URL en el build.');
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
}

/**
 * Normaliza una URL de imagen para que funcione correctamente.
 * Convierte URLs absolutas con localhost/127.0.0.1 a URLs relativas usando API_BASE_URL.
 * @param {string} imageUrl - URL de la imagen
 * @returns {string} URL normalizada
 */
export function normalizeImageUrl(imageUrl) {
  if (!imageUrl) return 'https://via.placeholder.com/150?text=Sin+imagen';
  
  // Si es un array, tomar el primer elemento
  if (Array.isArray(imageUrl)) {
    imageUrl = imageUrl[0] || '';
  }
  
  // Si ya es una URL completa externa (no localhost), devolverla tal cual
  if (imageUrl.startsWith('http') && 
      !imageUrl.includes('localhost') && 
      !imageUrl.includes('127.0.0.1')) {
    return imageUrl;
  }
  
  // Extraer el path relativo (ej: /assets/productos/imagen.webp)
  let relativePath = imageUrl;
  
  // Remover prefijos de localhost o 127.0.0.1
  relativePath = relativePath
    .replace(/^https?:\/\/localhost:\d+/, '')
    .replace(/^https?:\/\/127\.0\.0\.1:\d+/, '');
  
  // Asegurar que empiece con /
  if (!relativePath.startsWith('/')) {
    relativePath = '/' + relativePath;
  }
  
  // Construir URL completa con API_BASE_URL
  return API_BASE_URL ? `${API_BASE_URL}${relativePath}` : relativePath;
}
