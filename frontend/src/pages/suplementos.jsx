import { useState, useEffect } from "react";
import { API_BASE_URL } from "../herramientas/config";
import Card from "../components/suplemento/card";

export default function SuplementosPage() {
  const [suplementos, setSuplementos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        if (!API_BASE_URL) return;
        // Obtener productos de la categoría 7 (Suplementos)
        const response = await fetch(`${API_BASE_URL}/api/productos?categoria_id=7`);
        const data = await response.json();
        setSuplementos(data);
      } catch (error) {
        console.error("Error al obtener suplementos:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerDatos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="px-10 py-20">
      <h1 className="text-3xl font-bold mb-6">SUPLEMENTOS</h1>
      <p>Aminoácidos, vitaminas y más para complementar tu nutrición deportiva. ¡Optimiza tu recuperación!</p>
      <div className="divider"></div>
      {suplementos.length === 0 ? (
        <p className="text-center text-gray-500">No hay suplementos disponibles</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {suplementos.map(suplemento => (
            <li key={suplemento.id}>
              <Card producto={suplemento} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
