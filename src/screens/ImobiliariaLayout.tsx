import { Outlet } from "react-router-dom"
import Footer from "@/components/Footer/footer"
import { HeaderFormMenu } from "@/components/HeaderFormMenu/header-form-menu"

const ImobiliariaLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <HeaderFormMenu />

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  )
}

export default ImobiliariaLayout
