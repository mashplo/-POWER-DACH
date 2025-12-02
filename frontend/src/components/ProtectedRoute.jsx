import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Check if user is authenticated and is admin
    if (!token || user.rol !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
