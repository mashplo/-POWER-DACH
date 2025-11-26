// Configuración central de la URL base de la API
// En producción (deploy), NO hacemos fallback a localhost para evitar que el navegador
// solicite permiso de "red local" al intentar escanear/consultar dispositivos.
// En desarrollo local (hostname === 'localhost'), sí usamos el puerto 8000 como fallback.

const ENV_API = import.meta.env.VITE_API_URL;

export const API_BASE_URL = ENV_API && ENV_API.trim() !== ''
  ? ENV_API.replace(/\/$/, '') // quitar barra final si existe
  : (window.location.hostname === 'localhost' ? 'http://localhost:8000' : null);

// Helper para construir endpoints, lanza error claro si falta configuración en producción
export function apiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL no configurada. Define VITE_API_URL en el build.');
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
}
