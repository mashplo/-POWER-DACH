import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../herramientas/config";
import { toast } from "sonner";

function TableRow({ item, onEdit, onDelete }) {
  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.title}</td>
      <td className="w-64 truncate">{item.description}</td>
      <td>S/ {item.price.toFixed(2)}</td>
      <td>{item.category}</td>
      <td>
        <div className="flex gap-2">
          <button className="btn btn-sm" onClick={() => onEdit(item)}>
            Editar
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => onDelete(item)}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ProductosAdmin() {
  const [activeTab, setActiveTab] = useState("productos");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    cargar();
  }, [activeTab]);

  const cargar = async () => {
    setLoading(true);
    const endpoint =
      activeTab === "productos"
        ? "/api/v1/products"
        : activeTab === "creatinas"
        ? "/api/v1/creatinas"
        : "/api/v1/preentrenos";
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    const data = await res.json();
    setItems(data || []);
    setLoading(false);
  };

  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")).access_token
    : null;

  const crearOActualizar = async (ev) => {
    ev.preventDefault();
    const form = ev.target;
    const body = {
      title: form.title.value,
      description: form.description.value,
      price: parseFloat(form.price.value || 0),
      images: form.images.value.split(",").map((s) => s.trim()),
      category: form.category.value,
    };
    try {
      const method = editing ? "PUT" : "POST";
      const url = `${API_BASE_URL}${
        editing ? `/api/v1/${activeTab}/${editing.id}` : `/api/v1/${activeTab}`
      }`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error en la operación");
      toast.success("Operación exitosa");
      setEditing(null);
      form.reset();
      cargar();
    } catch (e) {
      toast.error(String(e));
    }
  };

  const onDelete = async (item) => {
    if (!confirm("Eliminar producto?")) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/${activeTab}/${item.id}`,
        {
          method: "DELETE",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        }
      );
      if (!res.ok) throw new Error("No se pudo eliminar");
      toast.success("Producto eliminado");
      cargar();
    } catch (e) {
      toast.error(String(e));
    }
  };

  const onEdit = (item) => {
    setEditing(item);
    // scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Productos (Admin)</h1>

      <div className="tabs mb-4">
        <button
          className={`tab ${activeTab === "productos" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("productos")}
        >
          Proteínas
        </button>
        <button
          className={`tab ${activeTab === "creatinas" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("creatinas")}
        >
          Creatinas
        </button>
        <button
          className={`tab ${activeTab === "preentrenos" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("preentrenos")}
        >
          Pre-entrenos
        </button>
      </div>

      <form
        onSubmit={crearOActualizar}
        className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <input
          name="title"
          defaultValue={editing?.title || ""}
          placeholder="Título"
          className="input input-bordered w-full"
          required
        />
        <input
          name="price"
          defaultValue={editing?.price || ""}
          placeholder="Precio"
          className="input input-bordered w-full"
          required
        />
        <input
          name="category"
          defaultValue={editing?.category || ""}
          placeholder="Categoría"
          className="input input-bordered w-full"
        />
        <input
          name="images"
          defaultValue={editing?.images?.join?.(",") || ""}
          placeholder="URLs separadas por coma"
          className="input input-bordered w-full"
        />
        <textarea
          name="description"
          defaultValue={editing?.description || ""}
          placeholder="Descripción"
          className="textarea textarea-bordered md:col-span-2"
        ></textarea>
        <div className="md:col-span-2 flex gap-2">
          <button className="btn btn-primary" type="submit">
            {editing ? "Actualizar" : "Crear"}
          </button>
          {editing && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setEditing(null);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <TableRow
                  key={it.id}
                  item={it}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
