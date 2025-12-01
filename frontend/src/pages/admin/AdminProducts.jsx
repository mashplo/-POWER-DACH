import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminProducts() {
    const [activeTab, setActiveTab] = useState("productos"); // productos, creatinas, preentrenos
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [activeTab]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Mapear tab a endpoint
            let endpoint = "products"; // default
            if (activeTab === "creatinas") endpoint = "creatinas";
            if (activeTab === "preentrenos") endpoint = "preentrenos";

            const response = await fetch(`http://localhost:8000/api/v1/${endpoint}`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            toast.error("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            const response = await fetch(`http://localhost:8000/api/v1/${activeTab}/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success("Producto eliminado");
                fetchProducts();
            } else {
                toast.error("Error al eliminar");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const method = isCreating ? "POST" : "PUT";
        const url = isCreating
            ? `http://localhost:8000/api/v1/${activeTab}`
            : `http://localhost:8000/api/v1/${activeTab}/${editingProduct.id}`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingProduct),
            });
            if (response.ok) {
                toast.success(isCreating ? "Producto creado" : "Producto actualizado");
                setEditingProduct(null);
                setIsCreating(false);
                fetchProducts();
            } else {
                toast.error("Error al guardar");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    const openCreateModal = () => {
        setEditingProduct({
            title: "",
            description: "",
            price: 0,
            images: "",
            category: ""
        });
        setIsCreating(true);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gestión de Productos</h2>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {["productos", "creatinas", "preentrenos"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === tab
                                ? "border-b-2 border-indigo-500 text-indigo-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="mb-4 flex justify-end">
                <button
                    onClick={openCreateModal}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    + Nuevo Producto
                </button>
            </div>

            {loading ? (
                <div>Cargando...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {product.images && product.images.length > 0 && (
                                            <img src={product.images[0]} alt={product.title} className="h-10 w-10 object-cover rounded" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">S/ {product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                // Convertir array de imagenes a string para el form si es necesario
                                                // Pero el backend espera string separado por comas en DB, pero el endpoint devuelve array
                                                // Al enviar, el backend espera string en el modelo ProductIn?
                                                // Revisando app.py: ProductIn tiene images: str.
                                                // El endpoint GET devuelve images como lista.
                                                // Debemos convertir la lista a string para editar.
                                                const imagesStr = Array.isArray(product.images) ? product.images.join(",") : product.images;
                                                setEditingProduct({ ...product, images: imagesStr });
                                                setIsCreating(false);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit/Create Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">{isCreating ? "Crear Producto" : "Editar Producto"}</h3>
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingProduct.title}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={editingProduct.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={editingProduct.price}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                        <input
                                            type="text"
                                            required
                                            value={editingProduct.category}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Imágenes (URLs separadas por coma)</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingProduct.images}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, images: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Ej: http://url1.com,http://url2.com</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
