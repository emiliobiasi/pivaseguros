import Footer from "@/components/Footer/footer";
import CadastrarImobiliariasFormCard from "@/components/CadastrarImobiliariasFormCard/cadastrar-imobiliarias-form-card";

const CadastrarImobiliarias = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center">
        <CadastrarImobiliariasFormCard />
      </div>
      <Footer />
    </div>
  );
};

export default CadastrarImobiliarias;
