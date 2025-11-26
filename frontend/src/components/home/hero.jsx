export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}>
            {/* Overlay opaco */}
            <div className="absolute inset-0 bg-black opacity-60"></div>
            
            {/* Contenido */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Equipamiento de Gimnasio Premium
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                    Encuentra todo lo que necesitas para tu entrenamiento. 
                    Calidad profesional al mejor precio.
                </p>
                <a href="/proteina" className="btn btn-primary btn-lg">
                    Ver proteina
                </a>
            </div>
        </section>
    )
}