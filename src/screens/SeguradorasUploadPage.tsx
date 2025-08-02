import { useState } from "react"
import { Header } from "@/components/header"
import { SearchSection } from "@/components/search-section"
import { InsuranceGrid } from "@/components/insurance-grid"
import { FileList } from "@/components/file-list"
import { Button } from "@/components/ui/button"
import { UploadedFile } from "@/types/Insurance"
import { Toaster } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { SummaryDialog } from "@/components/summary-dialog"
import { UploadInstructions } from "@/components/upload-instructions"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { ErrorModal } from "@/components/error-modal"
import { Imobiliaria } from "@/types/Imobiliarias"

import { Mail, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { createEnvioDeBoletos } from "@/utils/api/EnvioDeBoletosService"

export default function SeguradorasUploadPage() {
  // Estado de qual imobiliária está selecionada
  const [selectedImobiliaria, setSelectedRealEstate] =
    useState<Imobiliaria | null>(null)

  // Estado com todos os arquivos que foram "dropados" (upload)
  const [files, setFiles] = useState<UploadedFile[]>([])

  // Estado do modal de sumário (antes de enviar efetivamente)
  const [showSummary, setShowSummary] = useState(false)

  // Estados dos modais de confirmação e erro
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Estado de loading de envio
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ===============================================
  // 1. Lista de TODOS OS SUBCAMPOS que queremos validar
  // ===============================================
  const ALL_SUBFIELDS = [
    "porto_boleto_fianca_essencial",
    "porto_boleto_fianca_tradicional",
    "porto_boleto_incendio_residencial",
    "porto_boleto_incendio_comercial",
    "potencial_boleto_fianca",
    "tokio_boleto_fianca",
    "tokio_relatorio_fianca",
    "too_boleto_fianca",
    "too_relatorio_fianca",
  ] as const

  // ===============================================
  // 2. Função que verifica se TODOS OS SUBCAMPOS estão completos
  // ===============================================
  function allSubfieldsAreComplete(
    imobi: Imobiliaria,
    uploads: { [field: string]: number }
  ): boolean {
    for (const field of ALL_SUBFIELDS) {
      const required = imobi[field] ?? 0 // o que precisa (ex. 2 boletos)
      const uploaded = uploads[field] ?? 0 // o que o usuário enviou
      // Se enviou menos que o necessário, está incompleto => false
      if (uploaded < required) {
        return false
      }
    }
    return true // se nenhum subcampo falhou, está tudo completo
  }

  // ===============================================
  // Função disparada quando escolhemos a imobiliária
  // ===============================================
  const handleRealEstateSelect = (company: Imobiliaria) => {
    setSelectedRealEstate(company)
    setFiles([])
  }

  // ===============================================
  // Função que processa o upload de novos arquivos
  // ===============================================
  const handleFileUpload = (newFiles: File[], subField: string) => {
    setFiles((prevFiles) => {
      const updated = [...prevFiles]
      newFiles.forEach((file) => {
        // Checa se já existe o mesmo arquivo para o mesmo subcampo
        const alreadyExists = updated.some(
          (f) => f.name === file.name && f.insuranceCompany === subField
        )
        if (!alreadyExists) {
          // Adiciona ao array
          updated.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type.includes("pdf") ? "PDF" : "Excel",
            insuranceCompany: subField,
            status: "success",
            file: file,
          })
        }
      })
      return updated
    })
  }

  // ===============================================
  // Função que deleta um arquivo da lista
  // ===============================================
  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  // ===============================================
  // Contagem de arquivos já enviados por subcampo
  // ===============================================
  const uploadedFilesCount = files.reduce((acc, file) => {
    // "file.insuranceCompany" é o nome do subcampo, ex: "porto_boleto_fianca_essencial"
    const key = file.insuranceCompany
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as { [field: string]: number })

  // ===============================================
  // 3. Verifica se a imobiliária está completa
  // ===============================================
  const canSendAll = selectedImobiliaria
    ? allSubfieldsAreComplete(selectedImobiliaria, uploadedFilesCount)
    : false

  // ===============================================
  // Função que dispara o envio real (cria o registro PocketBase)
  // ===============================================
  const handleSubmit = async () => {
    if (!selectedImobiliaria) return

    setIsSubmitting(true)
    try {
      // Prepara para enviar
      const arquivos = files.map((file) => file.file)
      const envioData = {
        imobiliaria: selectedImobiliaria.id,
        finalizado: true,
      }

      await createEnvioDeBoletos(envioData, arquivos)

      setShowSummary(false)
      setShowConfirmation(true)
    } catch (error) {
      console.error("Erro ao criar o envio de boletos:", error)
      setErrorMessage(
        "Houve um erro ao criar o envio de boletos. Tente novamente."
      )
      setShowError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fecha modal de sucesso e limpa tudo
  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    setSelectedRealEstate(null)
    setFiles([])
  }

  // Fecha modal de erro
  const handleErrorClose = () => {
    setShowError(false)
    setErrorMessage("")
  }

  // ===============================================
  // Render
  // ===============================================
  return (
    <div className="flex flex-col justfy-center overflow-y-auto max-h-screen">
      <Header />
      <SearchSection onSelect={handleRealEstateSelect} />

      <div className="p-8">
        {/* Exibe dados da imobiliária selecionada */}
        {selectedImobiliaria && (
          <Card className="w-full max-w-3xl mx-auto mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {selectedImobiliaria?.nome ||
                        "Imobiliária não encontrada"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedImobiliaria?.email ||
                        "Imobiliária não encontrada"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedImobiliaria?.username ||
                        "Imobiliária não encontrada"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <AnimatePresence mode="wait">
          {selectedImobiliaria && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="container mx-auto py-8 space-y-8"
            >
              <UploadInstructions />

              <InsuranceGrid
                onFileUpload={handleFileUpload}
                uploadedFiles={uploadedFilesCount}
                imobiliaria={selectedImobiliaria}
              />

              <FileList files={files} onDelete={handleDelete} />

              <div className="flex justify-center mt-4">
                <Button
                  size="lg"
                  onClick={() => setShowSummary(true)}
                  disabled={!canSendAll || isSubmitting}
                  className={`bg-gradient-to-r from-green-600 to-green-700 
                    hover:from-green-700 hover:to-green-800 text-white 
                    shadow-lg hover:shadow-xl transition-shadow
                    ${!canSendAll ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Enviar Boletos
                </Button>
              </div>

              {/* Modal de sumário antes do envio */}
              <SummaryDialog
                isOpen={showSummary}
                onClose={() => setShowSummary(false)}
                onConfirm={handleSubmit}
                files={files}
                realEstateName={selectedImobiliaria?.nome || ""}
                isSubmitting={isSubmitting}
              />

              {/* Modal de sucesso */}
              <ConfirmationModal
                isOpen={showConfirmation}
                onClose={handleConfirmationClose}
                realEstateName={selectedImobiliaria?.nome || ""}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de erro */}
        <ErrorModal
          isOpen={showError}
          onClose={handleErrorClose}
          errorMessage={errorMessage}
        />

        <Toaster />
      </div>
    </div>
  )
}
