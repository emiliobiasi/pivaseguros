import { LoginImobiliariaFormCard } from "@/components/LoginImobiliariasFormCard/login-imobiliarias-form-card";
import Footer from "@/components/Footer/footer";

const LoginImobiliarias = () => {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background: "linear-gradient(135deg, #32CD32, #228B22, #006400)",
        minHeight: "100vh",
      }}
    >
      <div className="flex-grow flex items-center justify-center">
        <LoginImobiliariaFormCard />
      </div>
      <Footer />
    </div>
  );
};

export default LoginImobiliarias;
