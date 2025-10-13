import { SeguroFiancaEmpresarialMais2Anos } from "@/types/SeguroFiancaEmpresarialMais2Anos"
import { XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatValor } from "@/utils/regex/regexValor"

type SeguroFiancaEmpresarialMais2AnosModalProps = {
  seguro: SeguroFiancaEmpresarialMais2Anos
  isOpen: boolean
  onClose: () => void
}

export function SeguroFiancaEmpresarialMais2AnosModal({
  seguro,
  isOpen,
  onClose,
}: SeguroFiancaEmpresarialMais2AnosModalProps) {
  if (!isOpen) return null

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
            Detalhes de {seguro.nome_imobiliaria}
          </h2>
          <button
            onClick={onClose}
            className="text-[#027B49] hover:text-[#025d37]"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Primeira Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37]">
              Dados da Empresa
            </h3>
            <p>
              <strong>Nome da Imobiliária:</strong> {seguro.nome_imobiliaria}
            </p>
            <p>
              <strong>Nome da Empresa:</strong> {seguro.nome_empresa}
            </p>
            <p>
              <strong>Tipo de Empresa:</strong> {seguro.tipo_empresa}
            </p>
            <p>
              <strong>CNPJ:</strong> {seguro.cnpj}
            </p>
            <p>
              <strong>Telefone da Empresa:</strong> {seguro.telefone_empresa}
            </p>
            <p>
              <strong>Email da Empresa:</strong> {seguro.email_empresa}
            </p>
            <p>
              <strong>Opção Tributária:</strong> {seguro.opcao_tributaria}
            </p>
            <p>
              <strong>Atividade Econômica:</strong> {seguro.atividade_economica}
            </p>
            {seguro.capital_social !== undefined &&
              seguro.capital_social > 0 && (
                <p>
                  <strong>Capital Social:</strong> R${" "}
                  {formatValor(seguro.capital_social.toFixed(2))}
                </p>
              )}
            {seguro.faturamento_mensal !== undefined &&
              seguro.faturamento_mensal > 0 && (
                <p>
                  <strong>Faturamento Mensal:</strong> R${" "}
                  {formatValor(seguro.faturamento_mensal.toFixed(2))}
                </p>
              )}

            {/* Sócios */}
            {(seguro.nome_socio_1 || seguro.nome_socio_2) && (
              <>
                <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                  Sócios
                </h3>
                {seguro.nome_socio_1 && (
                  <>
                    <p>
                      <strong>Nome do Sócio 1:</strong> {seguro.nome_socio_1}
                    </p>
                    {seguro.cpf_socio_1 && (
                      <p>
                        <strong>CPF do Sócio 1:</strong> {seguro.cpf_socio_1}
                      </p>
                    )}
                  </>
                )}
                {seguro.nome_socio_2 && (
                  <>
                    <p>
                      <strong>Nome do Sócio 2:</strong> {seguro.nome_socio_2}
                    </p>
                    {seguro.cpf_socio_2 && (
                      <p>
                        <strong>CPF do Sócio 2:</strong> {seguro.cpf_socio_2}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Segunda Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            {/* Endereço da Sede */}
            {/* <>
              <h3 className="text-lg font-semibold text-[#025d37]">
                Endereço da Sede
              </h3>
              <p>
                <strong>CEP:</strong> {seguro.cep_empresa}
              </p>
              <p>
                <strong>Endereço:</strong> {seguro.endereco_empresa}
              </p>
              <p>
                <strong>Número:</strong> {seguro.numero_endereco_empresa}
              </p>
              {seguro.complemento && (
                <p>
                  <strong>Complemento:</strong> {seguro.complemento_empresa}
                </p>
              )}
              <p>
                <strong>Bairro:</strong> {seguro.bairro_empresa}
              </p>
              <p>
                <strong>Cidade:</strong> {seguro.cidade_empresa}
              </p>
              <p>
                <strong>Estado:</strong> {seguro.estado_empresa}
              </p>
            </> */}

            {/* Endereço da Locação */}
            <>
              <h3 className="text-lg font-semibold text-[#025d37]">
                Endereço da Locação
              </h3>
              <p>
                <strong>CEP:</strong> {seguro.cep}
              </p>
              <p>
                <strong>Endereço:</strong> {seguro.endereco}
              </p>
              <p>
                <strong>Número:</strong> {seguro.numero_endereco}
              </p>
              {seguro.complemento && (
                <p>
                  <strong>Complemento:</strong> {seguro.complemento}
                </p>
              )}
              <p>
                <strong>Bairro:</strong> {seguro.bairro}
              </p>
              <p>
                <strong>Cidade:</strong> {seguro.cidade}
              </p>
              <p>
                <strong>Estado:</strong> {seguro.estado}
              </p>
            </>

            {/* Informações da Locação */}
            <>
              <h3 className="text-lg font-semibold text-[#025d37]">
                Informações da Locação
              </h3>
              <p>
                <strong>Motivo da Locação:</strong> {seguro.motivo_locacao}
              </p>

              {seguro.tipo_imovel && (
                <p>
                  <strong>Tipo do Imóvel:</strong> {seguro.tipo_imovel}
                </p>
              )}

              {seguro.tipo_imovel === "ALUGADO" && (
                <>
                  <p>
                    <strong>Valor do Aluguel (Imóvel Atual):</strong> R${" "}
                    {seguro.valor_aluguel !== undefined &&
                      formatValor(seguro.valor_aluguel.toFixed(2))}
                  </p>
                  <p>
                    <strong>Nome do Locador/Imobiliária:</strong>{" "}
                    {seguro.nome_locador_imobiliaria}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {seguro.telefone}
                  </p>
                </>
              )}
            </>
          </div>

          {/* Terceira Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            {/* Valores e Contas */}
            <h3 className="text-lg font-semibold text-[#025d37]">
              Coberturas e Valores das Contas
            </h3>
            {seguro.aluguel !== undefined && (
              <p>
                <strong>Valor do Aluguel:</strong> R${" "}
                {formatValor(seguro.aluguel.toFixed(2))}
              </p>
            )}
            {seguro.agua !== undefined && seguro.agua > 0 && (
              <p>
                <strong>Valor da Conta de Água:</strong> R${" "}
                {formatValor(seguro.agua.toFixed(2))}
              </p>
            )}
            {seguro.energia !== undefined && seguro.energia > 0 && (
              <p>
                <strong>Valor da Conta de Energia:</strong> R${" "}
                {formatValor(seguro.energia.toFixed(2))}
              </p>
            )}
            {seguro.gas !== undefined && seguro.gas > 0 && (
              <p>
                <strong>Valor da Conta de Gás:</strong> R${" "}
                {formatValor(seguro.gas.toFixed(2))}
              </p>
            )}
            {seguro.condominio !== undefined && seguro.condominio > 0 && (
              <p>
                <strong>Valor do Condomínio:</strong> R${" "}
                {formatValor(seguro.condominio.toFixed(2))}
              </p>
            )}
            {seguro.iptu !== undefined && seguro.iptu > 0 && (
              <p>
                <strong>Valor do IPTU:</strong> R${" "}
                {formatValor(seguro.iptu.toFixed(2))}
              </p>
            )}

            {/* Coberturas */}
            {/* <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Coberturas
            </h3> */}
            <p>
              <strong>Danos ao Imóvel:</strong> {seguro.danos_imovel}
            </p>
            <p>
              <strong>Multa Rescisória:</strong> {seguro.multa_rescisao}
            </p>
            <p>
              <strong>Pintura Interna:</strong> {seguro.pintura_interna}
            </p>
            <p>
              <strong>Pintura Externa:</strong> {seguro.pintura_externa}
            </p>

            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Observações
            </h3>
            {seguro.observacao ? (
              <p>{seguro.observacao}</p>
            ) : (
              <p className="italic text-gray-500">
                A imobiliária {seguro.nome_imobiliaria} não escreveu nenhuma
                observação.
              </p>
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
