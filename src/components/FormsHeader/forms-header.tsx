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
      case "efetivacao-seguro-fianca":
        navigate("/formulario/efetivacao-seguro-fianca");
        break;
      case "seguro-fianca-empresarial-mais-2-anos":
        navigate("/formulario/seguro-fianca-empresarial-mais-2-anos");
        break;
      case "seguro-fianca-empresarial-menos-2-anos":
        navigate("/formulario/seguro-fianca-empresarial-menos-2-anos");
        break;
      case "titulo-capitalizacao":
        navigate("/formulario/titulo-capitalizacao");
        break;
      default:
        break;
    }
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-green-700">
          <div className="container mx-auto text-white px-6 text-center">
            <h1 className="font- font-bold tracking-tighter w-full text-4xl">
              Bem vindo ao departamento de soluções para locação
            </h1>

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


                  {/* Efetivação de Título de Capitalização */}
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
                    value="efetivacao-seguro-fianca"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Efetivação de Seguro Fiança
                  </SelectItem>
                  <SelectItem
                    value="titulo-capitalizacao"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Efetivação de Título de Capitalização
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
