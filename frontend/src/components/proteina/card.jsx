import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Card({ producto }) {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => [...prevCarrito, producto.id]);
    toast.success(`${producto.title} agregado al carrito`);
  };

  return (
    <div className="card rounded-lg shadow-md">
      <img src={producto.images[0]} alt={producto.title} className="card-image" />
      <div className="card-content px-5 py-4 flex flex-col gap-1">
        <h2 className="card-title">{producto.title}</h2>
        <p className="card-description">{producto.description}</p>
        <p className="card-price">S/{producto.price}</p>
        <button onClick={() => agregarAlCarrito(producto)} className="card-button btn w-full btn-primary">Agregar al carrito</button>
      </div>
    </div>
  );
}