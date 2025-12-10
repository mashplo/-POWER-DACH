import { Heart, Award, Target, Users } from "lucide-react";

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Conoce la historia detrás de Power Dutch y nuestra pasión por el fitness
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Nuestra Historia</h2>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  <strong>Power Dutch</strong> nació en el segundo semestre de 2025 como proyecto final universitario, 
                  fundado por dos estudiantes apasionados: <strong>Esaúl Matías Kefren Zegarra Meza</strong> y <strong>Josenrique Rojas Sánchez</strong>.
                </p>
                
                <p className="mb-6">
                  El nombre "Power Dutch" tiene un origen muy especial y emotivo. Todo comenzó con nuestras queridas 
                  perritas salchichas (Dachshund en alemán, "Dutch" como cariñoso apodo). <strong>Canela</strong>, la fiel 
                  compañera de Josenrique, y <strong>Pekas</strong>, la adorada mascota de Esaúl Matías, fueron nuestra 
                  inspiración inicial.
                </p>

                <div className="bg-gray-100 rounded-xl p-6 my-8 border-l-4 border-yellow-500">
                  <p className="italic text-gray-600 mb-4">
                    "El viernes 22 de agosto, aproximadamente a las 10:00 AM, Pekas cruzó el arcoíris. 
                    Su partida nos llenó de tristeza, pero también nos dio más fuerza para continuar 
                    con este proyecto que ella vio nacer."
                  </p>
                  <p className="text-sm text-gray-500">
                    En memoria de Pekas 🐕 - Siempre en nuestros corazones
                  </p>
                </div>

                <p className="mb-6">
                  Power Dutch representa no solo nuestro emprendimiento, sino también el amor por nuestras mascotas 
                  y el poder de la perseverancia. Cada producto que ofrecemos lleva consigo la dedicación y el 
                  cariño que ponemos en todo lo que hacemos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Misión */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-black">
              <div className="flex items-center gap-3 mb-4">
                <Target size={32} />
                <h3 className="text-2xl font-bold">Nuestra Misión</h3>
              </div>
              <p className="text-lg">
                Democratizar el acceso a suplementos deportivos de alta calidad en Arequipa y todo el Perú, 
                ofreciendo productos premium a precios justos, con asesoría personalizada y un servicio 
                excepcional que acompañe a cada persona en su camino hacia una vida más saludable.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Award size={32} />
                <h3 className="text-2xl font-bold">Nuestra Visión</h3>
              </div>
              <p className="text-lg">
                Convertirnos en la tienda de suplementos deportivos de referencia en el sur del Perú, 
                reconocidos por nuestra autenticidad, calidad de productos y el compromiso genuino 
                con el bienestar de nuestra comunidad fitness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Valores</h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-yellow-600" size={32} />
              </div>
              <h4 className="font-bold text-lg mb-2">Pasión</h4>
              <p className="text-gray-600 text-sm">Amamos lo que hacemos y se refleja en cada detalle</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-yellow-600" size={32} />
              </div>
              <h4 className="font-bold text-lg mb-2">Calidad</h4>
              <p className="text-gray-600 text-sm">Solo trabajamos con las mejores marcas del mercado</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-yellow-600" size={32} />
              </div>
              <h4 className="font-bold text-lg mb-2">Comunidad</h4>
              <p className="text-gray-600 text-sm">Construimos relaciones genuinas con nuestros clientes</p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-yellow-600" size={32} />
              </div>
              <h4 className="font-bold text-lg mb-2">Compromiso</h4>
              <p className="text-gray-600 text-sm">Cumplimos lo que prometemos, siempre</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestro Equipo</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl font-bold text-black">JR</span>
              </div>
              <h4 className="font-bold text-xl">Josenrique Rojas Sánchez</h4>
              <p className="text-gray-600">Co-Fundador</p>
              <p className="text-sm text-gray-400 mt-1">josenrique.rojas@ucsp.edu.pe</p>
              <p className="text-sm text-gray-500 mt-2">🐕 Papá de Canela</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">EZ</span>
              </div>
              <h4 className="font-bold text-xl">Esaúl Matías Kefren Zegarra Meza</h4>
              <p className="text-gray-600">Co-Fundador</p>
              <p className="text-sm text-gray-400 mt-1">esaul.zegarra@ucsp.edu.pe</p>
              <p className="text-sm text-gray-500 mt-2">🌈 En memoria de Pekas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar tu transformación?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Explora nuestra selección de suplementos premium y da el primer paso hacia tus metas fitness.
          </p>
          <a href="/productos" className="btn btn-warning btn-lg px-8">
            Ver Productos
          </a>
        </div>
      </section>
    </div>
  );
}
