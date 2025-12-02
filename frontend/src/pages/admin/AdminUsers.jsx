import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../herramientas/config";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        role: "user"
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            toast.error("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                nombre: user.nombre,
                email: user.email,
                password: "", // Password empty on edit
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                nombre: "",
                email: "",
                password: "",
                role: "user"
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update User
                const response = await fetch(`${API_BASE_URL}/api/v1/users/${editingUser.id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                    body: JSON.stringify({
                        nombre: formData.nombre,
                        email: formData.email,
                        role: formData.role
                    })
                });

                if (response.ok) {
                    toast.success("Usuario actualizado");
                    setModalOpen(false);
                    fetchUsers();
                } else {
                    toast.error("Error al actualizar usuario");
                }
            } else {
                // Create User (Register)
                const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: formData.nombre,
                        email: formData.email,
                        password: formData.password
                    })
                });

                if (response.ok) {
                    const newUser = await response.json();
                    // If role is admin, we need to update it immediately because register defaults to 'user'
                    if (formData.role === 'admin') {
                        await fetch(`${API_BASE_URL}/api/v1/users/${newUser.id}`, {
                            method: "PUT",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                            },
                            body: JSON.stringify({
                                nombre: formData.nombre,
                                email: formData.email,
                                role: 'admin'
                            })
                        });
                    }

                    toast.success("Usuario creado");
                    setModalOpen(false);
                    fetchUsers();
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.detail || "Error al crear usuario");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/users/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (response.ok) {
                toast.success("Usuario eliminado");
                fetchUsers();
            } else {
                toast.error("Error al eliminar");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión");
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando usuarios...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary gap-2"
                >
                    <Plus size={20} /> Nuevo Usuario
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(user)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="input input-bordered w-full mt-1"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="input input-bordered w-full mt-1"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                    <input
                                        type="password"
                                        required
                                        className="input input-bordered w-full mt-1"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <select
                                    className="select select-bordered w-full mt-1"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="user">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
