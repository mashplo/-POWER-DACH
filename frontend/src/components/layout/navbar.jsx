import { ShoppingCart, User, LogOut, History } from "lucide-react"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { getCarritoCount } from "../../herramientas/carrito"

export default function Navbar() {
    const [cantidadCarrito, setCantidadCarrito] = useState(0)
    const [usuarioActual, setUsuarioActual] = useState(null)
    const location = useLocation()
    const isHome = location.pathname === "/"

    useEffect(() => {
        const actualizarCarrito = () => {
            const cantidad = getCarritoCount()
            setCantidadCarrito(cantidad)
        }

        actualizarCarrito()

        const usuario = localStorage.getItem("user")
        if (usuario) {
            setUsuarioActual(JSON.parse(usuario))
        }

        window.addEventListener('storage', actualizarCarrito)
        
        window.addEventListener('carritoActualizado', actualizarCarrito)

        return () => {
            window.removeEventListener('storage', actualizarCarrito)
            window.removeEventListener('carritoActualizado', actualizarCarrito)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("token")
        setUsuarioActual(null)
        window.location.href = "/"
    }

    return (
        <nav className="bg-black text-white shadow-lg fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
                {/* Logo a la izquierda */}
                <a href="/" className={`flex items-center gap-3 hover:opacity-80 transition-all duration-300 ${isHome ? 'pointer-events-none cursor-default' : ''}`}>
                    <img src="/logo.png" alt="Power Dutch Logo" className="h-10 w-auto" />
                    <span className="text-xl md:text-2xl font-bold">Power Dutch</span>
                </a>

                {/* Sección derecha - Carrito e Inicio de sesión */}
                <div className="flex items-center gap-3">
                    {/* Menú mobile */}
                    <div className="dropdown dropdown-end lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Menú de navegación">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-xl bg-gray-900 rounded-lg w-52 border border-gray-700">
                            <li><a href="/proteina" className="py-2">Proteína</a></li>
                            <li><a href="/creatina" className="py-2">Creatina</a></li>
                            <li><a href="/preentreno" className="py-2">Pre-entreno</a></li>
                            <li><a href="/suplementos" className="py-2">Suplementos</a></li>
                            <li><a href="/productos" className="py-2">Todos los Productos</a></li>
                        </ul>
                    </div>

                    {/* Carrito */}
                    <a href="/carrito" className="btn btn-ghost btn-circle relative" aria-label="Carrito de compras">
                        <ShoppingCart size={26} />
                        {cantidadCarrito > 0 && (
                            <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cantidadCarrito}
                            </span>
                        )}
                    </a>

                    {usuarioActual ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Menú de usuario">
                                <User size={26} />
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-xl bg-gray-900 rounded-lg w-52 border border-gray-700">
                                <li className="menu-title px-2 py-1">
                                    <span className="text-yellow-400 text-sm">Hola, {usuarioActual.nombre}</span>
                                </li>
                                <li><a href="/profile" className="py-2">Mi Perfil</a></li>
                                <li><a href="/historial" className="py-2">
                                    <History size={16} /> Mis Pedidos
                                </a></li>
                                <li><button onClick={handleLogout} className="py-2 text-red-400">
                                    <LogOut size={16} /> Cerrar Sesión
                                </button></li>
                            </ul>
                        </div>
                    ) : (
                        <a href="/login" className="btn btn-outline btn-warning px-6 py-2 text-base font-semibold">
                            Iniciar Sesión
                        </a>
                    )}
                </div>
            </div>
        </nav>
    )
}