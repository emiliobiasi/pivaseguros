import { fetchImobiliariaList } from "@/utils/api/ImobiliariasService"
import { Imobiliaria } from "@/types/Imobiliarias"
import { cn } from "@/lib/utils"
import { Search, Building2, X, Loader2, CheckCircle2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSelect: (company: Imobiliaria) => void
  onClear?: () => void
}

export function SearchBar({ onSelect, onClear }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Imobiliaria | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [realEstateCompanies, setRealEstateCompanies] = useState<Imobiliaria[]>(
    []
  )
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Busca as imobiliárias com debounce
  useEffect(() => {
    const fetchData = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setRealEstateCompanies([])
        return
      }

      setLoading(true)
      try {
        const response = await fetchImobiliariaList(1, 10, searchTerm)
        setRealEstateCompanies(response.items)
      } catch (error) {
        console.error("Erro ao buscar imobiliárias:", error)
        setRealEstateCompanies([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchData, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleSelect = (company: Imobiliaria) => {
    setSelectedCompany(company)
    onSelect(company)
    setOpen(false)
    setSearchTerm("")
  }

  const handleClear = () => {
    setSelectedCompany(null)
    setSearchTerm("")
    setRealEstateCompanies([])
    setOpen(true)
    // Notifica o componente pai para limpar a seleção
    if (onClear) {
      onClear()
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Botão Principal / Input de Busca */}
      {!selectedCompany ? (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Digite o nome da imobiliária..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            className={cn(
              "w-full h-14 pl-12 pr-4 text-base",
              "border-2 border-gray-300 hover:border-green-400 focus:border-green-500",
              "transition-all duration-300",
              "bg-white"
            )}
          />
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={handleClear}
          className={cn(
            "w-full justify-between text-left font-normal h-14 px-6",
            "border-2 border-green-500 shadow-lg shadow-green-100",
            "bg-white hover:bg-green-50/50",
            "transition-all duration-300"
          )}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="h-5 w-5 text-green-700" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-gray-900 truncate">
                {selectedCompany.nome}
              </span>
              <span className="text-xs text-gray-500">
                Imobiliária selecionada
              </span>
            </div>
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 ml-auto" />
          </div>
          <X className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2" />
        </Button>
      )}

      {/* Dropdown de Resultados */}
      {open && !selectedCompany && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl border-2 border-green-100 overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Buscando imobiliárias...</span>
              </div>
            )}

            {!loading && searchTerm.length > 0 && searchTerm.length < 2 && (
              <div className="px-4 py-8 text-center text-gray-500">
                <p className="text-sm">
                  Digite pelo menos 2 caracteres para buscar
                </p>
              </div>
            )}

            {!loading &&
              searchTerm.length >= 2 &&
              realEstateCompanies.length === 0 && (
                <div className="flex flex-col items-center gap-2 px-4 py-8">
                  <Search className="h-8 w-8 text-gray-300" />
                  <p className="text-gray-500 font-medium">
                    Nenhuma imobiliária encontrada
                  </p>
                  <p className="text-sm text-gray-400">
                    Tente buscar com outro nome
                  </p>
                </div>
              )}

            {!loading && realEstateCompanies.length > 0 && (
              <div className="py-2">
                {realEstateCompanies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleSelect(company)}
                    className={cn(
                      "w-full cursor-pointer py-3 px-4 transition-colors",
                      "hover:bg-green-50 text-left",
                      "border-b border-gray-50 last:border-b-0"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-100 transition-colors">
                        <Building2 className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-gray-900 truncate">
                          {company.nome}
                        </span>
                        {company.email && (
                          <span className="text-xs text-gray-500 truncate">
                            {company.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
