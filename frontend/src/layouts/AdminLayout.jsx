import { Outlet, Link, useLocation } from "react-router-dom";

export default function AdminLayout() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-6">
                <h2 className="text-2xl font-bold mb-6">Panel Admin</h2>
                <nav className="space-y-2">
                    <Link
                        to="/admin"
                        className={`block px-4 py-2 rounded transition ${isActive('/admin') ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}
                    >
                        📊 Dashboard
                    </Link>
                    
                    <div className="collapse collapse-arrow bg-gray-700 rounded-box">
                        <input type="checkbox" defaultChecked />
                        <div className="collapse-title font-medium">
                            📦 Productos
                        </div>
                        <div className="collapse-content text-sm">
                            <Link to="/admin/products/productos" className={`block py-2 pl-2 rounded ${isActive('/admin/products/productos') ? 'bg-primary/50' : 'hover:text-primary'}`}>Proteínas</Link>
                            <Link to="/admin/products/creatinas" className={`block py-2 pl-2 rounded ${isActive('/admin/products/creatinas') ? 'bg-primary/50' : 'hover:text-primary'}`}>Creatinas</Link>
                            <Link to="/admin/products/preentrenos" className={`block py-2 pl-2 rounded ${isActive('/admin/products/preentrenos') ? 'bg-primary/50' : 'hover:text-primary'}`}>Pre-entrenos</Link>
                            <Link to="/admin/products/suplementos" className={`block py-2 pl-2 rounded ${isActive('/admin/products/suplementos') ? 'bg-primary/50' : 'hover:text-primary'}`}>Suplementos</Link>
                        </div>
                    </div>

                    <Link
                        to="/admin/users"
                        className={`block px-4 py-2 rounded transition ${isActive('/admin/users') ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}
                    >
                        👥 Usuarios
                    </Link>
                    <Link
                        to="/admin/boletas"
                        className={`block px-4 py-2 rounded transition ${isActive('/admin/boletas') ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}
                    >
                        🧾 Boletas
                    </Link>
                    
                    <div className="mt-6 pt-6 border-t border-gray-600">
                        <Link
                            to="/"
                            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
                        >
                            🏠 Volver al sitio
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-100">
                <Outlet />
            </main>
        </div>
    );
}
