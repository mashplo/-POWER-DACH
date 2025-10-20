export default function UserWelcome({ usuario }) {
  if (!usuario) {
    return (
      <div className="skeleton h-8 w-48"></div>
    )
  }

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title text-2xl">
          Hola, {usuario.nombre}!
        </h2>
        <p className="text-base-content/70">
          Bienvenido a tu perfil de Power Dutch
        </p>
      </div>
    </div>
  )
}