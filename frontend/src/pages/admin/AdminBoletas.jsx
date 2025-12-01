import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminBoletas() {
    const [boletas, setBoletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBoleta, setSelectedBoleta] = useState(null);

    useEffect(() => {
        fetchBoletas();
    }, []);

    const fetchBoletas = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/boletas");
            if (response.ok) {
                const data = await response.json();
                setBoletas(data);
            }
        } catch (error) {
            toast.error("Error al cargar boletas");
        } finally {
            setLoading(false);
        }
    };

    const fetchBoletaDetail = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/boletas/${id}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedBoleta(data);
            }
        } catch (error) {
            toast.error("Error al cargar detalle");
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Boletas Generadas</h2>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {boletas.map((boleta) => (
                            <tr key={boleta.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{boleta.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{boleta.user_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{boleta.fecha}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">S/ {boleta.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => fetchBoletaDetail(boleta.id)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Ver Detalle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedBoleta && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Detalle de Boleta #{selectedBoleta.boleta.id}</h3>
                            <button onClick={() => setSelectedBoleta(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Fecha</p>
                                <p className="font-medium">{selectedBoleta.boleta.fecha}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-bold text-xl text-indigo-600">S/ {selectedBoleta.boleta.total}</p>
                            </div>
                        </div>

                        <h4 className="font-medium mb-2">Productos</h4>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cant.</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedBoleta.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{item.product_title}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 text-right">{item.quantity}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 text-right">S/ {item.price}</td>
                                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                                                S/ {(item.quantity * item.price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedBoleta(null)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
