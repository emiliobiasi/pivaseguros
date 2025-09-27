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
import {
  Lightbulb,
  Search as SearchIcon,
  Home,
  Building2,
  Briefcase,
  Flame,
  ClipboardCheck,
  ScrollText,
  FileMinus,
  AlertTriangle,
} from "lucide-react"
import pivaLogo from "@/assets/logo.png"
import { HamburguerMenu } from "../HambuguerMenu/hamburguer-menu"

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
        navigate("/imobiliaria/formulario/seguro-incendio#form", {
          state: { scrollTo: "form" },
        })
        break
      case "seguro-incendio-comercial":
        navigate("/imobiliaria/formulario/seguro-incendio-comercial#form", {
          state: { scrollTo: "form" },
        })
        break
      case "seguro-fianca-residencial":
        navigate("/imobiliaria/formulario/seguro-fianca-residencial#form", {
          state: { scrollTo: "form" },
        })
        break
      case "efetivacao-seguro-fianca":
        navigate("/imobiliaria/formulario/efetivacao-seguro-fianca#form", {
          state: { scrollTo: "form" },
        })
        break
      case "seguro-fianca-empresarial-mais-2-anos":
        navigate(
          "/imobiliaria/formulario/seguro-fianca-empresarial-mais-2-anos#form",
          { state: { scrollTo: "form" } }
        )
        break
      case "seguro-fianca-empresarial-menos-2-anos":
        navigate(
          "/imobiliaria/formulario/seguro-fianca-empresarial-menos-2-anos#form",
          { state: { scrollTo: "form" } }
        )
        break
      case "titulo-capitalizacao":
        navigate("/imobiliaria/formulario/titulo-capitalizacao#form", {
          state: { scrollTo: "form" },
        })
        break
      case "cancelamento-seguros":
        navigate("/imobiliaria/formulario/cancelamento-seguros#form", {
          state: { scrollTo: "form" },
        })
        break
      case "abertura-sinistro":
        navigate("/imobiliaria/formulario/abertura-sinistro#form", {
          state: { scrollTo: "form" },
        })
        break

      default:
        break
    }
  }

  // UI state for the new visual selector
  const [query, setQuery] = useState("")
  const [showClassic, setShowClassic] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  // Grouped options with friendly descriptions to help new users
  const formGroups: Array<{
    name: string
    items: Array<{
      value: string
      label: string
      Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    }>
  }> = [
    {
      name: "Análises",
      items: [
        {
          value: "seguro-fianca-residencial",
          label: "Análise Fiança Residencial",
          Icon: Home,
        },
        {
          value: "seguro-fianca-empresarial-mais-2-anos",
          label:
            "Análise Fiança Pessoa Jurídica Comercial (CNPJ ACIMA DE 2 ANOS)",
          Icon: Briefcase,
        },
        {
          value: "seguro-fianca-empresarial-menos-2-anos",
          label:
            "Análise Fiança Pessoa Física Comercial (CNPJ MENOS DE 2 ANOS)",
          Icon: Briefcase,
        },
      ],
    },
    {
      name: "Efetivações",
      items: [
        {
          value: "seguro-incendio",
          label: "Efetivação de Seguro Incêndio Residencial",
          Icon: Flame,
        },
        {
          value: "seguro-incendio-comercial",
          label: "Efetivação de Seguro Incêndio Comercial",
          Icon: Building2,
        },
        {
          value: "efetivacao-seguro-fianca",
          label: "Efetivação de Seguro Fiança",
          Icon: ClipboardCheck,
        },
        {
          value: "titulo-capitalizacao",
          label: "Efetivação de Título de Capitalização",
          Icon: ScrollText,
        },
      ],
    },
    {
      name: "Cancelamentos",
      items: [
        {
          value: "cancelamento-seguros",
          label: "Cancelamento de Apólices / Títulos",
          Icon: FileMinus,
        },
      ],
    },
    {
      name: "Sinistros",
      items: [
        {
          value: "abertura-sinistro",
          label: "Abertura de Sinistro",
          Icon: AlertTriangle,
        },
      ],
    },
  ]

  const normalise = (s: string) => s.toLowerCase()
  const filteredGroups = formGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => {
        if (!query) return true
        const q = normalise(query)
        return normalise(it.label).includes(q) || normalise(g.name).includes(q)
      }),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {/* HEADER */}
        <section className="bg-gradient-to-b from-green-700 to-green-800">
          <div className="container mx-auto text-white px-4 md:px-6 pt-3 md:pt-4">
            {/* Top bar with menu only (logo integrated with title below) */}
            <div className="flex items-center mb-3 md:mb-4">
              <HamburguerMenu />
            </div>

            {/* Title area */}
            <div className="py-8 md:py-12">
              <div className="grid items-center gap-4 md:gap-6 md:grid-cols-12">
                <div className="md:col-span-8 text-center md:text-left">
                  <h1 className="font-bold tracking-tight text-3xl md:text-4xl max-w-3xl md:mx-0 mx-auto">
                    Olá {imobiliariaName || "imobiliária"}, suas soluções de
                    locação estão aqui.
                  </h1>
                </div>
                <div className="md:col-span-4 flex md:justify-end justify-center mt-4 md:mt-0">
                  <div
                    onClick={() => navigate("/imobiliaria/formulario")}
                    className="h-16 md:h-20 cursor-pointer rounded-lg bg-white px-4 shadow-sm border border-white/30 ring-1 ring-black/5 select-none flex items-center justify-center"
                    aria-label="Ir para a página inicial"
                  >
                    <img
                      src={pivaLogo}
                      alt="Logo"
                      className="h-full w-auto block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-18 mb-6 md:py-12 bg-muted">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* TIP SPACE */}
            <div className="mb-8">
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

            <div className="mb-4">
              <h2 className="text-xl font-bold">
                Selecione o tipo do formulário:
              </h2>
            </div>

            {/* Search input for quick filtering */}
            <div className="mb-6">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar formulário por nome ou categoria"
                  className="w-full h-12 rounded-lg border border-gray-300 bg-white px-10 text-base shadow-sm outline-none ring-offset-background transition focus:border-green-500 focus:ring-2 focus:ring-green-700"
                />
              </div>
            </div>

            {/* Visual, grouped selector */}
            <div className="space-y-6">
              {filteredGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum formulário encontrado para "{query}".
                </p>
              ) : (
                (() => {
                  const multiGroups = filteredGroups.filter(
                    (g) => g.items.length > 1
                  )
                  const singleGroups = filteredGroups.filter(
                    (g) => g.items.length === 1
                  )

                  const Card = ({
                    value,
                    label,
                    Icon,
                  }: {
                    value: string
                    label: string
                    Icon: any
                  }) => {
                    const isSelected = selected === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setSelected(value)
                          setTimeout(() => handleFormSelection(value), 150)
                        }}
                        className={
                          "group relative w-full rounded-lg p-3 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 " +
                          (isSelected
                            ? "border-2 border-green-600 bg-green-50/60 hover:bg-green-50"
                            : "border border-gray-200 bg-white/80 hover:-translate-y-[1px] hover:border-green-400/70 hover:shadow-md")
                        }
                        aria-label={label}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={
                              "rounded-md p-1.5 ring-1 ring-inset " +
                              (isSelected
                                ? "bg-green-600 text-white ring-green-600/30"
                                : "bg-green-50 text-green-700 ring-green-600/15")
                            }
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="text-sm font-medium text-gray-900 leading-snug break-words">
                            {label}
                          </div>
                        </div>
                      </button>
                    )
                  }

                  return (
                    <>
                      {multiGroups.map((group) => (
                        <div key={group.name}>
                          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                            {group.name}
                          </h3>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {group.items.map(({ value, label, Icon }) => (
                              <Card
                                key={value}
                                value={value}
                                label={label}
                                Icon={Icon}
                              />
                            ))}
                          </div>
                        </div>
                      ))}

                      {singleGroups.length > 0 && (
                        <div>
                          <div className="mb-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                            {singleGroups.map((group) => (
                              <div key={group.name}>
                                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                  {group.name}
                                </h3>
                                <Card
                                  value={group.items[0].value}
                                  label={group.items[0].label}
                                  Icon={group.items[0].Icon}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()
              )}
            </div>

            {/* Classic select toggle */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowClassic((s) => !s)}
                className="text-sm font-medium text-green-700 underline underline-offset-2 hover:text-green-800"
              >
                {showClassic
                  ? "Ocultar lista clássica"
                  : "Preferir a lista clássica?"}
              </button>
              {showClassic && (
                <div className="mt-4 grid gap-4 md:grid-cols-1">
                  <Select
                    onValueChange={(value) => {
                      setSelected(value)
                      setTimeout(() => handleFormSelection(value), 150)
                    }}
                  >
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
                        Análise Fiança Pessoa Jurídica Comercial (CNPJ ACIMA DE
                        2 ANOS)
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
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
