import { useState, useEffect, useCallback } from "react";
import { fetchProteinaData, fetchCreatinaData, fetchPreentrenoData, fetchSuplementoData } from "../herramientas/api";
import ProteinaCard from "../components/proteina/card";
import CreatinaCard from "../components/creatina/card";
import PreentrenoCard from "../components/preentreno/card";
import SuplementoCard from "../components/suplemento/card";
import FilterSidebar from "../components/filters/FilterSidebar";
import SearchBar from "../components/layout/SearchBar";

export default function ProductosPage() {
  const [proteinas, setProteinas] = useState([]);
  const [creatinas, setCreatinas] = useState([]);
  const [preentrenos, setPreentrenos] = useState([]);
  const [suplementos, setSuplementos] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarProductos = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Separar el filtro de tipo de producto de los filtros reales
      const tipoProducto = filters.category; // "Proteína", "Creatina", "Pre-Entreno"
      
      // Crear filtros para el backend (sin el tipo de producto)
      const backendFilters = {};
      if (filters.min_price) backendFilters.min_price = filters.min_price;
      if (filters.max_price) backendFilters.max_price = filters.max_price;

      // Cargar proteínas con filtros
      try {
        if (!tipoProducto || tipoProducto === "Proteína") {
          const dataProteinas = await fetchProteinaData(backendFilters);
          setProteinas(dataProteinas || []);
        } else {
          setProteinas([]);
        }
      } catch (err) {
        console.error("Error cargando proteínas:", err);
        setProteinas([]);
      }

      // Cargar creatinas con filtros
      try {
        if (!tipoProducto || tipoProducto === "Creatina") {
          const dataCreatinas = await fetchCreatinaData(backendFilters);
          setCreatinas(dataCreatinas || []);
        } else {
          setCreatinas([]);
        }
      } catch (err) {
        console.error("Error cargando creatinas:", err);
        setCreatinas([]);
      }

      // Cargar pre-entrenos con filtros
      try {
        if (!tipoProducto || tipoProducto === "Pre-Entreno") {
          const dataPreentrenos = await fetchPreentrenoData(backendFilters);
          setPreentrenos(dataPreentrenos || []);
        } else {
          setPreentrenos([]);
        }
      } catch (err) {
        console.error("Error cargando pre-entrenos:", err);
        setPreentrenos([]);
      }

      // Cargar suplementos con filtros
      try {
        if (!tipoProducto || tipoProducto === "Suplementos") {
          const dataSuplementos = await fetchSuplementoData(backendFilters);
          setSuplementos(dataSuplementos || []);
        } else {
          setSuplementos([]);
        }
      } catch (err) {
        console.error("Error cargando suplementos:", err);
        setSuplementos([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error general cargando productos:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((filters) => {
    setActiveFilters(filters);
    cargarProductos(filters);
  }, []);

  useEffect(() => {
    cargarProductos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-xl">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error max-w-md">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-10 py-20">
      <h1 className="text-4xl font-bold mb-4">PRODUCTOS</h1>
      <p className="text-lg mb-6">
        Descubre nuestra selección completa de suplementos de calidad premium
        para potenciar tu rendimiento.
      </p>

      {/* Barra de Búsqueda */}
      <div className="mb-8 flex justify-center">
        <SearchBar />
      </div>

      <div className="flex gap-8">
        {/* Sidebar de Filtros */}
        <aside className="flex-shrink-0">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1">
          {/* Sección de Proteínas */}
          {(!activeFilters.category ||
            activeFilters.category === "Proteína") && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-4">PROTEÍNAS</h2>
              <p className="mb-6">
                Potencia tu rendimiento con nuestros suplementos de proteínas de
                calidad premium.
              </p>
              <div className="divider"></div>
              {proteinas.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xl text-gray-500">
                    No se encontraron proteínas con los filtros seleccionados.
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {proteinas.map((producto) => (
                    <li key={producto.id}>
                      <ProteinaCard producto={producto} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Sección de Creatinas */}
          {(!activeFilters.category ||
            activeFilters.category === "Creatina") && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-4">CREATINAS</h2>
              <p className="mb-6">
                Maximiza tu fuerza y rendimiento con nuestras creatinas de
                máxima calidad.
              </p>
              <div className="divider"></div>
              {creatinas.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xl text-gray-500">
                    No se encontraron creatinas con los filtros seleccionados.
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {creatinas.map((creatina) => (
                    <li key={creatina.id}>
                      <CreatinaCard producto={creatina} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Sección de Pre-Entrenos */}
          {(!activeFilters.category ||
            activeFilters.category === "Pre-Entreno") && (
            <section>
              <h2 className="text-3xl font-bold mb-4">PRE-ENTRENOS</h2>
              <p className="mb-6">
                Potencia tu energía y concentración con nuestros pre-entrenos de
                alto rendimiento.
              </p>
              <div className="divider"></div>
              {preentrenos.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xl text-gray-500">
                    No se encontraron pre-entrenos con los filtros
                    seleccionados.
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {preentrenos.map((preentreno) => (
                    <li key={preentreno.id}>
                      <PreentrenoCard producto={preentreno} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Sección de Suplementos */}
          {(!activeFilters.category ||
            activeFilters.category === "Suplementos") && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-4">SUPLEMENTOS</h2>
              <p className="mb-6">
                Aminoácidos, vitaminas y más para complementar tu nutrición deportiva.
              </p>
              <div className="divider"></div>
              {suplementos.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xl text-gray-500">
                    No se encontraron suplementos con los filtros seleccionados.
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {suplementos.map((suplemento) => (
                    <li key={suplemento.id}>
                      <SuplementoCard producto={suplemento} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
