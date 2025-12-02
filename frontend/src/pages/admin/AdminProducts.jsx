import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL, normalizeImageUrl } from "../../herramientas/config";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
    const { type } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        images: "",
        category: ""
    });

    useEffect(() => {
        fetchProducts();
    }, [type]);

    // Mapear tipo de URL a endpoint del API
    const getEndpoint = () => {
        switch (type) {
            case 'productos': return 'products';
            case 'creatinas': return 'creatinas';
            case 'preentrenos': return 'preentrenos';
            default: return type;
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const endpoint = getEndpoint();
            const response = await fetch(`${API_BASE_URL}/api/v1/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error al obtener productos:", error);
            toast.error("Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title,
                description: product.description,
                price: product.price,
                images: Array.isArray(product.images) ? product.images.join(",") : product.images,
                category: product.category
            });
        } else {
            setEditingProduct(null);
            setFormData({
                title: "",
                description: "",
                price: "",
                images: "",
                category: type === 'productos' ? 'Proteína' : type === 'creatinas' ? 'Creatina' : 'Pre-Entreno'
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = getEndpoint();
            const url = editingProduct
                ? `${API_BASE_URL}/api/v1/${endpoint}/${editingProduct.id}`
                : `${API_BASE_URL}/api/v1/${endpoint}`;

            const method = editingProduct ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price)
                })
            });

            if (response.ok) {
                toast.success(editingProduct ? "Producto actualizado" : "Producto creado");
                setModalOpen(false);
                fetchProducts();
            } else {
                toast.error("Error al guardar el producto");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            const endpoint = getEndpoint();
            const response = await fetch(`${API_BASE_URL}/api/v1/${endpoint}/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (response.ok) {
                toast.success("Producto eliminado");
                fetchProducts();
            } else {
                toast.error("Error al eliminar");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión");
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'productos': return 'Proteínas';
            case 'creatinas': return 'Creatinas';
            case 'preentrenos': return 'Pre-entrenos';
            default: return 'Productos';
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando productos...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de {getTitle()}</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary gap-2"
                >
                    <Plus size={20} /> Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={normalizeImageUrl(product.images)}
                                        alt={product.title}
                                        className="h-10 w-10 rounded object-cover"
                                        onError={(e) => e.target.src = "https://via.placeholder.com/40?text=Error"}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">S/ {product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="input input-bordered w-full mt-1"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    required
                                    className="textarea textarea-bordered w-full mt-1"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="input input-bordered w-full mt-1"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                    <input
                                        type="text"
                                        required
                                        className="input input-bordered w-full mt-1"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">URL Imagen</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full mt-1"
                                    value={formData.images}
                                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                    placeholder="http://..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
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
