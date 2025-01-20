import { SearchBar } from './search-bar'
import { RealEstate } from '@/types/insurance'

interface SearchSectionProps {
  onSelect: (company: RealEstate) => void
}

export function SearchSection({ onSelect }: SearchSectionProps) {
  return (
    <div className="relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 via-green-50/25 to-green-100/50 blur-3xl -z-10" />
      <div className="container py-12">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h2 className="text-xl font-semibold mb-3 text-black">
            Selecione a Imobiliária
          </h2>
          <p className="text-black">
            Escolha a imobiliária para gerenciar os boletos das seguradoras
          </p>
        </div>
        <SearchBar onSelect={onSelect} />
      </div>
    </div>
  )
}

