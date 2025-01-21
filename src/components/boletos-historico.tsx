import { useState, useEffect } from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface HistoricoBoleto {
  id: string
  nome: string
  dataDownload: string
  vencimento: string
  valor: string
}

export default function BoletosHistorico() {
  const [historico, setHistorico] = useState<HistoricoBoleto[]>([])

  useEffect(() => {
    const storedBoletos = localStorage.getItem('historicoBoletosDownload')
    if (storedBoletos) {
      const parsedBoletos = JSON.parse(storedBoletos)
      parsedBoletos.sort((a: { dataDownload: string | number | Date }, b: { dataDownload: string | number | Date }) => new Date(b.dataDownload).getTime() - new Date(a.dataDownload).getTime())
      setHistorico(parsedBoletos)
    }
  }, [])

  if (historico.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-xl font-semibold">Nenhum boleto foi baixado ainda.</p>
        <p className="mt-2">Os boletos que você baixar aparecerão aqui.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {historico.map((boleto) => (
          <div
            key={boleto.id}
            className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md"
          >
            <div className="flex flex-col mb-2 sm:mb-0">
              <span className="font-medium text-gray-700 text-lg">{boleto.nome}</span>
              <span className="text-sm text-gray-500">Baixado em: {boleto.dataDownload}</span>
              <span className="text-sm text-gray-500">Vencimento: {boleto.vencimento}</span>
              <span className="text-sm text-gray-500">Valor: {boleto.valor}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 w-full sm:w-auto mt-2 sm:mt-0"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Novamente
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

