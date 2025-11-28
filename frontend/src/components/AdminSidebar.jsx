import { Link, useLocation } from "react-router-dom";
import { Box, Users, FileText, ShoppingCart } from "lucide-react";

export default function AdminSidebar() {
  const { pathname } = useLocation();

  const Btn = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded hover:bg-base-200 ${
        pathname.startsWith(to) ? "bg-base-200 font-semibold" : ""
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-white h-screen border-r hidden md:block">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="p-4 space-y-2">
        <Btn to="/admin/productos" icon={Box} label="Productos" />
        <Btn to="/admin/usuarios" icon={Users} label="Usuarios" />
        <Btn to="/admin/boletas" icon={FileText} label="Boletas" />
      </nav>
    </aside>
  );
}
