import { SeguroFiancaResidencial } from "@/types/SeguroFiancaResidencial";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatValor } from "@/utils/regex/regexValor";

type SeguroFiancaResidencialModalProps = {
  seguro: SeguroFiancaResidencial;
  isOpen: boolean;
  onClose: () => void;
};

export function SeguroFiancaResidencialModal({
  seguro,
  isOpen,
  onClose,
}: SeguroFiancaResidencialModalProps) {
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
            Detalhes de {seguro.nome_imobiliaria_corretor}
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
            <>
              <h3 className="text-lg font-semibold text-[#025d37]">
                Informações do Pretendente
              </h3>
              <p>
                <strong>Nome:</strong> {seguro.nome_residente}
              </p>
              <p>
                <strong>CPF:</strong> {seguro.cpf_residente}
              </p>
              <p>
                <strong>Data de Nascimento:</strong>{" "}
                {new Date(seguro.data_nascimento).toLocaleDateString()}
              </p>
              <p>
                <strong>Estado Civil:</strong> {seguro.estado_civil_residente}
              </p>
              <p>
                <strong>Profissão:</strong> {seguro.profissao}
              </p>
              {seguro.renda_mensal !== undefined && seguro.renda_mensal > 0 && (
                <p>
                  <strong>Renda Mensal:</strong> R${" "}
                  {formatValor(seguro.renda_mensal.toFixed(2))}
                </p>
              )}
              <p>
                <strong>Telefone do Pretendente:</strong> {seguro.telefone}
              </p>
              <p>
                <strong>Email do Pretendente:</strong> {seguro.email}
              </p>
              <p>
                <strong>Residirá no Imóvel?:</strong> {seguro.residir_imovel}
              </p>
              <p>
                <strong>Responderá Financeiramente:</strong>{" "}
                {seguro.responder_financeiramente}
              </p>
            </>

            {/* Informações do Outro Residente, se disponível */}
            {seguro.residir_imovel === "NÃO" && (
              <>
                <h3 className="text-lg font-semibold text-[#025d37]">
                  Informações do Residente
                </h3>
                <p>
                  <strong>Nome:</strong> {seguro.nome_residente_nao}
                </p>
                <p>
                  <strong>CPF:</strong> {seguro.cpf_residente_nao}
                </p>
                <p>
                  <strong>Data de Nascimento:</strong>{" "}
                  {new Date(
                    seguro.data_nascimento_residente_nao
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Telefone:</strong> {seguro.telefone_residente_nao}
                </p>
                <p>
                  <strong>Email:</strong> {seguro.email_residente_nao}
                </p>
                <p>
                  <strong>Profissão:</strong> {seguro.profissao_residente_nao}
                </p>
                <p>
                  <strong>Renda mensal:</strong> {seguro.cpf_residente_nao}
                </p>
              </>
            )}

            {/* Informações do Cônjuge, se disponível */}
            {seguro.estado_civil_residente === "CASADO" && (
              <>
                <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                  Informações do Cônjuge
                </h3>
                <p>
                  <strong>Renda Composta com Cônjuge:</strong>{" "}
                  {seguro.renda_composta_conjuge}
                </p>
                <p>
                  <strong>Nome do Cônjuge:</strong> {seguro.nome_conjuge}
                </p>
                {seguro.cpf_conjuge && (
                  <p>
                    <strong>CPF do Cônjuge:</strong> {seguro.cpf_conjuge}
                  </p>
                )}

                {seguro.telefone_conjuge && (
                  <p>
                    <strong>Telefone do Cônjuge:</strong>{" "}
                    {seguro.telefone_conjuge}
                  </p>
                )}
                {seguro.email_conjuge && (
                  <p>
                    <strong>Email do Cônjuge:</strong> {seguro.email_conjuge}
                  </p>
                )}
                {seguro.profissao_conjuge_opcional && (
                  <p>
                    <strong>Profissão do Cônjuge:</strong>{" "}
                    {seguro.profissao_conjuge_opcional}
                  </p>
                )}
                {seguro.renda_mensal_conjuge_opcional &&
                  Number(seguro.renda_mensal_conjuge_opcional) && (
                    <p>
                      <strong>Renda Mensal do Cônjuge:</strong> R${" "}
                      {formatValor(
                        Number(seguro.renda_mensal_conjuge_opcional).toFixed(2)
                      )}
                    </p>
                  )}
              </>
            )}
          </div>

          {/* Segunda Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37]">
              Informações da Imobiliária/Corretor
            </h3>
            <p>
              <strong>Nome da Imobiliária/Corretor:</strong>{" "}
              {seguro.nome_imobiliaria_corretor}
            </p>

            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Informações da Locação
            </h3>
            <p>
              <strong>CEP:</strong> {seguro.cep_locacao}
            </p>
            <p>
              <strong>Endereço:</strong> {seguro.endereco_locacao}
            </p>
            <p>
              <strong>Número:</strong> {seguro.numero_locacao}
            </p>
            <p>
              <strong>Bairro:</strong> {seguro.bairro_locacao}
            </p>
            <p>
              <strong>Cidade:</strong> {seguro.cidade_locacao}
            </p>
            <p>
              <strong>Estado:</strong> {seguro.estado_locacao}
            </p>
          </div>

          {/* Terceira Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37]">
              Valores e Contas
            </h3>
            <p>
              <strong>Valor do Aluguel:</strong> R${" "}
              {formatValor(seguro.valor_aluguel.toFixed(2))}
            </p>
            {seguro.valor_conta_agua !== undefined &&
              seguro.valor_conta_agua > 0 && (
                <p>
                  <strong>Valor da Conta de Água:</strong> R${" "}
                  {formatValor(seguro.valor_conta_agua.toFixed(2))}
                </p>
              )}
            {seguro.valor_conta_energia !== undefined &&
              seguro.valor_conta_energia > 0 && (
                <p>
                  <strong>Valor da Conta de Energia:</strong> R${" "}
                  {formatValor(seguro.valor_conta_energia.toFixed(2))}
                </p>
              )}
            {seguro.valor_conta_gas !== undefined &&
              seguro.valor_conta_gas > 0 && (
                <p>
                  <strong>Valor da Conta de Gás:</strong> R${" "}
                  {formatValor(seguro.valor_conta_gas.toFixed(2))}
                </p>
              )}
            {seguro.valor_condominio !== undefined &&
              seguro.valor_condominio > 0 && (
                <p>
                  <strong>Valor do Condomínio:</strong> R${" "}
                  {formatValor(seguro.valor_condominio.toFixed(2))}
                </p>
              )}
            {seguro.valor_iptu !== undefined && seguro.valor_iptu > 0 && (
              <p>
                <strong>Valor do IPTU:</strong> R${" "}
                {formatValor(seguro.valor_iptu.toFixed(2))}
              </p>
            )}

            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Coberturas
            </h3>
            <p>
              <strong>Danos ao Imóvel:</strong> {seguro.danos_imovel}
            </p>
            <p>
              <strong>Multa Rescisória:</strong> {seguro.multa_recisao}
            </p>
            <p>
              <strong>Pintura Interna:</strong> {seguro.pintura_interna}
            </p>
            <p>
              <strong>Pintura Externa:</strong> {seguro.pintura_externa}
            </p>

            {/* Observações, se disponíveis */}
            {seguro.observacao && (
              <>
                <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                  Observações
                </h3>
                <p>{seguro.observacao}</p>
              </>
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
  );
}
