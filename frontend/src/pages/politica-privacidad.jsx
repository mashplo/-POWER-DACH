import { Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react";

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidad</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tu privacidad es importante para nosotros
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Última actualización: Diciembre 2025
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Resumen */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-12">
              <h2 className="font-bold text-lg mb-2">Resumen</h2>
              <p className="text-gray-700">
                En Power Dutch respetamos tu privacidad y protegemos tus datos personales. 
                Solo recopilamos la información necesaria para procesar tus pedidos y brindarte 
                un mejor servicio. Nunca vendemos ni compartimos tu información con terceros.
              </p>
            </div>

            {/* Secciones */}
            <div className="space-y-12">
              
              {/* Sección 1 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Database className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">1. Información que Recopilamos</h2>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">Recopilamos la siguiente información cuando utilizas nuestros servicios:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Información de cuenta:</strong> Nombre, correo electrónico, contraseña encriptada.</li>
                    <li><strong>Información de contacto:</strong> Número de teléfono, dirección de envío.</li>
                    <li><strong>Información de pedidos:</strong> Historial de compras, productos agregados al carrito.</li>
                    <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, dispositivo utilizado.</li>
                  </ul>
                </div>
              </div>

              {/* Sección 2 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Eye className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">2. Cómo Utilizamos tu Información</h2>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">Utilizamos tu información para:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Procesar y entregar tus pedidos correctamente.</li>
                    <li>Comunicarnos contigo sobre el estado de tu pedido.</li>
                    <li>Brindarte atención al cliente y soporte.</li>
                    <li>Mejorar nuestra plataforma y experiencia de usuario.</li>
                    <li>Enviarte información sobre ofertas y promociones (solo si lo autorizas).</li>
                    <li>Cumplir con obligaciones legales y fiscales.</li>
                  </ul>
                </div>
              </div>

              {/* Sección 3 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Lock className="text-purple-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">3. Protección de Datos</h2>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">Implementamos medidas de seguridad para proteger tu información:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encriptación de contraseñas mediante algoritmos seguros (SHA-256).</li>
                    <li>Conexiones seguras mediante HTTPS.</li>
                    <li>Acceso restringido a datos personales solo a personal autorizado.</li>
                    <li>Copias de seguridad regulares de la base de datos.</li>
                    <li>Monitoreo constante de actividades sospechosas.</li>
                  </ul>
                </div>
              </div>

              {/* Sección 4 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Shield className="text-orange-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">4. Compartir Información</h2>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4"><strong>No vendemos ni alquilamos tu información personal.</strong></p>
                  <p className="mb-4">Solo compartimos información en los siguientes casos:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Empresas de envío:</strong> Compartimos dirección y teléfono para la entrega de pedidos.</li>
                    <li><strong>Procesadores de pago:</strong> Para completar transacciones de forma segura.</li>
                    <li><strong>Requerimientos legales:</strong> Cuando sea exigido por autoridades competentes.</li>
                  </ul>
                </div>
              </div>

              {/* Sección 5 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <UserCheck className="text-cyan-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">5. Tus Derechos</h2>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">Como usuario, tienes derecho a:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales.</li>
                    <li><strong>Rectificación:</strong> Corregir información incorrecta o incompleta.</li>
                    <li><strong>Eliminación:</strong> Solicitar la eliminación de tu cuenta y datos asociados.</li>
                    <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado.</li>
                    <li><strong>Oposición:</strong> Rechazar el uso de tus datos para fines de marketing.</li>
                  </ul>
                  <p className="mt-4">
                    Para ejercer cualquiera de estos derechos, contáctanos a través de nuestros 
                    canales oficiales.
                  </p>
                </div>
              </div>

              {/* Sección 6 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Mail className="text-red-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">6. Cookies</h2>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra plataforma:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio (carrito, sesión).</li>
                    <li><strong>Cookies de preferencias:</strong> Recuerdan tus preferencias de navegación.</li>
                    <li><strong>Cookies de análisis:</strong> Nos ayudan a entender cómo usas el sitio.</li>
                  </ul>
                  <p className="mt-4">
                    Puedes configurar tu navegador para rechazar cookies, aunque esto podría afectar 
                    algunas funcionalidades del sitio.
                  </p>
                </div>
              </div>

              {/* Sección 7 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold">7. Cambios en esta Política</h2>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <p>
                    Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos 
                    sobre cambios significativos a través de nuestro sitio web o por correo electrónico. 
                    Te recomendamos revisar esta página periódicamente para estar informado sobre cómo 
                    protegemos tu información.
                  </p>
                </div>
              </div>

              {/* Contacto */}
              <div className="bg-black text-white rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas?</h2>
                <p className="text-gray-300 mb-6">
                  Si tienes alguna pregunta sobre nuestra política de privacidad o el tratamiento 
                  de tus datos personales, no dudes en contactarnos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="mailto:josenrique.rojas@ucsp.edu.pe" 
                    className="btn btn-warning"
                  >
                    <Mail size={20} />
                    josenrique.rojas@ucsp.edu.pe
                  </a>
                  <a href="/contacto" className="btn btn-outline btn-warning">
                    Ir a Contacto
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
