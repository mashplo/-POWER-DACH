const API_URL = 'http://localhost:8000/api'

export async function getUsuario(id) {
    const usuarioActual = localStorage.getItem("usuarioActual")
    
    if (usuarioActual) {
        return JSON.parse(usuarioActual)
    }
    
    return { id: 0, nombre: "John Doe" }
}

export async function getCarrito(id) {
    const carrito = localStorage.getItem('carrito');
    
    if (carrito === null) {
        const ejemploCarrito = [];
        localStorage.setItem('carrito', JSON.stringify(ejemploCarrito));
        return ejemploCarrito;
    }

    return JSON.parse(carrito);
}

export async function registrarUsuario(nombre, email, password) {
    // Usar localStorage mientras no tengamos backend de usuarios
    const usuarios = localStorage.getItem("usuarios")
        ? JSON.parse(localStorage.getItem("usuarios"))
        : [];

    // Verificar si el email ya existe
    const usuarioExistente = usuarios.find((u) => u.email === email);
    if (usuarioExistente) {
        return { success: false, error: "El email ya está registrado" };
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        password: password, // En producción esto debería estar hasheado
        fechaRegistro: new Date().toISOString(),
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    return {
        success: true,
        message: "Usuario registrado exitosamente",
        usuario: nuevoUsuario,
    };
}

export async function loginUsuario(email, password) {
    // Usar localStorage mientras no tengamos backend de usuarios
    const usuarios = localStorage.getItem("usuarios")
        ? JSON.parse(localStorage.getItem("usuarios"))
        : [];

    // Buscar usuario por email y password
    const usuario = usuarios.find(
        (u) => u.email === email && u.password === password
    );

    if (!usuario) {
        return { success: false, error: "Email o contraseña incorrectos" };
    }

    // Guardar sesión actual
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));

    return {
        success: true,
        message: "Sesión iniciada exitosamente",
        usuario: usuario,
    };
}

export async function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    return { success: true, message: "Sesión cerrada" };
}

export async function obtenerUsuarioActual() {
    const usuario = localStorage.getItem("usuarioActual");
    return usuario ? JSON.parse(usuario) : null;
}