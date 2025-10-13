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

import { Mail, User, CheckCircle2, AlertCircle, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { createEnvioDeBoletos } from "@/utils/api/EnvioDeBoletosService"
import { Progress } from "@/components/ui/progress"

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
    "potencial_relatorio_fianca",
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
  // Função disparada quando limpamos a busca
  // ===============================================
  const handleClearSearch = () => {
    setSelectedRealEstate(null)
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
  // Calcula o progresso total de upload
  // ===============================================
  const calculateProgress = (): number => {
    if (!selectedImobiliaria) return 0

    let totalRequired = 0
    let totalUploaded = 0

    for (const field of ALL_SUBFIELDS) {
      const required = selectedImobiliaria[field] ?? 0
      const uploaded = uploadedFilesCount[field] ?? 0
      totalRequired += required
      totalUploaded += Math.min(uploaded, required)
    }

    return totalRequired > 0
      ? Math.round((totalUploaded / totalRequired) * 100)
      : 0
  }

  const progress = calculateProgress()

  // ===============================================
  // Verifica se a imobiliária tem algum boleto para enviar
  // ===============================================
  const hasBoletos = (): boolean => {
    if (!selectedImobiliaria) return false

    for (const field of ALL_SUBFIELDS) {
      const required = selectedImobiliaria[field] ?? 0
      if (required > 0) return true
    }
    return false
  }

  const hasBoletosToSend = hasBoletos()

  // ===============================================
  // Render
  // ===============================================
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <SearchSection
          onSelect={handleRealEstateSelect}
          onClear={handleClearSearch}
        />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24">
          {/* Exibe dados da imobiliária selecionada */}
          {selectedImobiliaria && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="w-full max-w-5xl mx-auto mb-6 shadow-lg border-2 border-green-100 bg-gradient-to-r from-white to-green-50/30">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    {/* Informações da Imobiliária */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex h-12 w-12 rounded-full bg-gradient-to-br from-green-600 to-green-700 items-center justify-center text-white font-bold text-lg shadow-md">
                          {selectedImobiliaria.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-gray-800">
                            {selectedImobiliaria.nome}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Envio de boletos
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border">
                          <Mail className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {selectedImobiliaria.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {selectedImobiliaria.username}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    {hasBoletosToSend ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {canSendAll ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-semibold text-green-700">
                                  Todos os arquivos estão anexados, prontos para
                                  serem enviados!
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <span className="text-sm font-semibold text-gray-700">
                                  Progresso de upload
                                </span>
                              </>
                            )}
                          </div>
                          <span className="text-sm font-bold text-gray-800">
                            {progress}%
                          </span>
                        </div>

                        <Progress
                          value={progress}
                          className="h-3 bg-gray-200"
                        />

                        <p className="text-xs text-muted-foreground">
                          {files.length} arquivo{files.length !== 1 ? "s" : ""}{" "}
                          anexado{files.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-gray-700">
                            Nenhum boleto pendente
                          </span>
                          <span className="text-xs text-gray-500">
                            Esta imobiliária não possui boletos para enviar no
                            momento
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {selectedImobiliaria && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="container mx-auto pb-32 space-y-6 max-w-7xl"
              >
                <UploadInstructions />

                <InsuranceGrid
                  onFileUpload={handleFileUpload}
                  uploadedFiles={uploadedFilesCount}
                  imobiliaria={selectedImobiliaria}
                />

                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-32"
                  >
                    <FileList files={files} onDelete={handleDelete} />
                  </motion.div>
                )}

                {/* Botão de Envio Fixo e Destacado */}
                {files.length > 0 && (
                  <motion.div
                    className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-white rounded-2xl shadow-2xl p-4 border-2 border-green-200">
                      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        {!canSendAll && (
                          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-medium">
                              Complete todos os uploads para enviar
                            </span>
                          </div>
                        )}

                        <Button
                          size="lg"
                          onClick={() => setShowSummary(true)}
                          disabled={!canSendAll || isSubmitting}
                          className={`
                        bg-gradient-to-r from-green-600 to-green-700 
                        hover:from-green-700 hover:to-green-800 
                        text-white font-semibold text-lg
                        shadow-xl hover:shadow-2xl 
                        transition-all duration-300
                        px-8 py-6 rounded-xl
                        disabled:opacity-50 disabled:cursor-not-allowed
                        disabled:hover:shadow-xl
                        flex items-center gap-3
                      `}
                        >
                          <Send className="w-5 h-5" />
                          {isSubmitting ? "Enviando..." : "Enviar Boletos"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

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
    </div>
  )
}
