import { AberturaSinistro } from "@/types/AberturaSinistro"
import { XCircle, FileText, ExternalLink /*, Download*/ } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatarData } from "@/utils/dateformater/dateFormater"
import pb from "@/utils/backend/pb-imob"

type AberturaSinistroModalProps = {
  titulo: AberturaSinistro
  isOpen: boolean
  onClose: () => void
}

export function AberturaSinistroModal({
  titulo,
  isOpen,
  onClose,
}: AberturaSinistroModalProps) {
  if (!isOpen) return null

  const getFileUrl = (recordId: string, filename: string) => {
    return pb.files.getUrl(
      { id: recordId, collectionId: "abertura_sinistro" } as any,
      filename
    )
  }

  const friendlyFileName = (fname: string) => {
    const lastDot = fname.lastIndexOf(".")
    if (lastDot <= 0) return fname
    const base = fname.slice(0, lastDot)
    const ext = fname.slice(lastDot)
    const cleanedBase = base.replace(/_[A-Za-z0-9]{10}$/u, "")
    return `${cleanedBase}${ext}`
  }

  // const handleDirectDownload = (recordId: string, fname: string) => {
  //   try {
  //     const url = `${getFileUrl(recordId, fname)}?download=1`
  //     const a = document.createElement("a")
  //     a.href = url
  //     a.download = friendlyFileName(fname)
  //     document.body.appendChild(a)
  //     a.click()
  //     a.remove()
  //   } catch (e) {
  //     console.error("Falha ao iniciar download do arquivo:", e)
  //   }
  // }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Protocolo #{titulo.id_numero} — {titulo.nome_imobiliaria}
          </h2>
          <button
            onClick={onClose}
            className="text-[#027B49] hover:text-[#025d37]"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Protocolo + Partes */}
          <div className="space-y-4 bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37] dark:text-emerald-300">
              Informações do Protocolo
            </h3>
            <p>
              <strong>Imobiliária:</strong> {titulo.nome_imobiliaria}
            </p>
            <p>
              <strong>Tipo de Seguro:</strong> {titulo.tipo_seguro}
            </p>
            <p>
              <strong>Criado em:</strong> {formatarData(titulo.created)}
            </p>

            <h3 className="text-lg font-semibold text-[#025d37] dark:text-emerald-300">
              Locatário
            </h3>
            <p>
              <strong>Nome do Inquilino:</strong> {titulo.nome_inquilino}
            </p>
            {titulo.cpf_inquilino && (
              <p>
                <strong>CPF do Inquilino:</strong> {titulo.cpf_inquilino}
              </p>
            )}

            <h3 className="text-lg font-semibold mt-6 text-[#025d37] dark:text-emerald-300">
              Proprietário
            </h3>
            <p>
              <strong>Nome do Proprietário:</strong> {titulo.nome_proprietario}
            </p>
            {titulo.cpf_proprietario && (
              <p>
                <strong>CPF do Proprietário:</strong> {titulo.cpf_proprietario}
              </p>
            )}
          </div>

          {/* Coluna 2: Endereço */}
          <div className="space-y-4 bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37] dark:text-emerald-300">
              Endereço do Imóvel
            </h3>
            <p>
              <strong>CEP:</strong> {titulo.cep}
            </p>
            <p>
              <strong>Endereço:</strong> {titulo.endereco}
            </p>
            <p>
              <strong>Número:</strong> {titulo.numero_endereco}
            </p>
            {titulo.complemento && (
              <p>
                <strong>Complemento:</strong> {titulo.complemento}
              </p>
            )}
            <p>
              <strong>Bairro:</strong> {titulo.bairro}
            </p>
            <p>
              <strong>Cidade:</strong> {titulo.cidade}
            </p>
            <p>
              <strong>Estado:</strong> {titulo.estado}
            </p>
          </div>

          {/* Coluna 3: Documentos Anexados */}
          <div className="space-y-4 bg-gray-100 dark:bg-gray-900/40 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37] dark:text-emerald-300">
              Documentos Anexados
            </h3>
            <p className="text-xs text-muted-foreground -mt-2">
              Dica: o link abre uma visualização do PDF. Você pode baixar pelo
              menu do navegador.
            </p>
            {Array.isArray(titulo.pdf_field) && titulo.pdf_field.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {titulo.pdf_field.map((fname) => (
                  <div key={fname} className="flex items-center gap-2">
                    <a
                      href={getFileUrl(titulo.id, fname)}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent hover:border-emerald-300/60 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                      title={friendlyFileName(fname)}
                      download={friendlyFileName(fname)}
                    >
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      <span className="max-w-[260px] truncate group-hover:underline">
                        {friendlyFileName(fname)}
                      </span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                    {/*
                      Botão de download direto temporariamente desativado por pedido.
                      Para reativar, use este exemplo e reabilite a função handleDirectDownload acima:

                      <button
                        type="button"
                        onClick={() => handleDirectDownload(titulo.id, fname)}
                        className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                        title={`Baixar ${friendlyFileName(fname)}`}
                        aria-label={`Baixar ${friendlyFileName(fname)}`}
                      >
                        <Download className="h-4 w-4" />
                        <span>Baixar</span>
                      </button>
                    */}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-[#027B49] hover:bg-[#025d37]"
          >
            Fechar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
