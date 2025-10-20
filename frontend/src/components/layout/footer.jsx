export default function Footer() {
    return (
        <footer className="footer footer-center p-10 bg-black text-white">
            <aside>
                <h2 className="text-2xl font-bold mb-4">Power Dutch</h2>
                <p className="text-white max-w-md ">
                    Innovación y calidad en cada proyecto
                </p>
                <p className="text-sm text-white/60 mt-2">
                    Copyright © 2024 - Todos los derechos reservados
                </p>
            </aside>
            <nav>
                <div className="grid grid-cols-1 gap-4">
                    <a className="link link-hover">Sobre nosotros</a>
                    <a className="link link-hover">Contacto</a>
                    <a className="link link-hover">Servicios</a>
                    <a className="link link-hover">Política de privacidad</a>
                </div>
            </nav>
        </footer>
    )
}