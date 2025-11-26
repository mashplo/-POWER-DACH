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
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password })
    })
    
    const data = await response.json()
    return data
}

export async function loginUsuario(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    return data
}