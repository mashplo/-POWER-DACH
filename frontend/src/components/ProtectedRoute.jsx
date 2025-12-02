import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("auth_token");
    const user = JSON.parse(localStorage.getItem("usuarioActual") || "{}");

    // Check if user is authenticated and is admin
    if (!token || user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
