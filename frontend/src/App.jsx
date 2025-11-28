import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import BaseLayout from "./layouts/base";

import Home from "./pages/home";
import ProductosPage from "./pages/productos";
import ProteinaShoppingCart from "./pages/proteina";
import ProductoDetalle from "./pages/producto-detalle";
import CreatinaShoppingCart from "./pages/creatina";
import CreatinaDetalle from "./pages/creatina-detalle";
import PreentrenoDetalle from "./pages/preentreno-detalle";
import CarritoPage from "./pages/carrito";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Register from "./pages/register";
import BoletaPage from "./pages/boleta";
import HistorialPage from "./pages/historial";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductosAdmin from "./pages/admin/ProductosAdmin";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";
import BoletasAdmin from "./pages/admin/BoletasAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="proteina" element={<ProteinaShoppingCart />} />
          <Route path="proteina/:id" element={<ProductoDetalle />} />
          <Route path="creatina" element={<CreatinaShoppingCart />} />
          <Route path="creatina/:id" element={<CreatinaDetalle />} />
          <Route path="preentreno/:id" element={<PreentrenoDetalle />} />
          <Route path="carrito" element={<CarritoPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="boleta/:id" element={<BoletaPage />} />
          <Route path="historial" element={<HistorialPage />} />
          {/* Admin routes (protegidos por token/admin en backend) */}
          <Route path="admin" element={<AdminLayout />}>
            <Route path="productos" element={<ProductosAdmin />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
            <Route path="boletas" element={<BoletasAdmin />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}
