import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
    const location = useLocation();

    const menuItems = [
        { path: "/admin/products", label: "Productos", icon: "📦" },
        { path: "/admin/users", label: "Usuarios", icon: "👥" },
        { path: "/admin/boletas", label: "Boletas", icon: "📄" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-yellow-500">Admin Panel</h1>
                    <p className="text-xs text-gray-400 mt-1">Gestión de Tienda</p>
                </div>

                <nav className="mt-6">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${location.pathname.startsWith(item.path)
                                            ? "bg-yellow-500 text-slate-900"
                                            : "text-gray-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className="mt-8 border-t border-slate-700 pt-4">
                            <Link
                                to="/"
                                className="flex items-center px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="mr-3">🏠</span>
                                Volver a la Tienda
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
