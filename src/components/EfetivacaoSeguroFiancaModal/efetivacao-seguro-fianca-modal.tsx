import { EfetivacaoSeguroFianca } from "@/types/EfetivacaoSeguroFianca";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatValor } from "@/utils/regex/regexValor";

type EfetivacaoSeguroFiancaModalProps = {
  efetivacao: EfetivacaoSeguroFianca;
  isOpen: boolean;
  onClose: () => void;
};

export function EfetivacaoSeguroFiancaModal({
  efetivacao,
  isOpen,
  onClose,
}: EfetivacaoSeguroFiancaModalProps) {
  if (!isOpen) return null;

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
            Detalhes de {efetivacao.nome_imobiliaria}
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
            {/* Informações da Imobiliária */}
            <h3 className="text-lg font-semibold text-[#025d37]">
              Informações da Imobiliária
            </h3>
            <p>
              <strong>Imobiliária:</strong> {efetivacao.nome_imobiliaria}
            </p>
            <p>
              <strong>Telefone:</strong> {efetivacao.telefone_imobiliaria}
            </p>

            {/* Informações do Inquilino 1 */}
            {efetivacao.nome_inquilino_1 && (
              <>
                <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                  Informações do Inquilino 1
                </h3>
                <p>
                  <strong>Nome:</strong> {efetivacao.nome_inquilino_1}
                </p>
                {efetivacao.cpf_inquilino_1 && (
                  <p>
                    <strong>CPF:</strong> {efetivacao.cpf_inquilino_1}
                  </p>
                )}
                {efetivacao.email_inquilino_1 && (
                  <p>
                    <strong>Email:</strong> {efetivacao.email_inquilino_1}
                  </p>
                )}
                {efetivacao.telefone_inquilino_1 && (
                  <p>
                    <strong>Telefone:</strong> {efetivacao.telefone_inquilino_1}
                  </p>
                )}
              </>
            )}

            {/* Informações do Inquilino 2 */}
            {efetivacao.nome_inquilino_2 && (
              <>
                <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                  Informações do Inquilino 2
                </h3>
                <p>
                  <strong>Nome:</strong> {efetivacao.nome_inquilino_2}
                </p>
                {efetivacao.cpf_inquilino_2 && (
                  <p>
                    <strong>CPF:</strong> {efetivacao.cpf_inquilino_2}
                  </p>
                )}
                {efetivacao.email_inquilino_2 && (
                  <p>
                    <strong>Email:</strong> {efetivacao.email_inquilino_2}
                  </p>
                )}
                {efetivacao.telefone_inquilino_2 && (
                  <p>
                    <strong>Telefone:</strong> {efetivacao.telefone_inquilino_2}
                  </p>
                )}
              </>
            )}

            {/* Dados da Locação */}
            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Dados da Locação
            </h3>
            <p>
              <strong>Finalidade:</strong> {efetivacao.finalidade}
            </p>
            <p>
              <strong>Tipo de Residência:</strong> {efetivacao.tipo_residencia}
            </p>
            {efetivacao.tipo_residencia_outros && (
              <p>
                <strong>Outros:</strong> {efetivacao.tipo_residencia_outros}
              </p>
            )}
            <p>
              <strong>Início do Contrato:</strong>{" "}
              {new Date(efetivacao.inicio_contrato).toLocaleDateString()}
            </p>
            <p>
              <strong>Término do Contrato:</strong>{" "}
              {new Date(efetivacao.termino_contrato).toLocaleDateString()}
            </p>

            <p>
              <strong>Valor da Parcela:</strong> R${" "}
              {formatValor(efetivacao.valor_parcela.toFixed(2))}
            </p>
            <p>
              <strong>Seguradora:</strong> {efetivacao.seguradora}
            </p>
            <p>
              <strong>Índice de Reajuste:</strong> {efetivacao.indice_reajuste}
            </p>
            <p>
              <strong>Dia do Vencimento do Aluguel:</strong> {efetivacao.vencimento_aluguel}
            </p>
          </div>

          {/* Segunda Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37]">
              Endereço do Imóvel
            </h3>
            <p>
              <strong>CEP:</strong> {efetivacao.cep}
            </p>
            <p>
              <strong>Endereço:</strong> {efetivacao.endereco}
            </p>
            <p>
              <strong>Número:</strong> {efetivacao.numero}
            </p>
            <p>
              <strong>Bairro:</strong> {efetivacao.bairro}
            </p>
            {efetivacao.complemento && (
              <p>
                <strong>Complemento:</strong> {efetivacao.complemento}
              </p>
            )}
            <p>
              <strong>Cidade:</strong> {efetivacao.cidade}
            </p>
            <p>
              <strong>Estado:</strong> {efetivacao.estado}
            </p>

            {/* Informações do Proprietário */}
            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Informações do Proprietário
            </h3>
            <p>
              <strong>Nome:</strong> {efetivacao.nome_proprietario}
            </p>
            <p>
              <strong>Profissão:</strong> {efetivacao.profissao_proprietario}
            </p>
            {efetivacao.cpf_proprietario && (
              <p>
                <strong>CPF:</strong> {efetivacao.cpf_proprietario}
              </p>
            )}
            {efetivacao.cnpj_proprietario && (
              <p>
                <strong>CNPJ:</strong> {efetivacao.cnpj_proprietario}
              </p>
            )}
            <p>
              <strong>Data de Nascimento:</strong>{" "}
              {new Date(
                efetivacao.data_nascimento_proprietario
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>RG:</strong> {efetivacao.rg_proprietario}
            </p>
            <p>
              <strong>Estado Civil:</strong>{" "}
              {efetivacao.estado_civil_proprietario}
            </p>
            <p>
              <strong>Reside no Brasil:</strong> {efetivacao.reside_brasil}
            </p>
            <p>
              <strong>Email:</strong> {efetivacao.email_proprietario}
            </p>
            <p>
              <strong>Telefone:</strong> {efetivacao.telefone_proprietario}
            </p>
          </div>

          {/* Terceira Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            {/* Coberturas */}
            <h3 className="text-lg font-semibold text-[#025d37]">Coberturas</h3>
            {efetivacao.aluguel !== undefined && (
              <p>
                <strong>Aluguel:</strong> R${" "}
                {formatValor(efetivacao.aluguel.toFixed(2))}
              </p>
            )}
            {efetivacao.condominio !== undefined && (
              <p>
                <strong>Condomínio:</strong> R${" "}
                {formatValor(efetivacao.condominio.toFixed(2))}
              </p>
            )}
            {efetivacao.iptu !== undefined && (
              <p>
                <strong>IPTU:</strong> R${" "}
                {formatValor(efetivacao.iptu.toFixed(2))}
              </p>
            )}
            {efetivacao.agua !== undefined && (
              <p>
                <strong>Água:</strong> R${" "}
                {formatValor(efetivacao.agua.toFixed(2))}
              </p>
            )}
            {efetivacao.luz !== undefined && (
              <p>
                <strong>Luz:</strong> R${" "}
                {formatValor(efetivacao.luz.toFixed(2))}
              </p>
            )}
            {efetivacao.gas !== undefined && (
              <p>
                <strong>Gás:</strong> R${" "}
                {formatValor(efetivacao.gas.toFixed(2))}
              </p>
            )}

            {/* Outros Dados */}
            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Outros Dados
            </h3>
            <p>
              <strong>Pintura Interna:</strong> {efetivacao.pintura_interna}
            </p>
            <p>
              <strong>Pintura Externa:</strong> {efetivacao.pintura_externa}
            </p>
            <p>
              <strong>Danos ao Imóvel:</strong> {efetivacao.danos_imovel}
            </p>
            <p>
              <strong>Multa Rescisória:</strong> {efetivacao.multa_rescisao}
            </p>
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
  );
}
