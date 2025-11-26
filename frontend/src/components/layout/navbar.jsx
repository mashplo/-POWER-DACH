import { ShoppingCart, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar() {
    const [cantidadCarrito, setCantidadCarrito] = useState(0)
    const [usuarioActual, setUsuarioActual] = useState(null)

    useEffect(() => {
        const actualizarCarrito = () => {
            const carritoGuardado = localStorage.getItem("carrito")
            if (carritoGuardado) {
                const carrito = JSON.parse(carritoGuardado)
                setCantidadCarrito(carrito.length)
            } else {
                setCantidadCarrito(0)
            }
        }

        actualizarCarrito()

        const usuario = localStorage.getItem("usuarioActual")
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
        localStorage.removeItem("usuarioActual")
        setUsuarioActual(null)
        window.location.href = "/"
    }

    return (
        <nav className="navbar bg-black text-white">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black rounded-box w-52">
                        <li><a href="/proteina">Proteína</a></li>
                        <li><a href="/creatina">Creatina</a></li>
                    </ul>
                </div>
                <a href="/" className="btn btn-ghost text-xl font-bold flex items-center gap-2">
                    <img src="/logo.png" alt="Power Dutch Logo" className="h-10 w-auto" />
                    Power Dutch
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                </ul>
            </div>
            <div className="navbar-end">
                <a href="/profile" className="btn btn-ghost btn-circle mr-2">
                    <div className="indicator">
                        <ShoppingCart size={24} />
                        <span className="badge badge-sm indicator-item bg-red-600 border-none text-white">{cantidadCarrito}</span>
                    </div>
                </a>

                {usuarioActual ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <User size={24} />
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black rounded-box w-52">
                            <li className="menu-title">
                                <span>Hola, {usuarioActual.nombre}</span>
                            </li>
                            <li><a href="/profile">Mi Perfil</a></li>
                            <li><button onClick={handleLogout} className="text-left">
                                <LogOut size={16} /> Cerrar Sesión
                            </button></li>
                        </ul>
                    </div>
                ) : (
                    <a href="/login" className="btn btn-primary btn-sm">
                        Iniciar Sesión
                    </a>
                )}
            </div>
        </nav>
    )
}