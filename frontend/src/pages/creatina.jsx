import { useState, useEffect } from "react";
import { API_BASE_URL } from "../herramientas/config";
import Card from "../components/creatina/card";

export default function CreatinaShoppingCart() {
  const [creatinas, setCreatinas] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        if (!API_BASE_URL) return;
        const response = await fetch(`${API_BASE_URL}/api/v1/creatinas`);
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
