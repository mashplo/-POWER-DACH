import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FilterSidebar({ onFilterChange }) {
  const [categoria, setCategoria] = useState("");
  const [precioMin, setPrecioMin] = useState(() => {
    const saved = localStorage.getItem("filtro_precioMin");
    return saved ? parseInt(saved) : 39;
  });
  const [precioMax, setPrecioMax] = useState(() => {
    const saved = localStorage.getItem("filtro_precioMax");
    return saved ? parseInt(saved) : 350;
  });
  const [precioAplicado, setPrecioAplicado] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categoria: true,
    precio: true,
  });

  // Guardar precios en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("filtro_precioMin", precioMin.toString());
    localStorage.setItem("filtro_precioMax", precioMax.toString());
  }, [precioMin, precioMax]);

  // Categorías disponibles
  const categorias = ["Proteína", "Creatina", "Pre-Entreno", "Suplementos"];

  // Aplicar filtros manualmente
  const aplicarFiltros = () => {
    const filters = {};

    if (categoria) {
      filters.category = categoria;
    }

    // Siempre aplicar filtros de precio
    filters.min_price = precioMin;
    filters.max_price = precioMax;

    setPrecioAplicado(true);
    onFilterChange(filters);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePrecioMinChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= precioMax) {
      setPrecioMin(value);
    }
  };

  const handlePrecioMaxChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= precioMin) {
      setPrecioMax(value);
    }
  };

  const resetFilters = () => {
    setCategoria("");
    setPrecioMin(39);
    setPrecioMax(350);
    setPrecioAplicado(false);
    localStorage.removeItem("filtro_precioMin");
    localStorage.removeItem("filtro_precioMax");
    onFilterChange({});
  };

  const handleCategoriaChange = (cat) => {
    setCategoria(cat);
    // Aplicar filtro de categoría inmediatamente
    const filters = { category: cat };
    // Mantener filtros de precio si fueron aplicados
    if (precioAplicado) {
      filters.min_price = precioMin;
      filters.max_price = precioMax;
    }
    onFilterChange(filters);
  };

  const handleMostrarTodas = () => {
    setCategoria("");
    const filters = {};
    // Mantener filtros de precio si fueron aplicados
    if (precioAplicado) {
      filters.min_price = precioMin;
      filters.max_price = precioMax;
    }
    onFilterChange(filters);
  };

  return (
    <div className="w-64 bg-base-100 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Filtros</h2>
        {(categoria || precioAplicado) && (
          <button onClick={resetFilters} className="btn btn-ghost btn-xs">
            Limpiar
          </button>
        )}
      </div>

      <div className="divider my-2"></div>

      {/* Filtro de Categoría */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("categoria")}
          className="flex items-center justify-between w-full text-left font-semibold text-lg mb-3"
        >
          <span>Categoría</span>
          {expandedSections.categoria ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>

        {expandedSections.categoria && (
          <div className="space-y-2">
            {categorias.map((cat) => {
              const isActive = categoria === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoriaChange(cat)}
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all w-full text-left ${
                    isActive
                      ? "bg-blue-600 text-white font-bold shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-all ${
                      isActive
                        ? "bg-white"
                        : "border-2 border-gray-400 bg-white/0"
                    }`}
                  ></div>
                  <span className="text-base">{cat}</span>
                </button>
              );
            })}
            {categoria && (
              <button
                onClick={handleMostrarTodas}
                className="btn btn-ghost btn-xs w-full mt-2"
              >
                Mostrar Todas
              </button>
            )}
          </div>
        )}
      </div>

      <div className="divider my-2"></div>

      {/* Filtro de Precio */}
      <div>
        <button
          onClick={() => toggleSection("precio")}
          className="flex items-center justify-between w-full text-left font-semibold text-lg mb-3"
        >
          <span>Rangos de precio</span>
          {expandedSections.precio ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>

        {expandedSections.precio && (
          <div>
            {/* Slider de rango */}
            <div className="mb-4">
              <input
                type="range"
                min="39"
                max="350"
                value={precioMin}
                onChange={handlePrecioMinChange}
                className="range range-primary range-xs mb-2"
              />
              <input
                type="range"
                min="39"
                max="350"
                value={precioMax}
                onChange={handlePrecioMaxChange}
                className="range range-primary range-xs"
              />
            </div>

            {/* Mostrar rango actual */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>S/ {precioMin}.00</span>
              <span>S/ {precioMax}.00</span>
            </div>

            {/* Inputs de texto para precio */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xs">S/ Min</span>
                </label>
                <input
                  type="number"
                  value={precioMin}
                  onChange={handlePrecioMinChange}
                  min="39"
                  max="350"
                  className="input input-bordered input-sm w-full"
                />
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text text-xs">S/ Max</span>
                </label>
                <input
                  type="number"
                  value={precioMax}
                  onChange={handlePrecioMaxChange}
                  min="39"
                  max="350"
                  className="input input-bordered input-sm w-full"
                />
              </div>
            </div>

            {/* Botón Aplicar Filtros */}
            <button
              onClick={aplicarFiltros}
              className="btn btn-primary btn-sm w-full mt-4"
            >
              Aplicar Filtros de Precio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
