export default function Hero() {
  return (
    <section
      className="relative h-[calc(100vh-4rem)] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      {/* Overlay más oscuro para mejor contraste */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center text-white px-6 md:px-12 max-w-4xl mx-auto">
        {/* Título principal */}
        <h1 className="font-sans leading-tight tracking-tight mb-8">
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">
            Equipamiento de Gimnasio
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-yellow-400 mt-4 drop-shadow-xl">
            Premium
          </span>
        </h1>
        
        {/* Descripción */}
        <p className="font-sans text-lg sm:text-xl md:text-2xl mb-6 max-w-2xl mx-auto leading-relaxed text-gray-200">
          Encuentra todo lo que necesitas para tu entrenamiento.
        </p>
        
        {/* Subtítulo */}
        <p className="font-sans text-xl sm:text-2xl md:text-2xl mb-12 font-semibold text-white">
          Calidad profesional al mejor precio.
        </p>
        
        {/* Botón CTA */}
        <div className="flex justify-center">
          <a 
            href="/productos" 
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black border-4 border-yellow-400 px-12 md:px-16 py-4 md:py-5 text-xl md:text-2xl font-bold rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
            aria-label="Ver todos los productos"
          >
            Ver Productos
          </a>
        </div>
      </div>
    </section>
  );
}
