import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import BaseLayout from "./layouts/base";

import Home from "./pages/home";
import ProductosPage from "./pages/productos";
import ProteinaShoppingCart from "./pages/proteina";
import ProductoDetalle from "./pages/producto-detalle";
import CreatinaShoppingCart from "./pages/creatina";
import CreatinaDetalle from "./pages/creatina-detalle";
import PreentrenoShoppingCart from "./pages/preentreno";
import PreentrenoDetalle from "./pages/preentreno-detalle";
import CarritoPage from "./pages/carrito";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Register from "./pages/register";
import BoletaPage from "./pages/boleta";
import HistorialPage from "./pages/historial";

import AdminLayout from "./layouts/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminBoletas from "./pages/admin/AdminBoletas";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="proteina" element={<ProteinaShoppingCart />} />
            <Route path="proteina/:id" element={<ProductoDetalle />} />
            <Route path="creatina" element={<CreatinaShoppingCart />} />
            <Route path="creatina/:id" element={<CreatinaDetalle />} />
            <Route path="preentreno" element={<PreentrenoShoppingCart />} />
            <Route path="preentreno/:id" element={<PreentrenoDetalle />} />
            <Route path="carrito" element={<CarritoPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="boleta/:id" element={<BoletaPage />} />
            <Route path="historial" element={<HistorialPage />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<div className="text-xl">Bienvenido al Panel Administrativo</div>} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="boletas" element={<AdminBoletas />} />
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
      <Toaster richColors />
    </BrowserRouter>
  );
}
