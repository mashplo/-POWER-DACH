import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { loginUsuario } from "../herramientas/usuario"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [mostrarPassword, setMostrarPassword] = useState(false)

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
              <div className="relative">
                <input 
                  type={mostrarPassword ? "text" : "password"}
                  className="input input-bordered w-full pr-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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