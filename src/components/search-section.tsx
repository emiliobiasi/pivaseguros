import { SearchBar } from "./search-bar"
import { Imobiliaria } from "@/types/Imobiliarias"
import { Building2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface SearchSectionProps {
  onSelect: (company: Imobiliaria) => void
  onClear?: () => void
}

export function SearchSection({ onSelect, onClear }: SearchSectionProps) {
  return (
    <div className="relative bg-gray-50 border-b border-green-100">
      {/* Efeito de fundo animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <Sparkles className="h-6 w-6 text-green-600 animate-pulse" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
              Selecione a Imobiliária
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Escolha a imobiliária para gerenciar e enviar os boletos das
              seguradoras de forma rápida e organizada
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SearchBar onSelect={onSelect} onClear={onClear} />
          </motion.div>

          {/* Indicador visual sutil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-6 text-sm text-gray-500"
          >
            <p className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Digite o nome para começar a buscar
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
