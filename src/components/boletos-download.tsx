import { useState, useEffect } from 'react'
import { Download, CheckCircle, ArrowRight, PartyPopper } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from './circular-progress'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface Boleto {
  id: string
  nome: string
  url: string
}

const boletos: Boleto[] = [
  { id: '1', nome: 'Boleto Janeiro', url: '/boletos/janeiro.pdf' },
  { id: '2', nome: 'Boleto Fevereiro', url: '/boletos/fevereiro.pdf' },
  { id: '3', nome: 'Boleto Março', url: '/boletos/marco.pdf' },
]

export default function BoletosDownload() {
  const [downloadedBoletos, setDownloadedBoletos] = useState<Set<string>>(new Set())
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [currentDownloadId, setCurrentDownloadId] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const handleDownload = async (boleto: Boleto) => {
    setIsDownloading(true)
    setCurrentDownloadId(boleto.id)
    for (let i = 0; i <= 100; i += 5) {
      setDownloadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    setDownloadedBoletos(prev => new Set(prev).add(boleto.id))
    setIsDownloading(false)
    setDownloadProgress(0)
    setCurrentDownloadId(null)
  }

  const allDownloaded = downloadedBoletos.size === boletos.length
  const progress = (downloadedBoletos.size / boletos.length) * 100

  const handleFinalize = () => {
    if (allDownloaded) {
      setShowCelebration(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-br from-green-50 to-green-100 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-700 to-green-800 text-white">
        <CardTitle className="text-2xl font-bold">Seus Boletos</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 flex justify-center">
          <CircularProgress progress={progress} size={100} strokeWidth={8} />
        </div>
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center mb-6"
            >
              <PartyPopper className="h-16 w-16 mx-auto text-green-600 mb-2" />
              <h2 className="text-2xl font-bold text-green-700">Parabéns!</h2>
              <p className="text-green-600">Você baixou todos os boletos disponíveis.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-4">
          {boletos.map((boleto) => (
            <motion.div
              key={boleto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
            >
              <span className="font-medium text-gray-700">{boleto.nome}</span>
              <AnimatePresence mode="wait">
                {downloadedBoletos.has(boleto.id) ? (
                  <motion.div
                    key="downloaded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-green-500"
                  >
                    <CheckCircle className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="download"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(boleto)}
                      disabled={isDownloading}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white border-none hover:from-green-700 hover:to-green-800 transition-all duration-300"
                    >
                      {isDownloading && currentDownloadId === boleto.id ? (
                        <div className="flex items-center justify-center">
                          <CircularProgress progress={100} size={24} strokeWidth={3} />
                        </div>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-green-100 p-6">
        <Button 
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          onClick={handleFinalize}
          disabled={!allDownloaded}
        >
          {allDownloaded ? (
            <>
              Finalizar
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            'Baixe todos os boletos para finalizar'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

