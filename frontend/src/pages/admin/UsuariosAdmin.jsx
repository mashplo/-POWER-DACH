import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../herramientas/config";
import { toast } from "sonner";

export default function UsuariosAdmin() {
  const [tab, setTab] = useState("clientes");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")).access_token
    : null;

  useEffect(() => {
    cargar();
  }, [tab]);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/users`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error("No autorizado");
      const data = await res.json();
      setUsers(data || []);
    } catch (e) {
      toast.error(String(e));
      setUsers([]);
    }
    setLoading(false);
  };

  const crear = async (ev) => {
    ev.preventDefault();
    const form = ev.target;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.value,
          email: form.email.value,
          password: form.password.value,
        }),
      });
      if (!res.ok) throw new Error("Error creando usuario");
      toast.success("Usuario creado");
      form.reset();
      cargar();
    } catch (e) {
      toast.error(String(e));
    }
  };

  const eliminar = async (u) => {
    if (!confirm("Eliminar usuario?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/users/${u.id}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      toast.success("Usuario eliminado");
      cargar();
    } catch (e) {
      toast.error(String(e));
    }
  };

  const toggleAdmin = async (u) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/users/${u.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ is_admin: u.is_admin ? 0 : 1 }),
      });
      if (!res.ok) throw new Error("No autorizado");
      toast.success("Actualizado");
      cargar();
    } catch (e) {
      toast.error(String(e));
    }
  };

  const mostrados = users.filter((u) =>
    tab === "empleados" ? u.is_admin : !u.is_admin
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuarios (Admin)</h1>
      <div className="tabs mb-4">
        <button
          className={`tab ${tab === "empleados" ? "tab-active" : ""}`}
          onClick={() => setTab("empleados")}
        >
          Empleados
        </button>
        <button
          className={`tab ${tab === "clientes" ? "tab-active" : ""}`}
          onClick={() => setTab("clientes")}
        >
          Clientes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          {loading ? (
            <div>Cargando...</div>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mostrados.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>{u.is_admin ? "Sí" : "No"}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm"
                            onClick={() => toggleAdmin(u)}
                          >
                            {u.is_admin ? "Quitar admin" : "Hacer admin"}
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => eliminar(u)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Crear usuario</h3>
          <form onSubmit={crear} className="space-y-2">
            <input
              className="input input-bordered w-full"
              name="nombre"
              placeholder="Nombre"
              required
            />
            <input
              className="input input-bordered w-full"
              name="email"
              placeholder="Email"
              type="email"
              required
            />
            <input
              className="input input-bordered w-full"
              name="password"
              placeholder="Contraseña"
              type="password"
              required
            />
            <button className="btn btn-primary w-full mt-2" type="submit">
              Crear
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
