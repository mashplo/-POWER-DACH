import { useState, useEffect } from "react";
import { fetchProteinaData } from "../herramientas/api";
import Card from "../components/proteina/card";

export default function ProteinaShoppingCart() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const data = await fetchProteinaData();
      setProductos(data);
    };
    obtenerDatos();
  }, []);

  return (
    <div className="px-10 py-20">
      <h1 className="text-3xl font-bold mb-6">PROTEÍNAS</h1>
      <p>Potencia tu rendimiento con nuestros suplementos de proteínas de calidad premium. ¡Optimiza tu entrenamiento ahora!</p>
      <div className="divider"></div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map(producto => (
          <li key={producto.id}>
            <Card producto={producto} />
          </li>
        ))}
      </ul>
    </div>
  );
}