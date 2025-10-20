import { getUsuario, getCarrito } from "../herramientas/usuario";
import { useState, useEffect } from "react";

import UserWelcome from "../components/profile/UserWelcome";
import CartSummary from "../components/profile/CartSummary";

export default function Profile() {
    const [usuario, setUsuario] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarDatos = async () => {
        try {
            const usuarioLogueado = localStorage.getItem("usuarioActual")
            if (!usuarioLogueado) {
                window.location.href = "/login"
                return
            }

            const userData = await getUsuario(1);

            if (userData.id == 0) {
                window.location.href = "/login"
                return
            }

            const carritoData = await getCarrito(1);
            
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
    }, []);

    const handleCompraCompletada = () => {
        // Actualizar el estado del carrito a vacío
        setCarrito([]);
    }

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
        <div className="px-10 py-14 max-w-6xl mx-auto">
            <div className="mb-8">
                <UserWelcome usuario={usuario} />
            </div>

            <div className="grid gap-6">
                <div className="">
                    <CartSummary carrito={carrito} onCompraCompletada={handleCompraCompletada} />
                </div>
                
            </div>

            {carrito.length > 0 && (
                <div className="mt-6">
                    <div className="alert alert-success shadow-md">
                        <span>Tienes {carrito.length} productos listos para comprar</span>
                    </div>
                </div>
            )}
        </div>
    );
}