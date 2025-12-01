// Funciones para manejar el carrito de compras

// Función para disparar evento de actualización del carrito
function dispararEventoCarrito() {
  window.dispatchEvent(new Event('carritoActualizado'));
}

export function addItemCarrito({ id, title, price, image, tipo }) {
  const carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
  
  const index = carrito.findIndex((i) => String(i.id) === String(id) && i.tipo === tipo);
  
  if (index === -1) {
    carrito.push({ 
      id, 
      title, 
      price, 
      image, 
      tipo, // "proteina", "creatina", "preentreno"
      cantidad: 1 
    });
  } else {
    carrito[index].cantidad = (carrito[index].cantidad || 0) + 1;
  }
  
  localStorage.setItem("carrito", JSON.stringify(carrito));
  dispararEventoCarrito();
  return carrito;
}

export function changeItemCantidad({ id, tipo, delta }) {
  // delta puede ser positivo o negativo (+1 o -1)
  const carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
  
  const index = carrito.findIndex((i) => String(i.id) === String(id) && i.tipo === tipo);
  
  if (index === -1) return carrito;

  carrito[index].cantidad = (carrito[index].cantidad || 0) + delta;
  
  if (carrito[index].cantidad <= 0) {
    // eliminar del carrito
    carrito.splice(index, 1);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  dispararEventoCarrito();
  return carrito;
}

export function removeItemCarrito({ id, tipo }) {
  const carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
  
  const nuevo = carrito.filter((i) => !(String(i.id) === String(id) && i.tipo === tipo));
  
  localStorage.setItem("carrito", JSON.stringify(nuevo));
  dispararEventoCarrito();
  return nuevo;
}

export function getCarrito() {
  try {
    const carrito = localStorage.getItem("carrito")
      ? JSON.parse(localStorage.getItem("carrito"))
      : [];
    
    // Validar que cada item tenga las propiedades necesarias
    return carrito.filter(item => 
      item && 
      item.id !== undefined && 
      item.title && 
      item.price !== undefined && 
      item.cantidad !== undefined
    );
  } catch (error) {
    console.error("Error al cargar carrito:", error);
    localStorage.removeItem("carrito");
    return [];
  }
}

export function clearCarrito() {
  localStorage.removeItem("carrito");
  dispararEventoCarrito();
  return [];
}

export function getCarritoCount() {
  const carrito = getCarrito();
  return carrito.reduce((total, item) => total + (parseInt(item.cantidad) || 0), 0);
}

export function getCarritoTotal() {
  const carrito = getCarrito();
  return carrito.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const cantidad = parseInt(item.cantidad) || 0;
    return total + (price * cantidad);
  }, 0);
}
