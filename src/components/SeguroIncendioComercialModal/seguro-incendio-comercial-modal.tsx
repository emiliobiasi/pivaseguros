import { SeguroIncendioComercial } from "@/types/SeguroIncendioComercial";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatValor } from "@/utils/regex/regexValor";
import { formatarData } from "@/utils/dateformater/dateFormater";

type SeguroIncendioComercialModalProps = {
  seguro: SeguroIncendioComercial;
  isOpen: boolean;
  onClose: () => void;
};

export function SeguroIncendioComercialModal({
  seguro,
  isOpen,
  onClose,
}: SeguroIncendioComercialModalProps) {
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
              Informações da Imobiliária
            </h3>
            <p>
              <strong>Nome da Imobiliária:</strong> {seguro.nome_imobiliaria}
            </p>
            <p>
              <strong>E-mail da Imobiliária:</strong> {seguro.email_imobiliaria}
            </p>

            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Informações do Locatário
            </h3>
            <p>
              <strong>Nome do Locatário:</strong> {seguro.nome_locatario}
            </p>
            {seguro.cpf_locatario && (
              <p>
                <strong>CPF do Locatário:</strong> {seguro.cpf_locatario}
              </p>
            )}
            {seguro.cnpj_locatario && (
              <p>
                <strong>CNPJ do Locatário:</strong> {seguro.cnpj_locatario}
              </p>
            )}
            <p>
              <strong>Data de Nascimento:</strong>{" "}
              {formatarData(seguro.data_nascimento_locatario)}
            </p>
            <p>
              <strong>Estado Civil:</strong> {seguro.estado_civil}
            </p>
            <p>
              <strong>Sexo:</strong> {seguro.sexo_locatario}
            </p>
          </div>

          {/* Segunda Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37]">Endereço</h3>
            <p>
              <strong>CEP:</strong> {seguro.cep}
            </p>
            <p>
              <strong>Endereço:</strong> {seguro.endereco}
            </p>
            <p>
              <strong>Bairro:</strong> {seguro.bairro}
            </p>
            <p>
              <strong>Número:</strong> {seguro.numero_endereco}
            </p>
            <p>
              <strong>Complemento:</strong> {seguro.complemento || "N/A"}
            </p>
            <p>
              <strong>Cidade:</strong> {seguro.cidade}
            </p>
            <p>
              <strong>Estado:</strong> {seguro.estado}
            </p>

            {/* <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Informações do Imóvel
            </h3>
            <p>
              <strong>Tipo do Imóvel:</strong> {seguro.tipo_imovel}
            </p> */}
          </div>

          {/* Terceira Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#025d37]">Coberturas</h3>
            {seguro.incendio !== undefined && seguro.incendio > 0 && (
              <p>
                <strong>Incêndio:</strong> R${" "}
                {formatValor(seguro.incendio.toFixed(2))}
              </p>
            )}
            {seguro.vendaval !== undefined && seguro.vendaval > 0 && (
              <p>
                <strong>Vendaval:</strong> R${" "}
                {formatValor(seguro.vendaval.toFixed(2))}
              </p>
            )}
            {seguro.danos_eletricos !== undefined &&
              seguro.danos_eletricos > 0 && (
                <p>
                  <strong>Danos Elétricos:</strong> R${" "}
                  {formatValor(seguro.danos_eletricos.toFixed(2))}
                </p>
              )}
            {seguro.impacto_veiculos !== undefined &&
              seguro.impacto_veiculos > 0 && (
                <p>
                  <strong>Impacto de Veículos:</strong> R${" "}
                  {formatValor(seguro.impacto_veiculos.toFixed(2))}
                </p>
              )}
            {seguro.perda_aluguel !== undefined && seguro.perda_aluguel > 0 && (
              <p>
                <strong>Perda de Aluguel:</strong> R${" "}
                {formatValor(seguro.perda_aluguel.toFixed(2))}
              </p>
            )}
            {seguro.responsabilidade_civil !== undefined &&
              seguro.responsabilidade_civil > 0 && (
                <p>
                  <strong>Responsabilidade Civil:</strong> R${" "}
                  {formatValor(seguro.responsabilidade_civil.toFixed(2))}
                </p>
              )}

            <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
              Informações do Seguro
            </h3>
            <p>
              <strong>Vigência do seguro:</strong>{" "}
              {seguro.vigencia_seguro_inicio} a {seguro.vigencia_seguro_termino}
            </p>
            <p>
              <strong>Atividade da Empresa:</strong> {seguro.atividade}
            </p>
            <p>
              <strong>ASSISTÊNCIA:</strong> {seguro.plano_escolhido}
            </p>
            <p>
              <strong>Valor do Seguro:</strong> R${" "}
              {formatValor(seguro.valor_seguro.toFixed(2))}
            </p>
            <p>
              <strong>Forma de Pagamento:</strong> {seguro.forma_pagamento}
            </p>
            <p>
              <strong>Incluir Cláusula Beneficiária:</strong>{" "}
              {seguro.inclusao_clausula_beneficiaria ? "Sim" : "Não"}
            </p>

            {(seguro.cpf_locador_opcional || seguro.nome_locador) && (
              <>
                <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                  Locador (opcional)
                </h3>
                {seguro.cpf_locador_opcional && (
                  <p>
                    <strong>CPF do Locador:</strong>{" "}
                    {seguro.cpf_locador_opcional}
                  </p>
                )}
                {seguro.nome_locador && (
                  <p>
                    <strong>Nome do Locador:</strong> {seguro.nome_locador}
                  </p>
                )}
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
