import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FormsHeader() {
  const navigate = useNavigate();

  function handleFormSelection(value: string) {
    switch (value) {
      case "seguro-incendio":
        navigate("/formulario/seguro-incendio");
        break;
      case "seguro-incendio-comercial":
        navigate("/formulario/seguro-incendio-comercial");
        break;
      case "seguro-fianca-residencial":
        navigate("/formulario/seguro-fianca-residencial");
        break;
      case "seguro-fianca":
        navigate("/formulario/seguro-fianca");
        break;
      case "seguro-fianca-empresarial-mais-2-anos":
        navigate("/formulario/seguro-fianca-empresarial-mais-2-anos");
        break;
      case "seguro-fianca-empresarial-menos-2-anos":
        navigate("/formulario/seguro-fianca-empresarial-menos-2-anos");
        break;
      default:
        break;
    }
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="lg:pb-50 lg:pt-10 lg:px-40 py-12 md:py-20 bg-green-700">
          <div className="container text-white px-10 md:px-6 md:pl-20">
            <div>
              <h1 className="text-3x1 font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-xl">
                Bem vindo ao departamento de soluções para locação
              </h1>
            </div>
            <p className="mt-4 max-w-[700px] md:text-xl">
              Selecione qual formulário deseja preencher.
            </p>
          </div>
        </section>

        <section className="py-20 mb-20 md:py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                Selecione o tipo do formulário:
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-1">
              <Select onValueChange={(value) => handleFormSelection(value)}>
                <SelectTrigger className="w-full h-12 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-500 transition duration-150 ease-in-out">
                  <SelectValue placeholder="Opções" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-xl bg-white rounded-lg shadow-lg">
                  {/* ANALISES */}
                  <SelectItem
                    value="seguro-fianca-residencial"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Análise Fiança Residencial
                  </SelectItem>
                  <SelectItem
                    value="seguro-fianca-empresarial-mais-2-anos"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700 whitespace-normal"
                  >
                    Análise Fiança Pessoa Jurídica Comercial (CNPJ ACIMA DE 2
                    ANOS)
                  </SelectItem>
                  <SelectItem
                    value="seguro-fianca-empresarial-menos-2-anos"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700 whitespace-normal"
                  >
                    Análise Fiança Pessoa Física Comercial (CNPJ MENOS DE 2
                    ANOS)
                  </SelectItem>

                  {/* EFETIVAÇÕES */}
                  <SelectItem
                    value="seguro-incendio"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Efetivação de Seguro Incêndio Residencial
                  </SelectItem>
                  <SelectItem
                    value="seguro-incendio-comercial"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Efetivação de Seguro Incêndio Comercial
                  </SelectItem>
                  <SelectItem
                    value="seguro-fianca"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Efetivação de Seguro Fiança
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
