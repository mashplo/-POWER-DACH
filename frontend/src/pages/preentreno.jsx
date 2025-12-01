import { useState, useEffect } from "react";
import { API_BASE_URL } from "../herramientas/config";
import Card from "../components/preentreno/card";

export default function PreentrenoShoppingCart() {
    const [preentrenos, setPreentrenos] = useState([]);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                if (!API_BASE_URL) return;
                const response = await fetch(`${API_BASE_URL}/api/v1/preentrenos`);
                const data = await response.json();
                setPreentrenos(data);
            } catch (error) {
                console.error("Error al obtener preentrenos:", error);
            }
        };
        obtenerDatos();
    }, []);

    return (
        <div className="px-10 py-20">
            <h1 className="text-3xl font-bold mb-6">PRE-ENTRENOS</h1>
            <p>Eleva tu energía y enfoque con nuestros pre-entrenos de alta potencia. ¡Entrena como nunca antes!</p>
            <div className="divider"></div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {preentrenos.map(preentreno => (
                    <li key={preentreno.id}>
                        <Card producto={preentreno} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
