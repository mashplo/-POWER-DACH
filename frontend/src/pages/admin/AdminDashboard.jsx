import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../herramientas/config";
import { Package, Users, ShoppingCart, TrendingUp, AlertTriangle, DollarSign, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reportes/dashboard`, { headers });
            if (!response.ok) throw new Error("Error al cargar dashboard");
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al cargar estadísticas");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Ventas</p>
                            <p className="text-3xl font-bold text-primary">
                                {stats?.ventas?.total || 0}
                            </p>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-full">
                            <ShoppingCart className="text-primary" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Total: S/ {stats?.ventas?.monto?.toFixed(2) || '0.00'}
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Clientes</p>
                            <p className="text-3xl font-bold text-success">
                                {stats?.clientes || 0}
                            </p>
                        </div>
                        <div className="bg-success/10 p-3 rounded-full">
                            <Users className="text-success" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Registrados</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Productos</p>
                            <p className="text-3xl font-bold text-info">
                                {stats?.productos || 0}
                            </p>
                        </div>
                        <div className="bg-info/10 p-3 rounded-full">
                            <Package className="text-info" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Activos</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Stock Bajo</p>
                            <p className="text-3xl font-bold text-warning">
                                {stats?.stock_bajo || 0}
                            </p>
                        </div>
                        <div className="bg-warning/10 p-3 rounded-full">
                            <AlertTriangle className="text-warning" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Productos con stock menor a 10</p>
                </div>
            </div>

            {/* Ventas últimos 7 días */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="text-primary" /> Ventas Últimos 7 Días
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-4xl font-bold text-primary">
                                {stats?.ventas_semana?.total || 0}
                            </p>
                            <p className="text-gray-500">pedidos</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-success">
                                S/ {stats?.ventas_semana?.monto?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-gray-500">ingresos</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="text-info" /> Accesos Rápidos
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/admin/products/productos" className="btn btn-outline btn-primary">
                            <Package size={18} /> Productos
                        </a>
                        <a href="/admin/users" className="btn btn-outline btn-success">
                            <Users size={18} /> Usuarios
                        </a>
                        <a href="/admin/boletas" className="btn btn-outline btn-info">
                            <ShoppingCart size={18} /> Boletas
                        </a>
                        <a href="/" className="btn btn-outline">
                            Ver Sitio
                        </a>
                    </div>
                </div>
            </div>

            {/* Información del Sistema */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Información del Sistema</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Base de Datos</p>
                        <p className="font-semibold text-success">SQLite (SQL Puro)</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Backend</p>
                        <p className="font-semibold">FastAPI</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Frontend</p>
                        <p className="font-semibold">React + Vite</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Tablas</p>
                        <p className="font-semibold">15 entidades</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
