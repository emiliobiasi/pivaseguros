import { SeguroIncendio } from "@/types/SeguroIncendio";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type SeguroIncendioModalProps = {
  seguro: SeguroIncendio;
  isOpen: boolean;
  onClose: () => void;
};

export function SeguroIncendioModal({
  seguro,
  isOpen,
  onClose,
}: SeguroIncendioModalProps) {
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
            Detalhes de {seguro.nome_locatario}
          </h2>
          <button
            onClick={onClose}
            className="text-[#027B49] hover:text-[#025d37]"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Informações da Imobiliária */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Informações da Imobiliária
            </h3>
            <p>
              <strong>Nome da Imobiliária:</strong> {seguro.nome_imobiliaria}
            </p>
            <p>
              <strong>E-mail da Imobiliária:</strong> {seguro.email_imobiliaria}
            </p>
          </div>

          {/* Informações do Proponente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Proponente</h3>
            <p>
              <strong>Nome do Proponente:</strong> {seguro.nome_locatario}
            </p>
            <p>
              <strong>CPF do Proponente:</strong> {seguro.cpf_locatario}
            </p>
            <p>
              <strong>Data de Nascimento:</strong>{" "}
              {new Date(seguro.data_nascimento_locatario).toLocaleDateString()}
            </p>
            <p>
              <strong>Estado Civil:</strong> {seguro.estado_civil}
            </p>
            <p>
              <strong>Sexo:</strong> {seguro.sexo_locatario}
            </p>
          </div>

          {/* Informações do Locador */}
          {seguro.nome_locador && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Locador</h3>
              <p>
                <strong>Nome do Locador:</strong> {seguro.nome_locador}
              </p>
              {seguro.cpf_locador_opcional && (
                <p>
                  <strong>CPF do Locador:</strong> {seguro.cpf_locador_opcional}
                </p>
              )}
            </div>
          )}

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Endereço</h3>
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
          </div>

          {/* Informações do Imóvel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Imóvel</h3>
            <p>
              <strong>Tipo do Imóvel:</strong> {seguro.tipo_imovel}
            </p>
          </div>

          {/* Coberturas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Coberturas</h3>
            {seguro.incendio && (
              <p>
                <strong>Incêndio:</strong> R$ {seguro.incendio.toFixed(2)}
              </p>
            )}
            {seguro.vendaval && (
              <p>
                <strong>Vendaval:</strong> R$ {seguro.vendaval.toFixed(2)}
              </p>
            )}
            {seguro.danos_eletricos && (
              <p>
                <strong>Danos Elétricos:</strong> R${" "}
                {seguro.danos_eletricos.toFixed(2)}
              </p>
            )}
            {seguro.impacto_veiculos && (
              <p>
                <strong>Impacto de Veículos:</strong> R${" "}
                {seguro.impacto_veiculos.toFixed(2)}
              </p>
            )}
            {seguro.perda_aluguel && (
              <p>
                <strong>Perda de Aluguel:</strong> R${" "}
                {seguro.perda_aluguel.toFixed(2)}
              </p>
            )}
            {seguro.responsabilidade_civil && (
              <p>
                <strong>Responsabilidade Civil:</strong> R${" "}
                {seguro.responsabilidade_civil.toFixed(2)}
              </p>
            )}
          </div>

          {/* Informações do Seguro */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Seguro</h3>
            <p>
              <strong>Plano Escolhido:</strong> {seguro.plano_escolhido}
            </p>
            <p>
              <strong>Valor do Seguro:</strong> R${" "}
              {seguro.valor_seguro.toFixed(2)}
            </p>
            <p>
              <strong>Forma de Pagamento:</strong> {seguro.forma_pagamento}
            </p>
            <p>
              <strong>Incluir Cláusula Beneficiária:</strong>{" "}
              {seguro.inclusao_clausula_beneficiaria}
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
