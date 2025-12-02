import { useState, useEffect } from "react";
import { API_BASE_URL, normalizeImageUrl } from "../../herramientas/config";
import { ChevronDown, ChevronUp, Package, User, Calendar, DollarSign, Download, RefreshCw, Search, Edit, Check } from "lucide-react";
import { toast } from "sonner";

export default function AdminBoletas() {
    const [boletas, setBoletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedBoleta, setExpandedBoleta] = useState(null);
    const [boletaDetails, setBoletaDetails] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        fetchBoletas();
    }, [estadoFilter]);

    const fetchBoletas = async () => {
        setLoading(true);
        try {
            let url = `${API_BASE_URL}/api/boletas`;
            if (estadoFilter) url += `?estado=${estadoFilter}`;
            
            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error("Error al cargar boletas");
            
            const data = await response.json();
            setBoletas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al cargar boletas");
            setBoletas([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchBoletaDetails = async (boletaId) => {
        if (boletaDetails[boletaId]) {
            setExpandedBoleta(expandedBoleta === boletaId ? null : boletaId);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/boletas/${boletaId}`, { headers });
            if (!response.ok) throw new Error("Error al cargar detalles");
            
            const data = await response.json();
            setBoletaDetails(prev => ({ ...prev, [boletaId]: data }));
            setExpandedBoleta(boletaId);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al cargar detalles");
        }
    };

    const handleUpdateEstado = async (boletaId, nuevoEstado) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/boletas/${boletaId}/estado`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (response.ok) {
                toast.success(`Estado actualizado a: ${nuevoEstado}`);
                fetchBoletas();
                // Actualizar detalle si está expandido
                if (boletaDetails[boletaId]) {
                    setBoletaDetails(prev => ({
                        ...prev,
                        [boletaId]: { ...prev[boletaId], estado: nuevoEstado }
                    }));
                }
            } else {
                const error = await response.json();
                toast.error(error.detail || "Error al actualizar estado");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión");
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reportes/ventas?formato=excel`, { headers });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            // Las fechas de SQLite vienen en UTC, agregar 'Z' para indicarlo
            const utcDate = dateString.includes('Z') || dateString.includes('+') 
                ? dateString 
                : dateString.replace(' ', 'T') + 'Z';
            return new Date(utcDate).toLocaleString('es-PE', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
                timeZone: 'America/Lima'
            });
        } catch {
            return dateString;
        }
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            pendiente: 'badge-warning',
            pagado: 'badge-info',
            enviado: 'badge-primary',
            entregado: 'badge-success',
            cancelado: 'badge-error'
        };
        return badges[estado] || 'badge-ghost';
    };

    const filteredBoletas = boletas.filter(b => 
        b.usuario_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.usuario_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(b.id).includes(searchTerm)
    );

    if (loading) return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Boletas</h1>
                <div className="flex gap-2">
                    <button onClick={handleExportExcel} className="btn btn-outline gap-2"><Download size={20} /> Excel</button>
                    <button onClick={fetchBoletas} className="btn btn-outline gap-2"><RefreshCw size={20} /></button>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Buscar por cliente o N° boleta..." className="input input-bordered w-full pl-10"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="select select-bordered w-48" value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
                    <option value="">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                </select>
            </div>

            {/* Lista de Boletas */}
            {filteredBoletas.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No hay boletas para mostrar</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBoletas.map(boleta => (
                        <div key={boleta.id} className="bg-white rounded-lg shadow overflow-hidden">
                            {/* Cabecera */}
                            <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => fetchBoletaDetails(boleta.id)}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-primary/10 rounded-full p-3">
                                            <Package className="text-primary" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Boleta #{String(boleta.id).padStart(6, '0')}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <User size={14} /> {boleta.usuario_nombre || 'Usuario'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} /> {formatDate(boleta.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="font-bold text-xl text-primary">S/ {boleta.total?.toFixed(2)}</p>
                                        </div>
                                        <span className={`badge ${getEstadoBadge(boleta.estado)}`}>
                                            {boleta.estado?.toUpperCase()}
                                        </span>
                                        {expandedBoleta === boleta.id ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Detalles expandibles */}
                            {expandedBoleta === boleta.id && boletaDetails[boleta.id] && (
                                <div className="border-t bg-gray-50 p-4">
                                    {/* Cambiar estado */}
                                    <div className="mb-4 p-3 bg-white rounded-lg flex items-center justify-between">
                                        <span className="font-medium">Cambiar estado:</span>
                                        <div className="flex gap-2">
                                            {['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'].map(estado => (
                                                <button key={estado}
                                                    onClick={(e) => { e.stopPropagation(); handleUpdateEstado(boleta.id, estado); }}
                                                    className={`btn btn-sm ${boletaDetails[boleta.id].estado === estado ? 'btn-primary' : 'btn-ghost'}`}>
                                                    {estado === boletaDetails[boleta.id].estado && <Check size={14} className="mr-1" />}
                                                    {estado}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Productos */}
                                    <h4 className="font-semibold mb-3 text-gray-700">Productos:</h4>
                                    <div className="space-y-2">
                                        {boletaDetails[boleta.id].items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <img src={normalizeImageUrl(item.imagen_url)} alt={item.nombre}
                                                        className="w-12 h-12 rounded object-cover"
                                                        onError={(e) => { e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4="; }} />
                                                    <div>
                                                        <p className="font-medium">{item.nombre}</p>
                                                        <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">S/ {item.precio_unitario?.toFixed(2)} c/u</p>
                                                    <p className="font-semibold">S/ {item.subtotal?.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Resumen financiero */}
                                    <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white p-3 rounded-lg text-center">
                                            <p className="text-sm text-gray-500">Subtotal</p>
                                            <p className="font-bold">S/ {boletaDetails[boleta.id].subtotal?.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg text-center">
                                            <p className="text-sm text-gray-500">Impuestos (18%)</p>
                                            <p className="font-bold">S/ {boletaDetails[boleta.id].impuestos?.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg text-center">
                                            <p className="text-sm text-gray-500">Descuento</p>
                                            <p className="font-bold text-green-600">- S/ {boletaDetails[boleta.id].descuento?.toFixed(2) || '0.00'}</p>
                                        </div>
                                        <div className="bg-primary/10 p-3 rounded-lg text-center">
                                            <p className="text-sm text-gray-600">Total</p>
                                            <p className="font-bold text-xl text-primary">S/ {boletaDetails[boleta.id].total?.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Info adicional */}
                                    <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-semibold">Cliente:</span> {boletaDetails[boleta.id].usuario_nombre} ({boletaDetails[boleta.id].usuario_email})
                                        </div>
                                        <div>
                                            <span className="font-semibold">Método de pago:</span> {boletaDetails[boleta.id].metodo_pago_nombre || 'No especificado'}
                                        </div>
                                        {boletaDetails[boleta.id].direccion_envio && (
                                            <div className="md:col-span-2">
                                                <span className="font-semibold">Dirección:</span> {boletaDetails[boleta.id].direccion_envio}
                                            </div>
                                        )}
                                        {boletaDetails[boleta.id].cupon_codigo && (
                                            <div>
                                                <span className="font-semibold">Cupón:</span> {boletaDetails[boleta.id].cupon_codigo}
                                            </div>
                                        )}
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
