import { LoginImobiliariaFormCard } from "@/components/LoginImobiliariasFormCard/login-imobiliarias-form-card";
import Footer from "@/components/Footer/footer";

const LoginImobiliarias = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center">
        <LoginImobiliariaFormCard />
      </div>
      <Footer />
    </div>
  );
};

export default LoginImobiliarias;
