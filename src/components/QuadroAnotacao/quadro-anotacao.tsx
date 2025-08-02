import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import {
  fetchQuadroAnotacao,
  updateQuadroAnotacao,
  subscribeToQuadroAnotacaoUpdates,
  unsubscribeFromQuadroAnotacaoUpdates,
} from "@/utils/api/QuadroAnotacaoService"

export function QuadroAnotacao() {
  const [values, setValues] = useState({
    metaAnual: "",
    faltaMeta: "",
    acumuladoAnual: "",
    metaMensal: "",
    mesAtual: "",
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Função assíncrona para buscar dados do banco
    const fetchData = async () => {
      try {
        const data = await fetchQuadroAnotacao()

        // Atualiza o estado com os dados recebidos e formata os valores
        setValues({
          metaAnual: formatCurrency(data.meta_anual || ""),
          faltaMeta: formatCurrency(data.falta_para_meta || "", true),
          acumuladoAnual: formatCurrency(data.acumulado_anual || ""),
          metaMensal: formatCurrency(data.meta_mensal || ""),
          mesAtual: data.mes_atual || "",
        })

        setLoading(false)
      } catch (err) {
        console.error("Erro ao buscar dados do Quadro de Anotação:", err)
        setError("Não foi possível carregar os dados.")
        setLoading(false)
      }
    }

    fetchData()

    // Subscrever para atualizações em tempo real
    const handleRealTimeUpdates = (e: any) => {
      const updatedData = e.record
      setValues({
        metaAnual: formatCurrency(updatedData.meta_anual || ""),
        faltaMeta: formatCurrency(updatedData.falta_para_meta || "", true),
        acumuladoAnual: formatCurrency(updatedData.acumulado_anual || ""),
        metaMensal: formatCurrency(updatedData.meta_mensal || ""),
        mesAtual: updatedData.mes_atual || "",
      })
    }

    subscribeToQuadroAnotacaoUpdates(handleRealTimeUpdates)

    // Cancelar a assinatura quando o componente for desmontado
    return () => {
      unsubscribeFromQuadroAnotacaoUpdates()
    }
  }, [])

  const formatCurrency = (value: string, isNegative = false) => {
    let number = value.replace(/\D/g, "")
    if (number === "") return isNegative ? "-R$ 0,00" : "R$ 0,00"

    number = number.replace(/^0+/, "")
    if (number.length === 0 || number.length === 1) {
      number = "00" + number
    } else if (number.length === 2) {
      number = "0" + number
    }

    const integerPart = number.slice(0, -2)
    const decimalPart = number.slice(-2)
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    )
    const formattedValue = `R$ ${formattedIntegerPart},${decimalPart}`
    return isNegative ? `-${formattedValue}` : formattedValue
  }

  const removeCurrencyFormatting = (value: string) => {
    return value.replace(/[R$\s.]/g, "").replace(",", ".")
  }

  const handleInputChange = (field: keyof typeof values, value: string) => {
    const isNegative = field === "faltaMeta"
    const formattedValue = formatCurrency(value, isNegative)
    const newValues = { ...values, [field]: formattedValue }
    setValues(newValues)
  }

  const salvarDados = async () => {
    // console.log("Função salvarDados foi chamada");
    try {
      const dataToUpdate = {
        meta_anual: removeCurrencyFormatting(values.metaAnual),
        falta_para_meta: removeCurrencyFormatting(values.faltaMeta),
        acumulado_anual: removeCurrencyFormatting(values.acumuladoAnual),
        meta_mensal: removeCurrencyFormatting(values.metaMensal),
        mes_atual: values.mesAtual,
      }
      // console.log(
      //   "Dados a serem enviados para updateQuadroAnotacao:",
      //   dataToUpdate
      // );

      await updateQuadroAnotacao(dataToUpdate)
      alert("Dados atualizados com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar os dados:", error)
      alert("Erro ao atualizar os dados.")
    }
  }

  const titles = [
    { key: "metaAnual", label: "META ANUAL" },
    { key: "faltaMeta", label: "FALTA PARA A META ANUAL" },
    { key: "acumuladoAnual", label: "ACUMULADO ANUAL" },
    { key: "metaMensal", label: "META MENSAL" },
    { key: "mesAtual", label: "MÊS ATUAL" },
  ]

  if (loading) {
    return <div className="text-center text-white">Carregando...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-900 via-green-900 to-emerald-800 p-10 rounded-3xl shadow-2xl max-w-7xl mx-auto transition-all duration-500 ease-in-out hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-[1.02] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Botão Salvar no canto superior direito */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {
            // console.log("Botão Salvar clicado");
            salvarDados()
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Salvar
        </button>
      </div>

      <div className="absolute inset-0 bg-green-500 opacity-5 z-0 animate-pulse"></div>

      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-white mb-8 text-center animate-shimmer">
          IMOB (CAP + INC + FIA)
        </h2>
        <div className="grid grid-cols-5 gap-8 mb-6">
          {titles.map(({ key, label }) => (
            <div key={key} className="text-center group">
              <h3
                className={`text-sm font-semibold text-white mb-2 leading-tight transition-all duration-300 group-hover:font-bold transform group-hover:scale-110 ${
                  key === "faltaMeta"
                    ? "group-hover:text-red-300 text-shadow-red"
                    : "group-hover:text-emerald-300 text-shadow-green"
                }`}
              >
                {label}
              </h3>
            </div>
          ))}
        </div>
        <motion.div
          className="grid grid-cols-5 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {titles.map(({ key }) => (
            <motion.div
              key={key}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              className="group"
            >
              <div className="relative">
                <Input
                  type="text"
                  value={values[key as keyof typeof values]}
                  onChange={(e) =>
                    handleInputChange(
                      key as keyof typeof values,
                      e.target.value
                    )
                  }
                  className={`text-center bg-gray-800/50 border-emerald-500/30 rounded-xl shadow-md transition-all duration-300 placeholder-gray-400 font-medium backdrop-blur-sm transform group-hover:scale-105 z-10 relative text-sm sm:text-base w-full ${
                    key === "faltaMeta"
                      ? "text-red-300 focus:border-red-400 focus:ring-red-400 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      : key === "mesAtual"
                      ? "text-blue-100 focus:border-emerald-400 focus:ring-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      : "text-white focus:border-emerald-400 focus:ring-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  }`}
                  placeholder="R$ 0,00"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-xl filter blur-md z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <style>{`
        .text-shadow-green {
          text-shadow: 0 0 10px rgba(16,185,129,0.5);
        }
        .text-shadow-red {
          text-shadow: 0 0 10px rgba(239,68,68,0.5);
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
          background-size: 1000px 100%;
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
      `}</style>
    </motion.div>
  )
}
