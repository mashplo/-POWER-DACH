import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../herramientas/config";
import { Plus, Edit, Trash2, X, Download, Search, RefreshCw, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userBoletas, setUserBoletas] = useState(0);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        rol: "cliente",
        activo: true
    });

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios`, { headers });
            if (!response.ok) throw new Error("Error al cargar usuarios");
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al cargar usuarios");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                nombre: user.nombre || "",
                email: user.email || "",
                password: "",
                rol: user.rol || "cliente",
                activo: user.activo !== undefined ? user.activo : true
            });
        } else {
            setEditingUser(null);
            setFormData({
                nombre: "",
                email: "",
                password: "",
                rol: "cliente",
                activo: true
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim()) {
            toast.error("El nombre es obligatorio");
            return;
        }
        if (!formData.email.trim()) {
            toast.error("El email es obligatorio");
            return;
        }
        if (!editingUser && !formData.password) {
            toast.error("La contraseña es obligatoria para nuevos usuarios");
            return;
        }

        try {
            if (editingUser) {
                // Actualizar usuario
                const updateData = {
                    nombre: formData.nombre,
                    email: formData.email,
                    rol: formData.rol,
                    activo: formData.activo
                };
                
                // Solo incluir password si se proporcionó
                if (formData.password) {
                    updateData.password = formData.password;
                }

                const response = await fetch(`${API_BASE_URL}/api/usuarios/${editingUser.id}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(updateData)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || "Error al actualizar");
                }

                toast.success("Usuario actualizado");
            } else {
                // Crear usuario (registro)
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: formData.nombre,
                        email: formData.email,
                        password: formData.password
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || "Error al crear usuario");
                }

                const newUser = await response.json();

                // Si el rol es admin, actualizar
                if (formData.rol === 'admin') {
                    await fetch(`${API_BASE_URL}/api/usuarios/${newUser.user.id}`, {
                        method: "PUT",
                        headers,
                        body: JSON.stringify({ rol: 'admin' })
                    });
                }

                toast.success("Usuario creado");
            }

            setModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Error al guardar");
        }
    };

    const handleDelete = async (user) => {
        if (user.rol === 'admin') {
            toast.error("No se puede eliminar un administrador");
            return;
        }
        
        // Verificar si tiene boletas
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/${user.id}/boletas-count`, { headers });
            if (response.ok) {
                const data = await response.json();
                setUserBoletas(data.count || 0);
            } else {
                setUserBoletas(0);
            }
        } catch {
            setUserBoletas(0);
        }
        
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const executeDelete = async (option) => {
        // option: 'cancel', 'keep-boletas', 'delete-all'
        if (option === 'cancel') {
            setDeleteModalOpen(false);
            setUserToDelete(null);
            return;
        }

        try {
            const url = option === 'delete-all' 
                ? `${API_BASE_URL}/api/usuarios/${userToDelete.id}?delete_boletas=true`
                : `${API_BASE_URL}/api/usuarios/${userToDelete.id}?delete_boletas=false`;
            
            const response = await fetch(url, {
                method: "DELETE",
                headers
            });

            if (response.ok) {
                toast.success("Usuario eliminado correctamente");
                fetchUsers();
            } else {
                const error = await response.json();
                toast.error(error.detail || "Error al eliminar");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión");
        } finally {
            setDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleToggleActive = async (user) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/${user.id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ activo: !user.activo })
            });

            if (response.ok) {
                toast.success(user.activo ? "Usuario desactivado" : "Usuario activado");
                fetchUsers();
            } else {
                toast.error("Error al cambiar estado");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión");
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reportes/clientes?formato=excel`, { headers });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
                toast.success("Excel descargado");
            } else {
                toast.error("Error al generar Excel");
            }
        } catch (error) {
            toast.error("Error al exportar");
        }
    };

    const filteredUsers = users.filter(u => 
        u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                <div className="flex gap-2">
                    <button onClick={handleExportExcel} className="btn btn-outline gap-2"><Download size={20} /> Excel</button>
                    <button onClick={fetchUsers} className="btn btn-outline gap-2"><RefreshCw size={20} /></button>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary gap-2"><Plus size={20} /> Nuevo</button>
                </div>
            </div>

            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Buscar usuarios..." className="input input-bordered w-full pl-10"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No hay usuarios</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{user.id}</td>
                                    <td className="px-4 py-3 text-sm font-medium">{user.nombre}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${user.rol === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${user.activo ? 'badge-success' : 'badge-error'}`}>
                                            {user.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-medium">
                                        <button onClick={() => handleToggleActive(user)}
                                            className={`mr-2 ${user.activo ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                                            title={user.activo ? 'Desactivar' : 'Activar'}>
                                            {user.activo ? <UserX size={18} /> : <UserCheck size={18} />}
                                        </button>
                                        <button onClick={() => handleOpenModal(user)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-900"
                                            disabled={user.rol === 'admin'}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input type="text" required className="input input-bordered w-full"
                                    value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input type="email" required className="input input-bordered w-full"
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña {editingUser ? '(dejar vacío para mantener)' : '*'}
                                </label>
                                <input type="password" className="input input-bordered w-full"
                                    required={!editingUser}
                                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                <select className="select select-bordered w-full" value={formData.rol}
                                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
                                    <option value="cliente">Cliente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            {editingUser && (
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="checkbox checkbox-primary" checked={formData.activo}
                                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} id="activo" />
                                    <label htmlFor="activo" className="text-sm">Usuario activo</label>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">Cancelar</button>
                                <button type="submit" className="btn btn-primary">{editingUser ? 'Actualizar' : 'Crear'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {deleteModalOpen && userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-full">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Eliminar Usuario</h2>
                        </div>

                        <p className="text-gray-600 mb-2">
                            ¿Qué deseas hacer con el usuario <strong>"{userToDelete.nombre}"</strong>?
                        </p>
                        
                        {userBoletas > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ Este usuario tiene <strong>{userBoletas} boleta(s)</strong> registrada(s).
                                </p>
                            </div>
                        )}

                        <div className="space-y-3 mt-4">
                            <button
                                onClick={() => executeDelete('cancel')}
                                className="btn btn-outline w-full"
                            >
                                ❌ Cancelar (No hacer nada)
                            </button>
                            
                            {userBoletas > 0 && (
                                <button
                                    onClick={() => executeDelete('keep-boletas')}
                                    className="btn btn-warning w-full"
                                >
                                    📄 Eliminar usuario y conservar boletas
                                </button>
                            )}
                            
                            <button
                                onClick={() => executeDelete('delete-all')}
                                className="btn btn-error w-full"
                            >
                                🗑️ Eliminar usuario {userBoletas > 0 ? 'y sus boletas' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
