import { useState, useEffect, useRef } from "react";
import { API_BASE_URL, normalizeImageUrl } from "../../herramientas/config";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Cargar todos los productos al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        console.log("Cargando productos para búsqueda...");
        if (!API_BASE_URL) {
          console.warn('API_BASE_URL no configurada, omitiendo carga de productos en producción.');
          return;
        }
        const base = API_BASE_URL;
        const [proteinasRes, creatinasRes, preentrenosRes] = await Promise.all([
          fetch(`${base}/api/productos?categoria_id=1`),
          fetch(`${base}/api/creatinas`),
          fetch(`${base}/api/preentrenos`),
        ]);

        if (!proteinasRes.ok || !creatinasRes.ok || !preentrenosRes.ok) {
          console.error("Error en respuestas del servidor");
          return;
        }

        const proteinas = await proteinasRes.json();
        const creatinas = await creatinasRes.json();
        const preentrenos = await preentrenosRes.json();

        console.log("Proteínas cargadas:", proteinas.length);
        console.log("Creatinas cargadas:", creatinas.length);
        console.log("Pre-entrenos cargados:", preentrenos.length);

        const todosProductos = [
          ...proteinas.map((p) => ({ ...p, tipo: "proteina", categoria: "Proteína" })),
          ...creatinas.map((c) => ({ ...c, tipo: "creatina", categoria: "Creatina" })),
          ...preentrenos.map((pr) => ({ ...pr, tipo: "preentreno", categoria: "Pre-Entreno" })),
        ];

        console.log("Total productos cargados:", todosProductos.length);
        setProductos(todosProductos);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    cargarProductos();
  }, []);

  // Filtrar productos según el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      setShowSuggestions(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = productos.filter((producto) => {
      const nombre = (producto.nombre || "").toLowerCase();
      const categoria = producto.categoria.toLowerCase();
      const descripcion = (producto.descripcion || "").toLowerCase();

      return (
        nombre.includes(term) ||
        categoria.includes(term) ||
        descripcion.includes(term)
      );
    });

    console.log("Búsqueda:", term, "- Resultados:", filtered.length);
    setFilteredProducts(filtered.slice(0, 8)); // Limitar a 8 sugerencias
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchTerm, productos]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejar navegación con teclado
  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredProducts.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredProducts.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
        handleSelectProduct(filteredProducts[selectedIndex]);
      } else if (filteredProducts.length > 0) {
        handleSelectProduct(filteredProducts[0]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSelectProduct = (producto) => {
    setSearchTerm("");
    setShowSuggestions(false);
    navigate(`/${producto.tipo}/${producto.id}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredProducts([]);
    setShowSuggestions(false);
  };

  const highlightText = (text, term) => {
    if (!term) return text;

    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 text-black">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar productos... (Ej: whey, creatina, pre-entreno)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredProducts.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="input input-bordered w-full pl-10 pr-10 bg-white text-black"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Sugerencias */}
      {showSuggestions && filteredProducts.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-3 py-2">
              {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
            </p>
            {filteredProducts.map((producto, index) => (
              <div
                key={`${producto.tipo}-${producto.id}`}
                onClick={() => handleSelectProduct(producto)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${index === selectedIndex
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                  }`}
              >
                <img
                  src={normalizeImageUrl(producto.imagen_url)}
                  alt={producto.nombre}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMmU4ZjAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {highlightText(producto.nombre, searchTerm)}
                  </p>
                  <p
                    className={`text-xs ${index === selectedIndex ? "text-white/80" : "text-gray-500"
                      }`}
                  >
                    {producto.categoria}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${index === selectedIndex ? "text-white" : "text-primary"
                      }`}
                  >
                    S/ {producto.precio?.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {showSuggestions && searchTerm && filteredProducts.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50">
          <div className="text-center text-gray-500">
            <Search size={40} className="mx-auto mb-2 opacity-50" />
            <p className="font-semibold">No se encontraron productos</p>
            <p className="text-sm">
              Intenta con otro término de búsqueda
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
