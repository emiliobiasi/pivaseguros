import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function UploadInstructions() {
  return (
    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Instruções de Upload</AlertTitle>
      <AlertDescription>
        Cada seguradora possui um número específico de documentos a serem enviados. 
        O número à direita do nome da seguradora indica quantos documentos foram 
        enviados em relação ao total esperado (ex: 2/3 significa que 2 de 3 
        documentos foram enviados). Certifique-se de enviar todos os documentos 
        necessários para cada seguradora.
      </AlertDescription>
    </Alert>
  )
}

