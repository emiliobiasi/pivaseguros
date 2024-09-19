import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
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
      case "seguro-fianca-residencial":
        navigate("/formulario/seguro-fianca-residencial");
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
        <section className="lg:p-28 py-12 md:py-20 bg-green-600">
          <div className="container text-white px-10 md:px-6 md:pl-20">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-xl">
                Seja bem vindo ao Departamento de Soluções para Locação da Piva
                Seguros
              </h1>
            </div>
            <p className="mt-4 max-w-[700px] md:text-xl">
              Selecione qual formulário deseja preencher.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                Selecione o tipo do formulário:
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-1">
              <Select onValueChange={(value) => handleFormSelection(value)}>
                <SelectTrigger className="w-full h-12 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out">
                  <SelectValue placeholder="Opções" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-md bg-white rounded-lg shadow-lg">
                  <SelectItem
                    value="seguro-incendio"
                    className="py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Seguro Incêndio
                  </SelectItem>
                  <SelectItem
                    value="seguro-fianca-residencial"
                    className="py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Seguro Fiança: Finalidade Residencial
                  </SelectItem>
                  <SelectItem
                    value="seguro-fianca-empresarial-mais-2-anos"
                    className="py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Seguro Fiança: Finalidade Empresarial {"(ACIMA DE 2 ANOS)"}
                  </SelectItem>
                  <SelectItem
                    value="seguro-fianca-empresarial-menos-2-anos"
                    className="py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Seguro Fiança: Finalidade Empresarial {"(MENOS DE 2 ANOS)"}
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

// function FileIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
//       <path d="M14 2v4a2 2 0 0 0 2 2h4" />
//     </svg>
//   );
// }

// function InboxIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
//       <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
//     </svg>
//   );
// }

// function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
//     </svg>
//   );
// }

// function SendIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m22 2-7 20-4-9-9-4Z" />
//       <path d="M22 2 11 13" />
//     </svg>
//   );
// }

// function Trash2Icon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M3 6h18" />
//       <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//       <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//       <line x1="10" x2="10" y1="11" y2="17" />
//       <line x1="14" x2="14" y1="11" y2="17" />
//     </svg>
//   );
// }
