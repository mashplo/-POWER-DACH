import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-6">
                <h2 className="text-2xl font-bold mb-6">Panel Admin</h2>
                <nav className="space-y-2">
                    <div className="collapse collapse-arrow bg-gray-700 rounded-box">
                        <input type="checkbox" />
                        <div className="collapse-title font-medium">
                            Categorías
                        </div>
                        <div className="collapse-content text-sm">
                            <Link to="/admin/products/productos" className="block py-2 hover:text-primary">Proteínas</Link>
                            <Link to="/admin/products/creatinas" className="block py-2 hover:text-primary">Creatinas</Link>
                            <Link to="/admin/products/preentrenos" className="block py-2 hover:text-primary">Pre-entrenos</Link>
                        </div>
                    </div>

                    <Link
                        to="/admin/users"
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                    >
                        Usuarios
                    </Link>
                    <Link
                        to="/admin/boletas"
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                    >
                        Boletas
                    </Link>
                    <Link
                        to="/"
                        className="block px-4 py-2 rounded hover:bg-gray-700 transition mt-6 border-t border-gray-600 pt-6"
                    >
                        Volver al sitio
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-100">
                <Outlet />
            </main>
        </div>
    );
}
