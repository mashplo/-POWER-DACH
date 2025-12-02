import { useState, useEffect } from "react";
import { API_BASE_URL, normalizeImageUrl } from "../../herramientas/config";
import { ChevronDown, ChevronUp, Eye, Package, User, Calendar, DollarSign } from "lucide-react";

export default function AdminBoletas() {
    const [boletas, setBoletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedBoleta, setExpandedBoleta] = useState(null);
    const [boletaDetails, setBoletaDetails] = useState({});

    useEffect(() => {
        const fetchBoletas = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/boletas`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setBoletas(data);
                } else {
                    console.error("Respuesta inesperada:", data);
                    setBoletas([]);
                }
            } catch (error) {
                console.error("Error al obtener boletas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBoletas();
    }, []);

    const fetchBoletaDetails = async (boletaId) => {
        if (boletaDetails[boletaId]) {
            // Ya tenemos los detalles, solo expandir/colapsar
            setExpandedBoleta(expandedBoleta === boletaId ? null : boletaId);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/boletas/${boletaId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            const data = await response.json();
            setBoletaDetails(prev => ({ ...prev, [boletaId]: data }));
            setExpandedBoleta(boletaId);
        } catch (error) {
            console.error("Error al obtener detalles:", error);
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gestión de Boletas</h1>
            
            {boletas.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No hay boletas registradas</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {boletas.map(boleta => (
                        <div key={boleta.id} className="bg-white rounded-lg shadow overflow-hidden">
                            {/* Cabecera de la boleta */}
                            <div 
                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => fetchBoletaDetails(boleta.id)}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-primary/10 rounded-full p-3">
                                            <Package className="text-primary" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Boleta #{boleta.id}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <User size={14} /> {boleta.user_name || 'Usuario'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} /> {formatDate(boleta.fecha)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-bold text-xl text-primary">S/ {boleta.total?.toFixed(2)}</p>
                                        </div>
                                        <div className="badge badge-success">Completada</div>
                                        {expandedBoleta === boleta.id ? (
                                            <ChevronUp size={24} className="text-gray-400" />
                                        ) : (
                                            <ChevronDown size={24} className="text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Detalles expandibles */}
                            {expandedBoleta === boleta.id && boletaDetails[boleta.id] && (
                                <div className="border-t bg-gray-50 p-4">
                                    <h4 className="font-semibold mb-3 text-gray-700">Productos:</h4>
                                    <div className="space-y-3">
                                        {boletaDetails[boleta.id].items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gray-100 rounded p-2">
                                                        <Package size={20} className="text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{item.product_title}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {item.product_type} • Cantidad: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">S/ {item.price?.toFixed(2)} c/u</p>
                                                    <p className="font-semibold">S/ {(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Información del usuario */}
                                    {boletaDetails[boleta.id].boleta && (
                                        <div className="mt-4 pt-4 border-t">
                                            <h4 className="font-semibold mb-2 text-gray-700">Cliente:</h4>
                                            <div className="flex items-center gap-2 text-sm">
                                                <User size={16} className="text-gray-400" />
                                                <span>{boletaDetails[boleta.id].boleta.nombre}</span>
                                                <span className="text-gray-400">|</span>
                                                <span className="text-gray-500">{boletaDetails[boleta.id].boleta.email}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Resumen */}
                                    <div className="mt-4 pt-4 border-t flex justify-end">
                                        <div className="bg-primary/10 rounded-lg p-4 inline-block">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="text-primary" />
                                                <span className="text-gray-600">Total pagado:</span>
                                                <span className="font-bold text-2xl text-primary">S/ {boleta.total?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
