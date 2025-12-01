import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const usuarioStorage = localStorage.getItem("usuarioActual");
    const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;

    // Verificar si el usuario existe y tiene rol de admin
    if (usuario && usuario.role === "admin") {
        return <Outlet />;
    }

    // Si no es admin, redirigir al home
    return <Navigate to="/" replace />;
}
