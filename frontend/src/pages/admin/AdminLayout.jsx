import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
