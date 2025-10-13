// import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileIcon,
  CheckCircle,
  Loader2,
  Building2,
  Send,
  Package,
} from "lucide-react"
import { UploadedFile } from "@/types/Insurance"
import { Separator } from "@/components/ui/separator"

interface SummaryDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  files: UploadedFile[]
  realEstateName: string
  /**
   * Adicione esta prop para saber se está enviando no momento.
   * Assim conseguimos bloquear o botão e exibir um loading.
   */
  isSubmitting?: boolean
}

const boletosTypes = {
  Porto: [
    "porto_boleto_fianca_essencial",
    "porto_boleto_fianca_tradicional",
    "porto_boleto_incendio_residencial",
    "porto_boleto_incendio_comercial",
  ],
  Potencial: ["potencial_boleto_fianca", "potencial_relatorio_fianca"],
  Tokio: ["tokio_boleto_fianca", "tokio_relatorio_fianca"],
  Too: ["too_boleto_fianca", "too_relatorio_fianca"],
}

const insuranceColors = {
  Porto: "from-blue-500 to-blue-600",
  Potencial: "from-orange-500 to-orange-600",
  Tokio: "from-teal-600 to-teal-700",
  Too: "from-cyan-500 to-cyan-600",
} as const

export function SummaryDialog({
  isOpen,
  onClose,
  onConfirm,
  files,
  realEstateName,
  isSubmitting = false, // valor default caso não seja passado
}: SummaryDialogProps) {
  // Agrupa os arquivos por seguradora (não por subcampo)
  const groupedByInsurance = files.reduce((acc, file) => {
    // Descobre qual seguradora este arquivo pertence
    const insuranceCompany = getBoletoType(file.insuranceCompany)
    if (insuranceCompany) {
      if (!acc[insuranceCompany]) {
        acc[insuranceCompany] = []
      }
      acc[insuranceCompany].push(file)
    }
    return acc
  }, {} as Record<string, UploadedFile[]>)

  function getBoletoType(company: string) {
    for (const [key, value] of Object.entries(boletosTypes)) {
      if (value.includes(company)) {
        return key === "Potencial" ? "Pottencial" : key
      }
    }
    return null
  }

  const totalFiles = files.length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-br from-gray-50 to-white border-2 border-green-100">
        <DialogHeader className="space-y-3">
          {/* Header com gradiente suave - menos vibrante */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg -mt-6 -mx-6 mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-white text-xl font-bold">
                Resumo do Envio
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm">
                Confirme os arquivos antes de enviar
              </DialogDescription>
            </div>
          </div>

          {/* Card da Imobiliária */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200 shadow-sm">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Building2 className="h-4 w-4 text-green-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600">Destinatário</p>
              <p className="font-bold text-base text-gray-900">
                {realEstateName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-2xl font-bold text-green-700">{totalFiles}</p>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-3" />

        <ScrollArea className="max-h-[45vh] pr-4">
          <div className="space-y-3 pb-4">
            {Object.entries(groupedByInsurance).map(
              ([insuranceName, companyFiles], index) => {
                const gradient =
                  insuranceColors[
                    insuranceName as keyof typeof insuranceColors
                  ] || "from-gray-500 to-gray-600"

                return (
                  <div key={insuranceName} className="space-y-2">
                    {/* Header da Seguradora */}
                    <div
                      className={`flex items-center gap-2 p-2.5 bg-gradient-to-r ${gradient} rounded-lg shadow-sm`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className="p-1 bg-white/30 rounded">
                          <Package className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-lg">
                          {insuranceName}
                        </h3>
                      </div>
                      <div className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                        <span className="text-sm font-semibold text-white">
                          {companyFiles.length}{" "}
                          {companyFiles.length === 1 ? "arquivo" : "arquivos"}
                        </span>
                      </div>
                    </div>

                    {/* Lista de Arquivos */}
                    <div className="space-y-1.5 pl-1">
                      {companyFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200 group"
                        >
                          <div className="p-1.5 bg-gray-100 rounded group-hover:bg-green-100 transition-colors">
                            <FileIcon className="h-4 w-4 text-gray-600 group-hover:text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.type}</p>
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        </div>
                      ))}
                    </div>

                    {/* Separador entre seguradoras */}
                    {index < Object.entries(groupedByInsurance).length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                )
              }
            )}
          </div>
        </ScrollArea>

        <Separator className="my-3" />

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all h-10"
          >
            Cancelar
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-10 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Confirmar Envio
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
