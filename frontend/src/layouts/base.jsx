import { Outlet } from "react-router-dom"
import Navbar from "../components/layout/navbar"
import Footer from "../components/layout/footer"

export default function BaseLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}