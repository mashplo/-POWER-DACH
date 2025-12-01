import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // También puedes registrar el error en un servicio de reporte de errores
        console.error("Error capturado por ErrorBoundary:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Puedes renderizar cualquier UI personalizada
            return (
                <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
                    <h1>Algo salió mal.</h1>
                    <p>Lo sentimos, ha ocurrido un error inesperado.</p>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px', color: 'red' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
                    >
                        Recargar página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
