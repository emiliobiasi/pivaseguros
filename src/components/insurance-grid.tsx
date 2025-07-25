// src/components/insurance-grid.tsx
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useCallback } from "react"
import { toast } from "sonner"
import { Upload } from "lucide-react"
import { Imobiliaria } from "@/types/Imobiliarias"

/**
 * 1) Aqui definimos a estrutura das seguradoras e subcategorias:
 *    Cada objeto possui um nome, uma "cor" (para o estilo) e
 *    um array "subcategories" com os campos do PocketBase.
 */
const insuranceStructure = [
  {
    name: "PORTO",
    colorKey: "PORTO",
    subcategories: [
      { label: "Fiança Essencial", field: "porto_boleto_fianca_essencial" },
      { label: "Fiança Tradicional", field: "porto_boleto_fianca_tradicional" },
      {
        label: "Incêndio Residencial",
        field: "porto_boleto_incendio_residencial",
      },
      { label: "Incêndio Comercial", field: "porto_boleto_incendio_comercial" },
    ],
  },
  {
    name: "POTENCIAL",
    colorKey: "POTENCIAL",
    subcategories: [{ label: "Fiança", field: "potencial_boleto_fianca" }],
  },
  {
    name: "TOKIO",
    colorKey: "TOKIO",
    subcategories: [
      { label: "Fiança", field: "tokio_boleto_fianca" },
      { label: "Relatório Fiança", field: "tokio_relatorio_fianca" },
    ],
  },
  {
    name: "TOO",
    colorKey: "TOO",
    subcategories: [
      { label: "Fiança", field: "too_boleto_fianca" },
      { label: "Relatório Fiança", field: "too_relatorio_fianca" },
    ],
  },
]

/**
 * 2) Cores das seguradoras, para estilizar os cartões de upload.
 */
const insuranceColors = {
  PORTO: {
    bg: "bg-[#01a0fb]",
    border: "border-[#01a0fb]",
    text: "text-[#004a75]",
    hover: "hover:bg-[#01a0fb]/10",
  },
  POTENCIAL: {
    bg: "bg-[#FD6414]",
    border: "border-[#FD6414]",
    text: "text-[#FD6414]",
    hover: "hover:bg-[#FD6414]/10",
  },
  TOKIO: {
    bg: "bg-[#01745B]",
    border: "border-[#01745B]",
    text: "text-[#01745B]",
    hover: "hover:bg-[#01745B]/10",
  },
  TOO: {
    bg: "bg-[#6AB5B9]",
    border: "border-[#6AB5B9]",
    text: "text-[#064d4f]",
    hover: "hover:bg-[#6AB5B9]/10",
  },
} as const

/**
 * 3) Props que o InsuranceGrid vai receber de fora (da sua página).
 */
interface InsuranceGridProps {
  // Chamado quando arquivos são "dropados" no subcampo
  onFileUpload: (newFiles: File[], subField: string) => void
  // Contagem de quantos arquivos já foram enviados para cada subcampo
  uploadedFiles: { [field: string]: number }
  // Dados da imobiliária selecionada (para saber quantos arquivos são exigidos em cada subcampo)
  imobiliaria: Imobiliaria
}

/**
 * 4) O componente principal: InsuranceGrid
 *    - Ele mapeia cada seguradora (PORTO, TOKIO, etc.)
 *    - Para cada seguradora, gera um <Card>
 *    - Para cada subcampo dessa seguradora, gera um <SubUploadCard>
 */
export function InsuranceGrid({
  onFileUpload,
  uploadedFiles,
  imobiliaria,
}: InsuranceGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 w-full max-w-7xl mx-auto">
      {insuranceStructure.map((insurance) => {
        const { name, colorKey, subcategories } = insurance

        return (
          <Card key={name} className={`overflow-hidden border`}>
            <CardHeader className="bg-opacity-10">
              <CardTitle className="flex items-center justify-between">
                <span>{name}</span>
                {/* Se quiser colocar alguma info geral de "total" aqui, pode somar subcampos */}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subcategories.map((subcat) => {
                  const fieldName = subcat.field as keyof Imobiliaria
                  // Quantos arquivos essa imobiliária exige nesse subcampo
                  const totalNeeded = Number(imobiliaria[fieldName]) || 0
                  // Quantos já foram enviados
                  const uploadedCount = uploadedFiles[subcat.field] || 0

                  return (
                    <SubUploadCard
                      key={subcat.field}
                      company={name}
                      label={subcat.label}
                      field={subcat.field}
                      totalExpectedDocs={totalNeeded}
                      uploadedCount={uploadedCount}
                      onUpload={(files) => onFileUpload(files, subcat.field)}
                      colorKey={colorKey}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

/**
 * 5) SubUploadCard: cada "caixinha" de upload para um subcampo.
 *    - Reaproveitando o código que você já postou.
 */
interface SubUploadCardProps {
  company: string // "PORTO", "TOKIO", etc.
  label: string // Ex: "Fiança Essencial"
  field: string // Ex: "porto_boleto_fianca_essencial"
  totalExpectedDocs: number // Quantos documentos esse subcampo exige
  uploadedCount: number // Quantos já foram enviados p/ esse subcampo
  onUpload: (files: File[]) => void
  colorKey: string // Ex: "PORTO", "TOKIO"
}

function SubUploadCard({
  company,
  label,
  // field,
  totalExpectedDocs,
  uploadedCount,
  onUpload,
  colorKey,
}: SubUploadCardProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const colors = insuranceColors[colorKey as keyof typeof insuranceColors] || {
    bg: "bg-gray-200",
    border: "border-gray-300",
    text: "text-gray-700",
    hover: "hover:bg-gray-100",
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (uploadedCount >= totalExpectedDocs) {
        toast.error("Limite de boletos para este subcampo já foi atingido!")
        return
      }

      if (acceptedFiles.length === 0) return

      setUploading(true)
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer)
            setUploading(false)
            onUpload(acceptedFiles)
            toast.success(
              `${acceptedFiles.length} arquivo(s) enviado(s) para "${label}" em ${company}`
            )
            return 0
          }
          return oldProgress + 20
        })
      }, 200)
    },
    [uploadedCount, totalExpectedDocs, onUpload, company, label]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  })

  return (
    <div className={`border-2 rounded-lg overflow-hidden ${colors.border}`}>
      <div className={`bg-opacity-10 p-3 ${colors.bg}`}>
        <div className="flex items-center justify-between">
          <span className={`${colors.text} font-semibold`}>{label}</span>
          <Badge
            variant="secondary"
            className={`${colors.bg} text-white font-bold px-3 py-1`}
          >
            {uploadedCount} / {totalExpectedDocs} boletos
          </Badge>
        </div>
      </div>

      <div className="p-4 bg-white">
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
            ${
              isDragActive
                ? `${colors.bg}/10`
                : `${colors.border} ${colors.hover}`
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 min-h-[100px]">
            {!uploading && (
              <>
                <Upload className={`h-8 w-8 ${colors.text}`} />
                <div className="text-center space-y-1">
                  <p className={`font-medium ${colors.text}`}>
                    Arraste arquivos aqui
                  </p>
                  <p className={`text-sm ${colors.text} opacity-75`}>
                    ou clique para selecionar
                  </p>
                </div>
              </>
            )}
            {uploading && (
              <div className="w-full space-y-2">
                <p className={`text-sm ${colors.text} text-center`}>
                  Enviando arquivo...
                </p>
                <Progress
                  value={progress}
                  className={`w-full [&>div]:${colors.bg.replace(
                    "bg-",
                    "bg-"
                  )}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
