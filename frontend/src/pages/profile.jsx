import { getUsuario, getCarrito, cerrarSesion } from "../herramientas/usuario";
import { getCarrito as getCarritoCompras, clearCarrito } from "../herramientas/carrito";
import { useState, useEffect } from "react";
import { User, ShoppingBag, LogOut, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
    const [usuario, setUsuario] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarDatos = async () => {
        try {
            const usuarioLogueado = localStorage.getItem("user")
            if (!usuarioLogueado) {
                window.location.href = "/login"
                return
            }

            const userData = await getUsuario(1);

            if (userData.id == 0) {
                window.location.href = "/login"
                return
            }

            const carritoData = getCarritoCompras();

            setUsuario(userData);
            setCarrito(carritoData);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarDatos();

        // Escuchar cambios en el carrito
        const handleCarritoActualizado = () => {
            const carritoData = getCarritoCompras();
            setCarrito(carritoData);
        };

        window.addEventListener('carritoActualizado', handleCarritoActualizado);

        return () => {
            window.removeEventListener('carritoActualizado', handleCarritoActualizado);
        };
    }, []);

    const handleCerrarSesion = async () => {
        await cerrarSesion();
        toast.success("Sesión cerrada exitosamente");
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    };

    const handleLimpiarCarrito = () => {
        clearCarrito();
        setCarrito([]);
        toast.success("Carrito vaciado");
    };

    if (loading) {
        return (
            <div className="px-10 py-14">
                <div className="skeleton h-8 w-48 mb-6"></div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header del Perfil */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-16">
                                    <span className="text-2xl">{usuario?.nombre?.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">¡Hola, {usuario?.nombre}!</h1>
                                <p className="text-gray-600 flex items-center gap-2 mt-1">
                                    <Mail size={16} />
                                    {usuario?.email}
                                </p>
                                {usuario?.fechaRegistro && (
                                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                        <Calendar size={14} />
                                        Miembro desde {new Date(usuario.fechaRegistro).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleCerrarSesion}
                            className="btn btn-error btn-outline"
                        >
                            <LogOut size={20} />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Información del Carrito */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Resumen del Carrito */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <ShoppingBag size={28} />
                            Tu Carrito
                        </h2>

                        {carrito.length === 0 ? (
                            <div className="text-center py-8">
                                <ShoppingBag size={60} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
                                <a href="/productos" className="btn btn-primary btn-sm">
                                    Ver Productos
                                </a>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-4">
                                    {carrito.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-12 h-12 object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMmU4ZjAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                                                    }}
                                                />
                                                <div>
                                                    <p className="font-semibold text-sm">{item.title}</p>
                                                    <p className="text-xs text-gray-600">Cantidad: {item.cantidad}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-primary">S/ {(item.price * item.cantidad).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="divider my-2"></div>

                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold">Total:</span>
                                    <span className="text-2xl font-bold text-primary">
                                        S/ {carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <a href="/carrito" className="btn btn-primary flex-1">
                                        Ver Carrito Completo
                                    </a>
                                    <button
                                        onClick={handleLimpiarCarrito}
                                        className="btn btn-ghost btn-outline"
                                    >
                                        Vaciar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>

                        <div className="space-y-3">
                            <a href="/productos" className="btn btn-outline w-full justify-start">
                                <ShoppingBag size={20} />
                                Ver Todos los Productos
                            </a>
                            <a href="/proteina" className="btn btn-outline w-full justify-start">
                                💪 Ver Proteínas
                            </a>
                            <a href="/creatina" className="btn btn-outline w-full justify-start">
                                ⚡ Ver Creatinas
                            </a>
                            <a href="/carrito" className="btn btn-outline w-full justify-start">
                                🛒 Ir al Carrito
                            </a>
                        </div>
                    </div>
                </div>

                {carrito.length > 0 && (
                    <div className="mt-6">
                        <div className="alert alert-success shadow-md">
                            <span>✅ Tienes {carrito.length} productos listos para comprar</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}