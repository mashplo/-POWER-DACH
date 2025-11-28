import { API_BASE_URL } from "./config.js";
// Endpoints reales (migrado a /api/v2/auth/*)
const REGISTER_URL = API_BASE_URL
  ? `${API_BASE_URL}/api/v2/auth/register`
  : null;
const LOGIN_URL = API_BASE_URL ? `${API_BASE_URL}/api/v2/auth/login` : null;
const ME_URL = API_BASE_URL ? `${API_BASE_URL}/api/v2/auth/me` : null;

export async function getUsuario(id) {
  const usuarioActual = localStorage.getItem("usuarioActual");

  if (usuarioActual) {
    return JSON.parse(usuarioActual);
  }

  return { id: 0, nombre: "John Doe" };
}

export async function getCarrito(id) {
  const carrito = localStorage.getItem("carrito");

  if (carrito === null) {
    const ejemploCarrito = [];
    localStorage.setItem("carrito", JSON.stringify(ejemploCarrito));
    return ejemploCarrito;
  }

  return JSON.parse(carrito);
}

export async function registrarUsuario(nombre, email, password) {
  // Si no hay backend configurado, usar fallback localStorage
  if (!REGISTER_URL) {
    const usuarios = localStorage.getItem("usuarios")
      ? JSON.parse(localStorage.getItem("usuarios"))
      : [];
    const usuarioExistente = usuarios.find((u) => u.email === email);
    if (usuarioExistente) {
      return { success: false, error: "El email ya está registrado" };
    }
    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      email,
      password,
      fechaRegistro: new Date().toISOString(),
    };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return {
      success: true,
      message: "Usuario registrado (local)",
      usuario: nuevoUsuario,
    };
  }
  try {
    const resp = await fetch(REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    if (!resp.ok) {
      const dataErr = await resp.json().catch(() => ({}));
      return { success: false, error: dataErr.detail || "Error en registro" };
    }
    const user = await resp.json();
    // No se devuelve token en register; dejamos que el usuario inicie sesión separado
    return {
      success: true,
      message: "Usuario registrado en backend",
      usuario: user,
    };
  } catch (e) {
    return { success: false, error: "Fallo de conexión al registrar" };
  }
}

export async function loginUsuario(email, password) {
  if (!LOGIN_URL) {
    const usuarios = localStorage.getItem("usuarios")
      ? JSON.parse(localStorage.getItem("usuarios"))
      : [];
    const usuario = usuarios.find(
      (u) => u.email === email && u.password === password
    );
    if (!usuario)
      return {
        success: false,
        error: "Email o contraseña incorrectos (local)",
      };
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    return { success: true, message: "Sesión local iniciada", usuario };
  }
  try {
    // Solicitar token
    const resp = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) {
      const dataErr = await resp.json().catch(() => ({}));
      return {
        success: false,
        error: dataErr.detail || "Credenciales inválidas",
      };
    }
    const tokenData = await resp.json();
    const token = tokenData.access_token;
    // Obtener datos del usuario
    const meResp = await fetch(ME_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meResp.ok) {
      return { success: false, error: "No se pudo obtener perfil" };
    }
    const user = await meResp.json();
    // Guardar token en dos claves por compatibilidad:
    // - 'auth_token' (string) usado históricamente
    // - 'token' (JSON { access_token }) que usan los componentes admin
    localStorage.setItem("auth_token", token);
    localStorage.setItem("token", JSON.stringify({ access_token: token }));
    localStorage.setItem("usuarioActual", JSON.stringify(user));
    return { success: true, message: "Sesión iniciada", usuario: user, token };
  } catch (e) {
    return { success: false, error: "Fallo de conexión al iniciar sesión" };
  }
}

export async function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  localStorage.removeItem("auth_token");
  return { success: true, message: "Sesión cerrada" };
}

export async function obtenerUsuarioActual() {
  const usuario = localStorage.getItem("usuarioActual");
  return usuario ? JSON.parse(usuario) : null;
}
