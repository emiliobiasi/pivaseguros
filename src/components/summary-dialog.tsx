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
import { FileIcon, CheckCircle, Loader2 } from "lucide-react" // Adicione o Loader2 para o spinner
import { UploadedFile } from "@/types/Insurance"

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
  Potencial: ["potencial_boleto_fianca"],
  Tokio: ["tokio_boleto_fianca", "tokio_relatorio_fianca"],
  Too: ["too_boleto_fianca", "too_relatorio_fianca"],
}

export function SummaryDialog({
  isOpen,
  onClose,
  onConfirm,
  files,
  realEstateName,
  isSubmitting = false, // valor default caso não seja passado
}: SummaryDialogProps) {
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.insuranceCompany]) {
      acc[file.insuranceCompany] = []
    }
    acc[file.insuranceCompany].push(file)
    return acc
  }, {} as Record<string, UploadedFile[]>)

  const getBoletoType = (company: string) => {
    for (const [key, value] of Object.entries(boletosTypes)) {
      if (value.includes(company)) {
        return key
      }
    }
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-green-800">Resumo do Envio</DialogTitle>
          <DialogDescription className="">
            Confira os arquivos que serão enviados para {realEstateName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="space-y-6 pr-4">
            {Object.entries(groupedFiles).map(([company, companyFiles]) => (
              <div key={company} className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-green-700">
                  {getBoletoType(company)}
                  <span className="text-sm text-green-600 font-normal">
                    ({companyFiles.length}{" "}
                    {companyFiles.length === 1 ? "arquivo" : "arquivos"})
                  </span>
                  {getBoletoType(company) && (
                    <span className="text-sm text-green-600 font-normal"></span>
                  )}
                </h3>
                <div className="space-y-2">
                  {companyFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 bg-white-50 rounded-lg"
                    >
                      <FileIcon className="h-4 w-4 text-green-600" />
                      <span className="flex-1 text-sm ">{file.name}</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-black bg-white border border-black hover:text-white hover:bg-black"
          >
            Cancelar
          </Button>

          {/* Botão de confirmar envio */}
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`text-white bg-green-800 hover:bg-green-600 
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </div>
            ) : (
              "Confirmar Envio"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
