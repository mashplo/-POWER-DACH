import { useState, useEffect } from "react";
import Card from "../components/creatina/card";

export default function CreatinaShoppingCart() {
  const [creatinas, setCreatinas] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/creatinas");
        const data = await response.json();
        setCreatinas(data);
      } catch (error) {
        console.error("Error al obtener creatinas:", error);
      }
    };
    obtenerDatos();
  }, []);

  return (
    <div className="px-10 py-20">
      <h1 className="text-3xl font-bold mb-6">CREATINAS</h1>
      <p>Maximiza tu fuerza y rendimiento con nuestras creatinas de máxima calidad. ¡Impulsa tu potencia ahora!</p>
      <div className="divider"></div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {creatinas.map(creatina => (
          <li key={creatina.id}>
            <Card producto={creatina} />
          </li>
        ))}
      </ul>
    </div>
  );
}
