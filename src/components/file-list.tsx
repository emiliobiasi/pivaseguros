import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle, XCircle } from "lucide-react"
import { UploadedFile } from "../types/Insurance"
import { AnimatePresence, motion } from "framer-motion"

interface FileListProps {
  files: UploadedFile[]
  onDelete: (id: string) => void
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

const friendlyNames = {
  porto_boleto_fianca_essencial: "Boleto Fiança Essencial",
  porto_boleto_fianca_tradicional: "Boleto Fiança Tradicional",
  porto_boleto_incendio_residencial: "Boleto Incêndio Residencial",
  porto_boleto_incendio_comercial: "Boleto Incêndio Comercial",
  potencial_boleto_fianca: "Boleto Fiança",
  tokio_boleto_fianca: "Boleto Fiança",
  tokio_relatorio_fianca: "Relatório Fiança",
  too_boleto_fianca: "Boleto Fiança",
  too_relatorio_fianca: "Relatório Fiança",
}

export function FileList({ files, onDelete }: FileListProps) {
  if (files.length === 0) return null

  const getInsuranceCompanyName = (insuranceCompany: string) => {
    for (const [company, types] of Object.entries(boletosTypes)) {
      if (types.includes(insuranceCompany)) {
        return company
      }
    }
    return null
  }

  const getFriendlyName = (insuranceCompany: keyof typeof friendlyNames) => {
    return friendlyNames[insuranceCompany] || insuranceCompany
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Nome do Arquivo</TableHead>
            <TableHead className="">Formato</TableHead>
            <TableHead className="">Seguradora</TableHead>
            <TableHead className="">Tipo do Arquivo</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className=" w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {files.map((file) => (
              <motion.tr
                key={file.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TableCell className="text-black">{file.name}</TableCell>
                <TableCell className="text-black">{file.type}</TableCell>
                <TableCell className="text-black">
                  {getInsuranceCompanyName(file.insuranceCompany) || (
                    <div>{file.insuranceCompany}</div>
                  )}
                </TableCell>
                <TableCell className="text-black">
                  {getFriendlyName(
                    file.insuranceCompany as keyof typeof friendlyNames
                  )}
                </TableCell>
                <TableCell className="text-black">
                  {file.status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(file.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}
