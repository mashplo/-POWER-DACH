import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL, normalizeImageUrl } from "../../herramientas/config";
import { Plus, Edit, Trash2, X, Download, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
    const { type } = useParams();
    const [products, setProducts] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen_url: "",
        stock: 0,
        categoria_id: "",
        marca_id: "",
        sabor: "",
        tamano: "",
        tipo_creatina: "Monohidratada",
        gramos_por_porcion: "",
        porciones: "",
        certificaciones: "",
        cafeina_mg: "",
        beta_alanina: false,
        citrulina: false,
        nivel_estimulante: "moderado"
    });

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        fetchProducts();
        fetchCategorias();
        fetchMarcas();
    }, [type]);

    const getEndpoint = () => {
        switch (type) {
            case 'productos': return 'proteinas';
            case 'creatinas': return 'creatinas';
            case 'preentrenos': return 'preentrenos';
            case 'suplementos': return 'productos?categoria_id=7';
            default: return 'proteinas';
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'productos': return 'Proteínas';
            case 'creatinas': return 'Creatinas';
            case 'preentrenos': return 'Pre-entrenos';
            case 'suplementos': return 'Suplementos';
            default: return 'Productos';
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const endpoint = getEndpoint();
            const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, { headers });
            if (!response.ok) throw new Error("Error al cargar productos");
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al cargar productos");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categorias`);
            const data = await response.json();
            setCategorias(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    const fetchMarcas = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/marcas`);
            const data = await response.json();
            setMarcas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar marcas:", error);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                nombre: product.nombre || "",
                descripcion: product.descripcion || "",
                precio: product.precio || "",
                imagen_url: product.imagen_url || "",
                stock: product.stock || 0,
                categoria_id: product.categoria_id || "",
                marca_id: product.marca_id || "",
                sabor: product.sabor || "",
                tamano: product.tamano || "",
                tipo_creatina: product.tipo_creatina || "Monohidratada",
                gramos_por_porcion: product.gramos_por_porcion || "",
                porciones: product.porciones || "",
                certificaciones: product.certificaciones || "",
                cafeina_mg: product.cafeina_mg || "",
                beta_alanina: product.beta_alanina || false,
                citrulina: product.citrulina || false,
                nivel_estimulante: product.nivel_estimulante || "moderado"
            });
        } else {
            setEditingProduct(null);
            const defaultCategoria = type === 'creatinas' ? 2 : type === 'preentrenos' ? 3 : 1;
            setFormData({
                nombre: "", descripcion: "", precio: "", imagen_url: "", stock: 0,
                categoria_id: defaultCategoria, marca_id: "", sabor: "", tamano: "",
                tipo_creatina: "Monohidratada", gramos_por_porcion: "", porciones: "",
                certificaciones: "", cafeina_mg: "", beta_alanina: false, citrulina: false,
                nivel_estimulante: "moderado"
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nombre.trim()) { toast.error("El nombre es obligatorio"); return; }
        if (!formData.precio || parseFloat(formData.precio) <= 0) { toast.error("Precio debe ser mayor a 0"); return; }

        try {
            const productPayload = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio),
                categoria_id: parseInt(formData.categoria_id) || 1,
                marca_id: formData.marca_id ? parseInt(formData.marca_id) : null,
                imagen_url: formData.imagen_url,
                stock: parseInt(formData.stock) || 0,
                sabor: formData.sabor || null,
                tamano: formData.tamano || null
            };

            const productId = editingProduct?.producto_id || editingProduct?.id;
            const url = editingProduct ? `${API_BASE_URL}/api/productos/${productId}` : `${API_BASE_URL}/api/productos`;
            const method = editingProduct ? "PUT" : "POST";

            const response = await fetch(url, { method, headers, body: JSON.stringify(productPayload) });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Error al guardar");
            }

            const savedProduct = await response.json();

            // Si es un producto NUEVO, crear el registro en la tabla especializada
            if (!editingProduct && savedProduct.id) {
                const productoId = savedProduct.id;
                
                if (type === 'productos' || type === 'proteinas') {
                    // Crear registro en proteinas
                    await fetch(`${API_BASE_URL}/api/proteinas`, {
                        method: "POST", headers,
                        body: JSON.stringify({
                            producto_id: productoId,
                            tipo_proteina: "Whey",
                            proteina_por_porcion: 25,
                            calorias_por_porcion: 120,
                            porciones: 30
                        })
                    });
                } else if (type === 'creatinas') {
                    // Crear registro en creatinas
                    await fetch(`${API_BASE_URL}/api/creatinas`, {
                        method: "POST", headers,
                        body: JSON.stringify({
                            producto_id: productoId,
                            tipo_creatina: formData.tipo_creatina || "Monohidratada",
                            gramos_por_porcion: formData.gramos_por_porcion ? parseFloat(formData.gramos_por_porcion) : 5,
                            porciones: formData.porciones ? parseInt(formData.porciones) : 60,
                            certificaciones: formData.certificaciones || null
                        })
                    });
                } else if (type === 'preentrenos') {
                    // Crear registro en preentrenos
                    await fetch(`${API_BASE_URL}/api/preentrenos`, {
                        method: "POST", headers,
                        body: JSON.stringify({
                            producto_id: productoId,
                            cafeina_mg: formData.cafeina_mg ? parseInt(formData.cafeina_mg) : 200,
                            beta_alanina: formData.beta_alanina || false,
                            citrulina: formData.citrulina || false,
                            nivel_estimulante: formData.nivel_estimulante || "moderado"
                        })
                    });
                }
                // Suplementos no necesitan tabla especializada
            }

            // Actualizar especialización si aplica (para EDICIÓN)
            if (type === 'creatinas' && editingProduct) {
                await fetch(`${API_BASE_URL}/api/creatinas/${editingProduct.id}`, {
                    method: "PUT", headers,
                    body: JSON.stringify({
                        tipo_creatina: formData.tipo_creatina,
                        gramos_por_porcion: formData.gramos_por_porcion ? parseFloat(formData.gramos_por_porcion) : null,
                        porciones: formData.porciones ? parseInt(formData.porciones) : null,
                        certificaciones: formData.certificaciones || null
                    })
                });
            } else if (type === 'preentrenos' && editingProduct) {
                await fetch(`${API_BASE_URL}/api/preentrenos/${editingProduct.id}`, {
                    method: "PUT", headers,
                    body: JSON.stringify({
                        cafeina_mg: formData.cafeina_mg ? parseInt(formData.cafeina_mg) : null,
                        beta_alanina: formData.beta_alanina,
                        citrulina: formData.citrulina,
                        nivel_estimulante: formData.nivel_estimulante
                    })
                });
            }

            toast.success(editingProduct ? "Producto actualizado" : "Producto creado");
            setModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Error al guardar");
        }
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`¿Eliminar "${product.nombre}"?`)) return;
        try {
            const productId = product.producto_id || product.id;
            const response = await fetch(`${API_BASE_URL}/api/productos/${productId}`, { method: "DELETE", headers });
            if (response.ok) {
                toast.success("Producto eliminado");
                fetchProducts();
            } else {
                const error = await response.json();
                toast.error(error.detail || "Error al eliminar");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión");
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reportes/inventario?formato=excel`, { headers });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
                toast.success("Excel descargado");
            } else {
                toast.error("Error al generar Excel");
            }
        } catch (error) {
            toast.error("Error al exportar");
        }
    };

    const filteredProducts = products.filter(p => 
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de {getTitle()}</h1>
                <div className="flex gap-2">
                    <button onClick={handleExportExcel} className="btn btn-outline gap-2"><Download size={20} /> Excel</button>
                    <button onClick={fetchProducts} className="btn btn-outline gap-2"><RefreshCw size={20} /></button>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary gap-2"><Plus size={20} /> Nuevo</button>
                </div>
            </div>

            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Buscar productos..." className="input input-bordered w-full pl-10"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No hay productos</td></tr>
                        ) : (
                            filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{product.producto_id || product.id}</td>
                                    <td className="px-4 py-3">
                                        <img src={normalizeImageUrl(product.imagen_url)} alt={product.nombre}
                                            className="h-12 w-12 rounded object-cover"
                                            onError={(e) => { e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4="; }} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs">{product.descripcion}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-primary">S/ {product.precio?.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-error'}`}>{product.stock}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{product.categoria_nombre || "-"}</td>
                                    <td className="px-4 py-3 text-right text-sm font-medium">
                                        <button onClick={() => handleOpenModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-3"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(product)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                    <input type="text" required className="input input-bordered w-full"
                                        value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea className="textarea textarea-bordered w-full" rows="3"
                                        value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                                    <input type="number" step="0.01" min="0.01" required className="input input-bordered w-full"
                                        value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input type="number" min="0" className="input input-bordered w-full"
                                        value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select className="select select-bordered w-full" value={formData.categoria_id}
                                        onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}>
                                        <option value="">Seleccionar...</option>
                                        {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                    <select className="select select-bordered w-full" value={formData.marca_id}
                                        onChange={(e) => setFormData({ ...formData, marca_id: e.target.value })}>
                                        <option value="">Seleccionar...</option>
                                        {marcas.map(marca => <option key={marca.id} value={marca.id}>{marca.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sabor</label>
                                    <input type="text" className="input input-bordered w-full" value={formData.sabor}
                                        onChange={(e) => setFormData({ ...formData, sabor: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                                    <input type="text" className="input input-bordered w-full" value={formData.tamano}
                                        onChange={(e) => setFormData({ ...formData, tamano: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label>
                                    <input type="text" className="input input-bordered w-full" value={formData.imagen_url}
                                        onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })} placeholder="/assets/productos/imagen.webp" />
                                </div>
                            </div>

                            {type === 'creatinas' && (
                                <div className="border-t pt-4 mt-4">
                                    <h3 className="font-semibold mb-3">Datos de Creatina</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                            <select className="select select-bordered w-full" value={formData.tipo_creatina}
                                                onChange={(e) => setFormData({ ...formData, tipo_creatina: e.target.value })}>
                                                <option value="Monohidratada">Monohidratada</option>
                                                <option value="Micronizada">Micronizada</option>
                                                <option value="HCL">HCL</option>
                                                <option value="Creapure">Creapure</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gramos/porción</label>
                                            <input type="number" step="0.1" className="input input-bordered w-full" value={formData.gramos_por_porcion}
                                                onChange={(e) => setFormData({ ...formData, gramos_por_porcion: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Porciones</label>
                                            <input type="number" className="input input-bordered w-full" value={formData.porciones}
                                                onChange={(e) => setFormData({ ...formData, porciones: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Certificaciones</label>
                                            <input type="text" className="input input-bordered w-full" value={formData.certificaciones}
                                                onChange={(e) => setFormData({ ...formData, certificaciones: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {type === 'preentrenos' && (
                                <div className="border-t pt-4 mt-4">
                                    <h3 className="font-semibold mb-3">Datos de Pre-entreno</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cafeína (mg)</label>
                                            <input type="number" className="input input-bordered w-full" value={formData.cafeina_mg}
                                                onChange={(e) => setFormData({ ...formData, cafeina_mg: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel estimulante</label>
                                            <select className="select select-bordered w-full" value={formData.nivel_estimulante}
                                                onChange={(e) => setFormData({ ...formData, nivel_estimulante: e.target.value })}>
                                                <option value="bajo">Bajo</option>
                                                <option value="moderado">Moderado</option>
                                                <option value="alto">Alto</option>
                                                <option value="extremo">Extremo</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-4 col-span-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="checkbox checkbox-primary" checked={formData.beta_alanina}
                                                    onChange={(e) => setFormData({ ...formData, beta_alanina: e.target.checked })} />
                                                <span className="text-sm">Beta-Alanina</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="checkbox checkbox-primary" checked={formData.citrulina}
                                                    onChange={(e) => setFormData({ ...formData, citrulina: e.target.checked })} />
                                                <span className="text-sm">Citrulina</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">Cancelar</button>
                                <button type="submit" className="btn btn-primary">{editingProduct ? 'Actualizar' : 'Crear'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
