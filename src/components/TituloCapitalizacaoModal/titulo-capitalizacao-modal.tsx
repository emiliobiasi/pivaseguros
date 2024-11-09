import { TituloCapitalizacao } from "@/types/TituloCapitalizacao";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatValor } from "@/utils/regex/regexValor";
import { formatarData } from "@/utils/dateformater/dateFormater";

type TituloCapitalizacaoModalProps = {
  titulo: TituloCapitalizacao;
  isOpen: boolean;
  onClose: () => void;
};

export function TituloCapitalizacaoModal({
  titulo,
  isOpen,
  onClose,
}: TituloCapitalizacaoModalProps) {
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
            Detalhes de {titulo.nome}
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
              Informações do Locatário
            </h3>
            <p>
              <strong>Nome:</strong> {titulo.nome}
            </p>
            {titulo.cpf && (
              <p>
                <strong>CPF:</strong> {titulo.cpf}
              </p>
            )}
            {titulo.cnpj && (
              <p>
                <strong>CNPJ:</strong> {titulo.cnpj}
              </p>
            )}
            <p>
              <strong>Email:</strong> {titulo.email}
            </p>
            <p>
              <strong>Telefone:</strong> {titulo.telefone}
            </p>
            <p>
              <strong>Profissão:</strong> {titulo.profissao}
            </p>
            <p>
              <strong>Valor da Remuneração:</strong> R${" "}
              {formatValor(titulo.valor_remuneracao.toFixed(2))}
            </p>
            <p>
              <strong>Data de Criação:</strong> {formatarData(titulo.created)}
            </p>
          </div>

          {/* Segunda Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37]">Endereço</h3>
            <p>
              <strong>CEP:</strong> {titulo.cep}
            </p>
            <p>
              <strong>Endereço:</strong> {titulo.endereco}
            </p>
            <p>
              <strong>Bairro:</strong> {titulo.bairro}
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
              <strong>Cidade:</strong> {titulo.cidade}
            </p>
            <p>
              <strong>Estado:</strong> {titulo.estado}
            </p>

            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Imobiliária
            </h3>
            <p>
              <strong>Imobiliária:</strong> {titulo.imobiliaria}
            </p>
          </div>

          {/* Terceira Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37]">
              Informações do Proprietário
            </h3>
            <p>
              <strong>Nome do Proprietário:</strong> {titulo.nome_proprietario}
            </p>
            {titulo.cpf_proprietario && (
              <p>
                <strong>CPF do Proprietário:</strong> {titulo.cpf_proprietario}
              </p>
            )}
            {titulo.cnpj_proprietario && (
              <p>
                <strong>CNPJ do Proprietário:</strong>{" "}
                {titulo.cnpj_proprietario}
              </p>
            )}
            <p>
              <strong>Email do Proprietário:</strong>{" "}
              {titulo.email_proprietario}
            </p>
            <p>
              <strong>Telefone do Proprietário:</strong>{" "}
              {titulo.telefone_proprietario}
            </p>

            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Dados da Locação
            </h3>
            <p>
              <strong>Tipo do Imóvel:</strong> {titulo.tipo_imovel}
            </p>
            <p>
              <strong>Valor do Aluguel Mensal:</strong> R${" "}
              {formatValor(titulo.valor_aluguel_mensal.toFixed(2))}
            </p>
            <p>
              <strong>Valor Total dos Títulos:</strong> R${" "}
              {formatValor(titulo.valor_total_titulos.toFixed(2))}
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
