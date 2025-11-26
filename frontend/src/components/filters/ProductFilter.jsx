import { useState } from "react";

export default function ProductFilter({ onFilterChange, onReset }) {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
    productType: "",
    search: "",
  });

  const handleInputChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      minPrice: "",
      maxPrice: "",
      category: "",
      productType: "",
      search: "",
    };
    setFilters(emptyFilters);
    onReset();
  };

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Filtrar Productos</h2>

      <form onSubmit={handleApplyFilters}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Búsqueda por nombre */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Buscar por nombre
              </span>
            </label>
            <input
              type="text"
              placeholder="Ej: Whey Protein"
              className="input input-bordered"
              value={filters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>

          {/* Precio Mínimo */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Precio Mínimo ($)
              </span>
            </label>
            <input
              type="number"
              placeholder="0"
              className="input input-bordered"
              value={filters.minPrice}
              onChange={(e) => handleInputChange("minPrice", e.target.value)}
              min="0"
            />
          </div>

          {/* Precio Máximo */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Precio Máximo ($)
              </span>
            </label>
            <input
              type="number"
              placeholder="300"
              className="input input-bordered"
              value={filters.maxPrice}
              onChange={(e) => handleInputChange("maxPrice", e.target.value)}
              min="0"
            />
          </div>

          {/* Tipo de Producto */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Tipo de Producto</span>
            </label>
            <select
              className="select select-bordered"
              value={filters.productType}
              onChange={(e) => handleInputChange("productType", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Proteína">Proteína</option>
              <option value="Creatina">Creatina</option>
            </select>
          </div>

          {/* Categoría */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Categoría</span>
            </label>
            <select
              className="select select-bordered"
              value={filters.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              <option value="">Todas</option>
              <optgroup label="Proteínas">
                <option value="Whey Protein">Whey Protein</option>
                <option value="Whey Isolate">Whey Isolate</option>
                <option value="Mass Gainer">Mass Gainer</option>
                <option value="Proteína Vegana">Proteína Vegana</option>
              </optgroup>
              <optgroup label="Creatinas">
                <option value="Monohidrato">Monohidrato</option>
                <option value="Micronizada">Micronizada</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-center mt-6">
          <button type="submit" className="btn btn-primary px-8">
            Aplicar Filtros
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-outline px-8"
          >
            Limpiar Filtros
          </button>
        </div>
      </form>

      {/* Filtros rápidos predefinidos */}
      <div className="divider">Filtros Rápidos</div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => {
            const quickFilters = {
              ...filters,
              minPrice: "",
              maxPrice: "",
              category: "",
              productType: "",
              search: "",
            };
            setFilters(quickFilters);
            onFilterChange(quickFilters);
          }}
        >
          Todos
        </button>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => {
            const quickFilters = {
              ...filters,
              minPrice: "120",
              maxPrice: "",
              category: "",
              productType: "",
              search: "",
            };
            setFilters(quickFilters);
            onFilterChange(quickFilters);
          }}
        >
          Precio &gt; $120
        </button>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => {
            const quickFilters = {
              ...filters,
              minPrice: "",
              maxPrice: "",
              category: "Whey Protein",
              productType: "",
              search: "",
            };
            setFilters(quickFilters);
            onFilterChange(quickFilters);
          }}
        >
          Whey Protein
        </button>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => {
            const quickFilters = {
              ...filters,
              minPrice: "",
              maxPrice: "",
              category: "Monohidrato",
              productType: "",
              search: "",
            };
            setFilters(quickFilters);
            onFilterChange(quickFilters);
          }}
        >
          Creatina Monohidrato
        </button>
      </div>
    </div>
  );
}
