import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

import BaseLayout from "./layouts/base"

import Home from "./pages/home"
import ProductosPage from "./pages/productos"
import ProteinaShoppingCart from "./pages/proteina"
import ProductoDetalle from "./pages/producto-detalle"
import CreatinaShoppingCart from "./pages/creatina"
import CreatinaDetalle from "./pages/creatina-detalle"
import Profile from "./pages/profile"
import Login from "./pages/login"
import Register from "./pages/register"

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
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  )
}