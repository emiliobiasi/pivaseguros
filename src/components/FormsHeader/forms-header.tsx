import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import pb from "@/utils/backend/pb-imob"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb } from "lucide-react"

export function FormsHeader() {
  const navigate = useNavigate()

  const currentUser = pb.authStore.model as any
  const imobiliariaName = currentUser?.nome || ""

  // Tip expira automaticamente em (25/09/2025 + 2 meses + 20 dias) = 15/12/2025 23:59:59
  const TIP_BASE_DATE = new Date(2025, 8, 25, 0, 0, 0) // mês 8 = setembro
  const addMonths = (date: Date, months: number) => {
    const d = new Date(date)
    d.setMonth(d.getMonth() + months)
    return d
  }
  const addDays = (date: Date, days: number) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }
  const TIP_EXPIRY_MS = (() => {
    const afterMonths = addMonths(TIP_BASE_DATE, 2)
    const afterMonthsAndDays = addDays(afterMonths, 20)
    afterMonthsAndDays.setHours(23, 59, 59, 999)
    return afterMonthsAndDays.getTime()
  })()

  const [showTip, setShowTip] = useState<boolean>(() => {
    try {
      if (localStorage.getItem("formsHeaderNewFormsTipDismissed") === "1") {
        return false
      }
      const now = Date.now()
      const stored = localStorage.getItem("formsHeaderNewFormsTipExpiry")
      const expiry = stored ? Number(stored) : TIP_EXPIRY_MS
      if (!stored) {
        try {
          localStorage.setItem(
            "formsHeaderNewFormsTipExpiry",
            String(TIP_EXPIRY_MS)
          )
        } catch {}
      }
      return now < expiry
    } catch {
      return true
    }
  })

  function handleFormSelection(value: string) {
    switch (value) {
      case "seguro-incendio":
        navigate("/imobiliaria/formulario/seguro-incendio")
        break
      case "seguro-incendio-comercial":
        navigate("/imobiliaria/formulario/seguro-incendio-comercial")
        break
      case "seguro-fianca-residencial":
        navigate("/imobiliaria/formulario/seguro-fianca-residencial")
        break
      case "efetivacao-seguro-fianca":
        navigate("/imobiliaria/formulario/efetivacao-seguro-fianca")
        break
      case "seguro-fianca-empresarial-mais-2-anos":
        navigate(
          "/imobiliaria/formulario/seguro-fianca-empresarial-mais-2-anos"
        )
        break
      case "seguro-fianca-empresarial-menos-2-anos":
        navigate(
          "/imobiliaria/formulario/seguro-fianca-empresarial-menos-2-anos"
        )
        break
      case "titulo-capitalizacao":
        navigate("/imobiliaria/formulario/titulo-capitalizacao")
        break
      case "cancelamento-seguros":
        navigate("/imobiliaria/formulario/cancelamento-seguros")
        break
      case "abertura-sinistro":
        navigate("/imobiliaria/formulario/abertura-sinistro")
        break

      default:
        break
    }
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-green-700">
          <div className="container mx-auto text-white px-6 text-center">
            <h1 className="font- font-bold tracking-tighter w-full text-4xl">
              Olá {imobiliariaName || "imobiliária"}, suas soluções de locação
              estão aqui.
            </h1>
          </div>
        </section>

        {/* ESPAÇO PARA A TIP */}
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {showTip && (
              <div className="relative">
                <Alert className="border-amber-300 bg-amber-50 pr-8">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-900">Novidade</AlertTitle>
                  <AlertDescription className="text-amber-900/90">
                    Agora temos 2 novos formulários:{" "}
                    <strong>Abertura de Sinistro</strong> e
                    <strong> Cancelamento de Seguros</strong>.
                  </AlertDescription>
                  <button
                    type="button"
                    aria-label="Fechar aviso"
                    className="absolute right-2 top-2 rounded p-1 text-amber-900/70 hover:bg-amber-100 hover:text-amber-900"
                    onClick={() => {
                      try {
                        localStorage.setItem(
                          "formsHeaderNewFormsTipDismissed",
                          "1"
                        )
                      } catch {}
                      setShowTip(false)
                    }}
                  >
                    ×
                  </button>
                </Alert>
              </div>
            )}
          </div>
        </section>

        <section className="py-20 mb-6 md:py-20 bg-muted">
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

                  {/* CANCELAMENTOS */}
                  <SelectItem
                    value="cancelamento-seguros"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Cancelamento de Seguros
                  </SelectItem>

                  {/* ABERTURA DE SINISTRO */}
                  <SelectItem
                    value="abertura-sinistro"
                    className="w-full py-3 px-4 hover:bg-gray-100 text-lg text-gray-700"
                  >
                    Abertura de Sinistro
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
