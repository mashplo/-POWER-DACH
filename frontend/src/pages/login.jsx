import { useState } from "react"
import { loginUsuario } from "../herramientas/usuario"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor completa todos los campos")
      return
    }

    // Login con el backend
    try {
      const resultado = await loginUsuario(email, password)
      
      if (resultado.success) {
        localStorage.setItem("usuarioActual", JSON.stringify(resultado.usuario))
        alert("Login exitoso!")
        window.location.href = "/profile"
      } else {
        setError(resultado.error || "Email o contraseña incorrectos")
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
          <h2 className="card-title text-center text-2xl mb-6">Iniciar Sesión</h2>
          
          <form onSubmit={handleLogin}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                className="input input-bordered w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu-email@ejemplo.com"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input 
                type="password" 
                className="input input-bordered w-full" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
              />
            </div>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <button type="submit" className="btn btn-primary w-full">
                Iniciar Sesión
              </button>
            </div>
          </form>

          <div className="divider">¿No tienes cuenta?</div>
          
          <a href="/register" className="btn btn-outline w-full">
            Crear Cuenta
          </a>
        </div>
      </div>
    </div>
  )
}