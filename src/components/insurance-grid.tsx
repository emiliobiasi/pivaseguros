// src/components/insurance-grid.tsx
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useCallback } from "react"
import { toast } from "sonner"
import { Upload, Ban, Lock, CheckCircle2 } from "lucide-react"
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
    subcategories: [
      { label: "Fiança", field: "potencial_boleto_fianca" },
      { label: "Relatório Fiança", field: "potencial_relatorio_fianca" },
    ],
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
] as const

// Tipos derivados da estrutura (garante autocomplete e segurança)
type InsuranceStructure = typeof insuranceStructure
export type InsuranceCompanyName = InsuranceStructure[number]["name"]

/**
 * 2) Cores das seguradoras, para estilizar os cartões de upload - versão moderna com gradientes.
 */
const insuranceColors = {
  PORTO: {
    gradient: "from-blue-500 to-blue-600",
    gradientBg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    border: "border-blue-300",
    text: "text-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "bg-gradient-to-r from-blue-500 to-blue-600",
    hover: "hover:shadow-lg hover:shadow-blue-200/50",
    ring: "focus:ring-blue-500",
  },
  POTENCIAL: {
    gradient: "from-orange-500 to-orange-600",
    gradientBg: "bg-gradient-to-br from-orange-50 to-orange-100/50",
    border: "border-orange-300",
    text: "text-orange-700",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badge: "bg-gradient-to-r from-orange-500 to-orange-600",
    hover: "hover:shadow-lg hover:shadow-orange-200/50",
    ring: "focus:ring-orange-500",
  },
  TOKIO: {
    gradient: "from-teal-600 to-teal-700",
    gradientBg: "bg-gradient-to-br from-teal-50 to-teal-100/50",
    border: "border-teal-300",
    text: "text-teal-700",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    badge: "bg-gradient-to-r from-teal-600 to-teal-700",
    hover: "hover:shadow-lg hover:shadow-teal-200/50",
    ring: "focus:ring-teal-600",
  },
  TOO: {
    gradient: "from-cyan-500 to-cyan-600",
    gradientBg: "bg-gradient-to-br from-cyan-50 to-cyan-100/50",
    border: "border-cyan-300",
    text: "text-cyan-700",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    badge: "bg-gradient-to-r from-cyan-500 to-cyan-600",
    hover: "hover:shadow-lg hover:shadow-cyan-200/50",
    ring: "focus:ring-cyan-500",
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
    <div className="grid grid-cols-1 gap-8 w-full max-w-7xl mx-auto">
      {insuranceStructure.map((insurance) => {
        const { name, colorKey, subcategories } = insurance
        const colors = insuranceColors[colorKey as keyof typeof insuranceColors]

        return (
          <Card
            key={name}
            className="overflow-hidden border shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Header mais sutil e elegante */}
            <CardHeader className="bg-white border-b-2 p-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 bg-gradient-to-br ${colors.gradient} rounded-lg shadow-sm`}
                  >
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-xl font-bold ${colors.text}`}>
                      {name === "POTENCIAL" ? "POTTENCIAL" : name}
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                      Documentos da seguradora
                    </span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {subcategories.map((subcat) => {
                  const fieldName = subcat.field as keyof Imobiliaria
                  const totalNeeded = Number(imobiliaria[fieldName]) || 0
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
  company: InsuranceCompanyName // Derivado de insuranceStructure
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

  // Nome exibido (apenas visual) para corrigir POTENCIAL -> POTTENCIAL
  const companyDisplay = company === "POTENCIAL" ? "POTTENCIAL" : company

  const colors = insuranceColors[colorKey as keyof typeof insuranceColors] || {
    gradient: "from-gray-500 to-gray-600",
    gradientBg: "bg-gradient-to-br from-gray-50 to-gray-100/50",
    border: "border-gray-300",
    text: "text-gray-700",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    badge: "bg-gradient-to-r from-gray-500 to-gray-600",
    hover: "hover:shadow-lg hover:shadow-gray-200/50",
    ring: "focus:ring-gray-500",
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
              `${acceptedFiles.length} arquivo(s) enviado(s) para "${label}" em ${companyDisplay}`
            )
            return 0
          }
          return oldProgress + 20
        })
      }, 200)
    },
    [uploadedCount, totalExpectedDocs, onUpload, companyDisplay, label]
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
    disabled: totalExpectedDocs === 0 || uploadedCount >= totalExpectedDocs, // Desabilita quando não há boletos ou já está completo
  })

  // Se não há documentos esperados, renderiza versão desabilitada
  const isDisabled = totalExpectedDocs === 0
  const isCompleted =
    uploadedCount >= totalExpectedDocs && totalExpectedDocs > 0

  return (
    <div
      className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${
        isDisabled
          ? "border border-gray-200 bg-gray-50/50 shadow-sm"
          : isCompleted
          ? "border-2 border-green-400 bg-gradient-to-br from-green-50 to-green-100/30 shadow-md shadow-green-200/30"
          : `border ${colors.border} ${colors.gradientBg} shadow-sm ${colors.hover}`
      }`}
    >
      {/* Header do card - compacto com fonte legível */}
      <div
        className={`px-3 py-1.5 backdrop-blur-sm ${
          isDisabled
            ? "bg-gray-100/80"
            : isCompleted
            ? "bg-green-100/80"
            : `${colors.gradientBg} border-b ${colors.border}`
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={`p-1 rounded ${
                isDisabled
                  ? "bg-gray-200"
                  : isCompleted
                  ? "bg-green-200"
                  : colors.iconBg
              }`}
            >
              {isCompleted ? (
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${
                    isCompleted ? "text-green-600" : colors.iconColor
                  }`}
                />
              ) : (
                <Upload
                  className={`h-3.5 w-3.5 ${
                    isDisabled ? "text-gray-400" : colors.iconColor
                  }`}
                />
              )}
            </div>
            <span
              className={`font-semibold text-sm truncate ${
                isDisabled
                  ? "text-gray-500"
                  : isCompleted
                  ? "text-green-700"
                  : colors.text
              }`}
            >
              {label}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={`font-bold px-2.5 py-0.5 text-xs text-white shadow-sm whitespace-nowrap ${
              isDisabled
                ? "bg-gray-400"
                : isCompleted
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : colors.badge
            }`}
          >
            {uploadedCount}/{totalExpectedDocs}
          </Badge>
        </div>
      </div>

      {/* Área de drop - ainda mais compacta com fonte legível */}
      <div className="p-2.5 bg-white/50 backdrop-blur-sm">
        {isDisabled ? (
          // Versão DESABILITADA (0/0)
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-3 bg-gradient-to-br from-gray-50 to-gray-100/50 cursor-not-allowed">
            <div className="flex flex-col items-center justify-center gap-1.5 min-h-[70px] opacity-60">
              <div className="relative p-1.5 bg-white rounded-full shadow-sm">
                <Upload className="h-4 w-4 text-gray-400" />
                <Ban className="h-3.5 w-3.5 text-red-500 absolute -top-0.5 -right-0.5 bg-white rounded-full shadow-sm" />
              </div>
              <div className="text-center space-y-0.5">
                <p className="font-semibold text-gray-600 flex items-center gap-1.5 justify-center text-xs">
                  <Lock className="h-3 w-3" />
                  Upload Desabilitado
                </p>
                <p className="text-[10px] text-gray-400">
                  Nenhum boleto necessário
                </p>
              </div>
            </div>
          </div>
        ) : isCompleted ? (
          // Versão COMPLETA (ex: 1/1, 2/2)
          <div className="relative border-2 border-dashed border-green-400 rounded-lg p-3 bg-gradient-to-br from-green-50 to-green-100/50 cursor-not-allowed">
            <div className="flex flex-col items-center justify-center gap-1.5 min-h-[70px]">
              <div className="p-1.5 bg-green-100 rounded-full shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-center space-y-0.5">
                <p className="font-bold text-green-700 text-sm">✓ Completo!</p>
                <p className="text-xs text-green-600 font-medium">
                  Arquivos anexados
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Versão NORMAL - moderna com animação, mais compacta
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-lg p-3 transition-all duration-300 cursor-pointer group/drop
              ${
                isDragActive
                  ? `${colors.border} bg-gradient-to-br ${colors.gradientBg} scale-[1.02] shadow-md`
                  : `${colors.border} bg-white hover:bg-gradient-to-br ${colors.gradientBg} hover:scale-[1.01] ${colors.hover}`
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-1.5 min-h-[70px]">
              {!uploading && (
                <>
                  <div
                    className={`p-1.5 rounded-full transition-all duration-300 ${
                      isDragActive
                        ? `${colors.iconBg} scale-110 shadow-md`
                        : `${colors.iconBg} group-hover/drop:scale-105`
                    }`}
                  >
                    <Upload
                      className={`h-4 w-4 ${colors.iconColor} ${
                        isDragActive ? "animate-bounce" : ""
                      }`}
                    />
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className={`font-semibold ${colors.text} text-sm`}>
                      {isDragActive ? "Solte os arquivos" : "Arraste arquivos"}
                    </p>
                    <p className={`text-xs ${colors.text} opacity-70`}>
                      ou clique para selecionar
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      PDF • XLS • XLSX
                    </p>
                  </div>
                </>
              )}
              {uploading && (
                <div className="w-full space-y-1.5">
                  <div
                    className={`p-1.5 rounded-full mx-auto w-fit ${colors.iconBg}`}
                  >
                    <Upload
                      className={`h-4 w-4 ${colors.iconColor} animate-pulse`}
                    />
                  </div>
                  <p
                    className={`text-sm ${colors.text} text-center font-medium`}
                  >
                    Enviando...
                  </p>
                  <Progress value={progress} className="w-full h-1.5" />
                  <p className="text-xs text-gray-500 text-center">
                    {progress}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
