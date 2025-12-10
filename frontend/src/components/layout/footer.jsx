import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer footer-center p-10 bg-black text-white">
            <aside>
                <h2 className="text-2xl font-bold mb-4">Power Dutch</h2>
                <p className="text-white max-w-md ">
                    Innovación y calidad en cada proyecto
                </p>
                <p className="text-sm text-white/60 mt-2">
                    Copyright © 2025 - Todos los derechos reservados
                </p>
            </aside>
            <nav>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/sobre-nosotros" className="link link-hover hover:text-yellow-400 transition-colors">Sobre nosotros</Link>
                    <Link to="/contacto" className="link link-hover hover:text-yellow-400 transition-colors">Contacto</Link>
                    <Link to="/servicios" className="link link-hover hover:text-yellow-400 transition-colors">Servicios</Link>
                    <Link to="/politica-privacidad" className="link link-hover hover:text-yellow-400 transition-colors">Política de privacidad</Link>
                </div>
            </nav>
        </footer>
    )
}