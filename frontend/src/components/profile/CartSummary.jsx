import { useState, useEffect } from "react"
import { fetchProteinaData } from "../../herramientas/api"
import { toast } from "sonner"

export default function CartSummary({ carrito, onCompraCompletada }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [procesandoCompra, setProcesandoCompra] = useState(false)

  useEffect(() => {
    async function loadProductos() {
      try {
        const data = await fetchProteinaData()
        setProductos(data)
      } catch (error) {
        console.error("Error cargando productos:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProductos()
  }, [])

  const handleCompletarCompra = async () => {
    if (carrito.length === 0) {
      toast.error("Tu carrito está vacío")
      return
    }

    setProcesandoCompra(true)

    try {
      // Simular procesamiento de compra
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Limpiar carrito del localStorage
      localStorage.removeItem('carrito')
      
      // Disparar evento personalizado para actualizar el navbar
      window.dispatchEvent(new Event('carritoActualizado'))
      
      // Mostrar toast de éxito
      toast.success(`¡Compra completada! ${carrito.length} productos adquiridos`, {
        duration: 4000,
      })
      
      // Notificar al componente padre para actualizar el estado
      if (onCompraCompletada) {
        onCompraCompletada()
      }
      
    } catch (error) {
      toast.error("Error al procesar la compra")
    } finally {
      setProcesandoCompra(false)
    }
  }

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">🛒 Mi Carrito</h3>
          <div className="skeleton h-20 w-full"></div>
        </div>
      </div>
    )
  }

  if (!carrito || carrito.length === 0) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">🛒 Mi Carrito</h3>
          <div className="alert alert-info">
            <span>Tu carrito está vacío</span>
          </div>
        </div>
      </div>
    )
  }

  const productosEnCarrito = carrito.map(id => 
    productos.find(producto => producto.id === id)
  ).filter(Boolean)

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title">🛒 Mi Carrito ({carrito.length} productos)</h3>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {productosEnCarrito.map(producto => (
            <div key={producto.id} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="avatar">
                <div className="w-12 h-12 rounded">
                  <img src={producto.images?.[0] || "/placeholder.jpg"} alt={producto.title} />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{producto.title}</h4>
                <p className="text-xs text-base-content/60">${producto.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-primary btn-wide" 
            onClick={handleCompletarCompra}
            disabled={procesandoCompra || carrito.length === 0}
          >
            {procesandoCompra ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Procesando...
              </>
            ) : (
              "Completar Compra"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}