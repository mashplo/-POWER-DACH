import { useState } from "react"
import { registrarUsuario } from "../herramientas/usuario"

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    // Validaciones básicas
    if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Por favor completa todos los campos")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres")
      return
    }

    // Registrar usuario en el backend
    try {
      const resultado = await registrarUsuario(formData.nombre, formData.email, formData.password)
      
      if (resultado.success) {
        alert("Cuenta creada exitosamente!")
        window.location.href = "/login"
      } else {
        setError(resultado.error || "Error al crear la cuenta")
      }
    } catch (error) {
      setError("Error al conectar con el servidor")
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl mb-6">Crear Cuenta</h2>
          
          <form onSubmit={handleRegister}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input 
                type="text" 
                name="nombre"
                className="input input-bordered w-full" 
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                name="email"
                className="input input-bordered w-full" 
                value={formData.email}
                onChange={handleChange}
                placeholder="tu-email@ejemplo.com"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input 
                type="password" 
                name="password"
                className="input input-bordered w-full" 
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 4 caracteres"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Confirmar Contraseña</span>
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                className="input input-bordered w-full" 
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
              />
            </div>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <button type="submit" className="btn btn-primary w-full">
                Crear Cuenta
              </button>
            </div>
          </form>

          <div className="divider">¿Ya tienes cuenta?</div>
          
          <a href="/login" className="btn btn-outline w-full">
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  )
}