import { Truck, Shield, CreditCard, Headphones, Package, Zap } from "lucide-react";

export default function Servicios() {
  const servicios = [
    {
      icon: <Truck size={40} />,
      titulo: "Envíos a Todo el Perú",
      descripcion: "Realizamos envíos a nivel nacional. Arequipa con entrega en 24-48 horas, resto del país en 3-5 días hábiles.",
      detalles: [
        "Envío gratis en compras mayores a S/200",
        "Seguimiento de pedido en tiempo real",
        "Empaque seguro y discreto",
        "Coordinación de entrega por WhatsApp"
      ],
      color: "from-blue-500 to-blue-700"
    },
    {
      icon: <Shield size={40} />,
      titulo: "Productos 100% Originales",
      descripcion: "Garantizamos la autenticidad de todos nuestros productos. Trabajamos directamente con distribuidores autorizados.",
      detalles: [
        "Certificados de autenticidad disponibles",
        "Fechas de vencimiento vigentes",
        "Almacenamiento en condiciones óptimas",
        "Garantía de satisfacción"
      ],
      color: "from-green-500 to-green-700"
    },
    {
      icon: <Headphones size={40} />,
      titulo: "Asesoría Personalizada",
      descripcion: "Te ayudamos a elegir los suplementos ideales según tus objetivos de entrenamiento y necesidades nutricionales.",
      detalles: [
        "Consultas gratuitas por WhatsApp",
        "Recomendaciones según tus metas",
        "Guías de uso y dosificación",
        "Seguimiento de tu progreso"
      ],
      color: "from-purple-500 to-purple-700"
    },
    {
      icon: <CreditCard size={40} />,
      titulo: "Múltiples Métodos de Pago",
      descripcion: "Aceptamos diversos métodos de pago para tu comodidad. Paga como prefieras, de forma segura.",
      detalles: [
        "Transferencia bancaria (BCP, Interbank)",
        "Yape y Plin",
        "Pago contra entrega (solo Arequipa)",
        "PayPal para envíos internacionales"
      ],
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Package size={40} />,
      titulo: "Variedad de Productos",
      descripcion: "Amplio catálogo de suplementos de las mejores marcas internacionales para todos los objetivos.",
      detalles: [
        "Proteínas (Whey, Isolate, Casein)",
        "Creatinas (Monohidrato, HCL)",
        "Pre-entrenos de alta potencia",
        "Vitaminas y accesorios"
      ],
      color: "from-red-500 to-pink-600"
    },
    {
      icon: <Zap size={40} />,
      titulo: "Atención Rápida",
      descripcion: "Respondemos tus consultas en minutos. Nuestro equipo está disponible para ayudarte cuando lo necesites.",
      detalles: [
        "Respuesta en menos de 1 hora",
        "Atención de lunes a domingo",
        "Soporte post-venta",
        "Resolución de problemas inmediata"
      ],
      color: "from-cyan-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Todo lo que necesitas para alcanzar tus metas fitness, con el mejor servicio
          </p>
        </div>
      </section>

      {/* Servicios Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {servicios.map((servicio, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <div className={`bg-gradient-to-r ${servicio.color} p-6 text-white`}>
                  <div className="flex items-center gap-4">
                    {servicio.icon}
                    <h3 className="text-xl font-bold">{servicio.titulo}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{servicio.descripcion}</p>
                  <ul className="space-y-2">
                    {servicio.detalles.map((detalle, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-1">✓</span>
                        {detalle}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Compra */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo Comprar?</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold text-black mb-4">
                1
              </div>
              <h4 className="font-bold mb-2">Elige tus productos</h4>
              <p className="text-gray-600 text-sm">Navega por nuestro catálogo y agrega al carrito</p>
            </div>

            <div className="hidden md:block text-4xl text-gray-300">→</div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold text-black mb-4">
                2
              </div>
              <h4 className="font-bold mb-2">Confirma tu pedido</h4>
              <p className="text-gray-600 text-sm">Revisa tu carrito y procede al checkout</p>
            </div>

            <div className="hidden md:block text-4xl text-gray-300">→</div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold text-black mb-4">
                3
              </div>
              <h4 className="font-bold mb-2">Realiza el pago</h4>
              <p className="text-gray-600 text-sm">Elige tu método de pago preferido</p>
            </div>

            <div className="hidden md:block text-4xl text-gray-300">→</div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                ✓
              </div>
              <h4 className="font-bold mb-2">¡Recibe tu pedido!</h4>
              <p className="text-gray-600 text-sm">Te lo llevamos hasta tu puerta</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="collapse collapse-plus bg-white shadow-lg rounded-xl">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title text-lg font-medium">
                ¿Cuánto tiempo demora el envío?
              </div>
              <div className="collapse-content text-gray-600">
                <p>En Arequipa, los envíos se realizan en 24-48 horas. Para otras ciudades del Perú, el tiempo estimado es de 3-5 días hábiles dependiendo de la ubicación.</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-white shadow-lg rounded-xl">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                ¿Los productos son originales?
              </div>
              <div className="collapse-content text-gray-600">
                <p>Sí, garantizamos 100% la autenticidad de todos nuestros productos. Trabajamos con distribuidores autorizados y podemos proporcionar certificados de autenticidad.</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-white shadow-lg rounded-xl">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                ¿Puedo pagar contra entrega?
              </div>
              <div className="collapse-content text-gray-600">
                <p>El pago contra entrega está disponible solo para pedidos en la ciudad de Arequipa. Para otras ciudades, aceptamos transferencia bancaria, Yape y Plin.</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-white shadow-lg rounded-xl">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                ¿Ofrecen asesoría nutricional?
              </div>
              <div className="collapse-content text-gray-600">
                <p>¡Sí! Ofrecemos asesoría gratuita por WhatsApp. Te ayudamos a elegir los suplementos ideales según tus objetivos y te damos recomendaciones de uso.</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-white shadow-lg rounded-xl">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                ¿Qué pasa si el producto llega dañado?
              </div>
              <div className="collapse-content text-gray-600">
                <p>En el raro caso de que un producto llegue dañado, contáctanos inmediatamente con fotos del empaque y producto. Te enviaremos uno nuevo sin costo adicional.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes más preguntas?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contacto" className="btn btn-warning btn-lg px-8">
              Contactar
            </a>
            <a href="/productos" className="btn btn-outline btn-warning btn-lg px-8">
              Ver Productos
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
