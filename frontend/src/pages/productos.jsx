import { useState, useEffect } from "react";
import { fetchProteinaData } from "../herramientas/api";
import ProteinaCard from "../components/proteina/card";
import CreatinaCard from "../components/creatina/card";

export default function ProductosPage() {
  const [proteinas, setProteinas] = useState([]);
  const [creatinas, setCreatinas] = useState([]);

  const cargarProteinas = async (minPrice) => {
    const dataProteinas = await fetchProteinaData(minPrice);
    setProteinas(dataProteinas);
  };

  const cargarCreatinas = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/creatinas");
      const dataCreatinas = await response.json();
      setCreatinas(dataCreatinas);
    } catch (error) {
      console.error("Error al obtener creatinas:", error);
    }
  };

  useEffect(() => {
    cargarProteinas();
    cargarCreatinas();
  }, []);

  return (
    <div className="px-10 py-20">
      <h1 className="text-4xl font-bold mb-4">PRODUCTOS</h1>
      <p className="text-lg mb-8">Descubre nuestra selección completa de suplementos de calidad premium para potenciar tu rendimiento.</p>
      
      {/* Sección de Proteínas */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-4">PROTEÍNAS</h2>
        <p className="mb-6">Potencia tu rendimiento con nuestros suplementos de proteínas de calidad premium.</p>
        <div className="flex gap-4 mb-6">
          <button className="btn btn-outline btn-sm" onClick={() => cargarProteinas()}>Todos</button>
          <button className="btn btn-primary btn-sm" onClick={() => cargarProteinas(120)}>Filtrar precio &gt; 120</button>
        </div>
        <div className="divider"></div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {proteinas.map(producto => (
            <li key={producto.id}>
              <ProteinaCard producto={producto} />
            </li>
          ))}
        </ul>
      </section>

      {/* Sección de Creatinas */}
      <section>
        <h2 className="text-3xl font-bold mb-4">CREATINAS</h2>
        <p className="mb-6">Maximiza tu fuerza y rendimiento con nuestras creatinas de máxima calidad.</p>
        <div className="divider"></div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {creatinas.map(creatina => (
            <li key={creatina.id}>
              <CreatinaCard producto={creatina} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
