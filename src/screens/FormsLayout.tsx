import { Outlet } from "react-router-dom"
import { FormsHeader } from "@/components/FormsHeader/forms-header"
// import { HeaderFormMenu } from "@/components/HeaderFormMenu/header-form-menu";
// import Footer from "@/components/Footer/footer";

const FormsLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      {/* <HeaderFormMenu /> */}
      {/* Header */}

      <FormsHeader />

      {/* Main content area, grows to fill space between header and footer */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      {/* <footer className="mt-auto">
        <Footer />
      </footer> */}
    </div>
  )
}

export default FormsLayout
