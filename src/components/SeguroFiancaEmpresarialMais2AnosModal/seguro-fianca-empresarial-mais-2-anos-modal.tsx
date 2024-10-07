import { SeguroFiancaEmpresarialMais2Anos } from "@/types/SeguroFiancaEmpresarialMais2Anos";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatValor } from "@/utils/regex/regexValor";

type SeguroFiancaEmpresarialMais2AnosModalProps = {
  seguro: SeguroFiancaEmpresarialMais2Anos;
  isOpen: boolean;
  onClose: () => void;
};

export function SeguroFiancaEmpresarialMais2AnosModal({
  seguro,
  isOpen,
  onClose,
}: SeguroFiancaEmpresarialMais2AnosModalProps) {
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
            Detalhes de {seguro.nome_empresa}
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
              <strong>Nome da Empresa:</strong> {seguro.nome_empresa}
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
            {seguro.capital_social !== undefined && seguro.capital_social > 0 && (
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
            <h3 className="text-lg font-semibold text-[#025d37]">
              Endereço da Empresa
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
          </div>

          {/* Terceira Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37]">
              Informações da Locação
            </h3>
            <p>
              <strong>Motivo da Locação:</strong> {seguro.motivo_locacao}
            </p>
            <p>
              <strong>Tipo do Imóvel:</strong> {seguro.tipo_imovel}
            </p>
            <p>
              <strong>Valor do Aluguel:</strong> R${" "}
              {formatValor(seguro.valor_aluguel.toFixed(2))}
            </p>
            <p>
              <strong>Nome do Locador/Imobiliária:</strong>{" "}
              {seguro.nome_locador_imobiliaria}
            </p>
            <p>
              <strong>Telefone:</strong> {seguro.telefone}
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
