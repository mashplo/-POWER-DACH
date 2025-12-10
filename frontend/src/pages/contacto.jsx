import { Mail, Phone, MapPin, Clock, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Abrir WhatsApp con el mensaje
    const mensaje = `Hola Power Dutch! 👋%0A%0A*Nombre:* ${formData.nombre}%0A*Email:* ${formData.email}%0A*Asunto:* ${formData.asunto}%0A%0A*Mensaje:*%0A${formData.mensaje}`;
    window.open(`https://wa.me/51953749865?text=${mensaje}`, "_blank");
    setEnviado(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Información de contacto */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Información de Contacto</h2>
              
              <div className="space-y-6">
                {/* WhatsApp - Josenrique */}
                <a 
                  href="https://wa.me/51953749865" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">WhatsApp - Josenrique</h3>
                    <p className="text-gray-600">+51 953 749 865</p>
                    <p className="text-sm text-green-600 mt-1">Click para chatear →</p>
                  </div>
                </a>

                {/* WhatsApp - Esaúl */}
                <a 
                  href="https://wa.me/51960166144" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">WhatsApp - Esaúl</h3>
                    <p className="text-gray-600">+51 960 166 144</p>
                    <p className="text-sm text-green-600 mt-1">Click para chatear →</p>
                  </div>
                </a>

                {/* Email - Josenrique */}
                <a 
                  href="mailto:josenrique.rojas@ucsp.edu.pe"
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email - Josenrique</h3>
                    <p className="text-gray-600">josenrique.rojas@ucsp.edu.pe</p>
                    <p className="text-sm text-yellow-600 mt-1">Click para enviar email →</p>
                  </div>
                </a>

                {/* Email - Esaúl */}
                <a 
                  href="mailto:esaul.zegarra@ucsp.edu.pe"
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email - Esaúl</h3>
                    <p className="text-gray-600">esaul.zegarra@ucsp.edu.pe</p>
                    <p className="text-sm text-yellow-600 mt-1">Click para enviar email →</p>
                  </div>
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com/josenrique_rojas_" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Instagram className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Instagram</h3>
                    <p className="text-gray-600">@josenrique_rojas_</p>
                    <p className="text-sm text-pink-600 mt-1">Síguenos →</p>
                  </div>
                </a>

                {/* Ubicación */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Ubicación</h3>
                    <p className="text-gray-600">Arequipa, Perú</p>
                    <p className="text-sm text-gray-500 mt-1">Envíos a todo el país</p>
                  </div>
                </div>

                {/* Horarios */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Horario de Atención</h3>
                    <div className="text-gray-600 text-sm mt-2 space-y-1">
                      <p><span className="font-medium">Lunes a Viernes:</span> 9:00 AM - 8:00 PM</p>
                      <p><span className="font-medium">Sábados:</span> 10:00 AM - 6:00 PM</p>
                      <p><span className="font-medium">Domingos:</span> 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Envíanos un Mensaje</h2>
              
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {enviado ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="text-green-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">¡Mensaje Enviado!</h3>
                    <p className="text-gray-600 mb-6">
                      Te redirigimos a WhatsApp para continuar la conversación.
                    </p>
                    <button 
                      onClick={() => setEnviado(false)}
                      className="btn btn-outline"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Nombre completo</span>
                      </label>
                      <input 
                        type="text" 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre" 
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Email</span>
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com" 
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Asunto</span>
                      </label>
                      <select 
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                        required
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="Consulta de productos">Consulta de productos</option>
                        <option value="Estado de mi pedido">Estado de mi pedido</option>
                        <option value="Asesoría nutricional">Asesoría nutricional</option>
                        <option value="Problemas con mi cuenta">Problemas con mi cuenta</option>
                        <option value="Sugerencias">Sugerencias</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Mensaje</span>
                      </label>
                      <textarea 
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        placeholder="Escribe tu mensaje aquí..." 
                        className="textarea textarea-bordered w-full h-32"
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-warning w-full">
                      <MessageCircle size={20} />
                      Enviar por WhatsApp
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Al enviar, serás redirigido a WhatsApp para completar tu consulta.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa o CTA */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Prefieres una respuesta rápida?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Escríbenos directamente por WhatsApp y te responderemos lo antes posible.
          </p>
          <a 
            href="https://wa.me/51953749865?text=Hola%20Power%20Dutch!%20Tengo%20una%20consulta" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-success btn-lg px-8"
          >
            <MessageCircle size={24} />
            Chatear por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
