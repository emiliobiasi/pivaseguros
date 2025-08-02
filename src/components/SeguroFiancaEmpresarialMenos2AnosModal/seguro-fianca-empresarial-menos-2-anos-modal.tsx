import { SeguroFiancaEmpresarialMenos2Anos } from "@/types/SeguroFiancaEmpresarialMenos2Anos"
import { XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatValor } from "@/utils/regex/regexValor"
import { formatarData } from "@/utils/dateformater/dateFormater"

type SeguroFiancaEmpresarialMenos2AnosModalProps = {
  seguro: SeguroFiancaEmpresarialMenos2Anos
  isOpen: boolean
  onClose: () => void
}

export function SeguroFiancaEmpresarialMenos2AnosModal({
  seguro,
  isOpen,
  onClose,
}: SeguroFiancaEmpresarialMenos2AnosModalProps) {
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
            Detalhes de {seguro.nome_pretendente}
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
            {/* Dados do Pretendente */}
            <>
              <h3 className="text-lg font-semibold text-[#025d37]">
                Dados do Pretendente
              </h3>
              <p>
                <strong>Nome da Imobiliária:</strong> {seguro.nome_imobiliaria}
              </p>
              <p>
                <strong>Nome:</strong> {seguro.nome_pretendente}
              </p>
              <p>
                <strong>Sexo:</strong> {seguro.sexo_pretendente}
              </p>
              <p>
                <strong>CPF:</strong> {seguro.cpf}
              </p>
              <p>
                <strong>RG:</strong> {seguro.rg}
              </p>
              <p>
                <strong>Data de Expedição do RG:</strong>{" "}
                {formatarData(seguro.data_expedicao_rg)}
              </p>
              <p>
                <strong>Data de Nascimento:</strong>{" "}
                {formatarData(seguro.data_nascimento)}
              </p>
              <p>
                <strong>Órgão Emissor do RG:</strong> {seguro.orgao_emissor_rg}
              </p>
              <p>
                <strong>Estado Civil:</strong> {seguro.estado_civil_locatario}
              </p>
              <p>
                <strong>Email:</strong> {seguro.email}
              </p>
              <p>
                <strong>Telefone:</strong> {seguro.telefone_pretendente}
              </p>
              {seguro.fone_residencial && (
                <p>
                  <strong>Fone Residencial:</strong> {seguro.fone_residencial}
                </p>
              )}
              {seguro.fone_celular && (
                <p>
                  <strong>Fone Celular:</strong> {seguro.fone_celular}
                </p>
              )}
            </>

            {/* Dados do Cônjuge */}
            {seguro.estado_civil_locatario === "CASADO" && (
              <>
                <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                  Dados do Cônjuge
                </h3>
                <p>
                  <strong>Nome do Cônjuge:</strong> {seguro.nome_conjuge}
                </p>
                {seguro.cpf_conjuge && (
                  <p>
                    <strong>CPF do Cônjuge:</strong> {seguro.cpf_conjuge}
                  </p>
                )}
                {seguro.sexo_pretendente_conjuge && (
                  <p>
                    <strong>Sexo do Cônjuge:</strong>{" "}
                    {seguro.sexo_pretendente_conjuge}
                  </p>
                )}
                {seguro.data_expedicao_rg_conjuge && (
                  <p>
                    <strong>Data de Expedição do RG do Cônjuge:</strong>{" "}
                    {formatarData(seguro.data_expedicao_rg_conjuge)}
                  </p>
                )}
                {seguro.data_nascimento_conjuge && (
                  <p>
                    <strong>Data de Nascimento do Cônjuge:</strong>{" "}
                    {formatarData(seguro.data_nascimento_conjuge)}
                  </p>
                )}
                {seguro.orgao_emissor_conjuge && (
                  <p>
                    <strong>Órgão Emissor do RG do Cônjuge:</strong>{" "}
                    {seguro.orgao_emissor_conjuge}
                  </p>
                )}
                {seguro.composicao_renda_conjuge && (
                  <p>
                    <strong>Composição de Renda com Cônjuge:</strong>{" "}
                    {seguro.composicao_renda_conjuge}
                  </p>
                )}
              </>
            )}

            {/* Dados da Empresa */}
            <>
              <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                Dados da Empresa
              </h3>
              <p>
                <strong>Alocação Pretendida Constituída:</strong>{" "}
                {seguro.alocacao_pretendida_constituida}
              </p>

              {seguro.alocacao_pretendida_constituida === "SIM" && (
                <p>
                  <strong>CNPJ:</strong>{" "}
                  {seguro.cnpj_pessoa_fisica_nao_residencial}
                </p>
              )}
              {seguro.cnae_empresa && (
                <p>
                  <strong>CNAE da Empresa:</strong> {seguro.cnae_empresa}
                </p>
              )}
              {seguro.franquia && (
                <p>
                  <strong>Franquia:</strong> {seguro.franquia}
                </p>
              )}
              {seguro.franquia === "SIM" && (
                <p>
                  <strong>Nome da Franqueadora:</strong>{" "}
                  {seguro.nome_franqueadora}
                </p>
              )}
              {seguro.principais_produtos_servicos && (
                <p>
                  <strong>Principais Produtos/Serviços:</strong>{" "}
                  {seguro.principais_produtos_servicos}
                </p>
              )}
              {seguro.xp_ramo_pretendido && (
                <p>
                  <strong>Experiência no Ramo Pretendido:</strong>{" "}
                  {seguro.xp_ramo_pretendido}
                </p>
              )}
              {/* Sócios */}
              {(seguro.cpf_socio_1 ||
                seguro.cpf_socio_2 ||
                seguro.cpf_socio_3) && (
                <>
                  <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                    Sócios
                  </h3>
                  {seguro.cpf_socio_1 && (
                    <p>
                      <strong>CPF do Sócio 1:</strong> {seguro.cpf_socio_1}
                    </p>
                  )}
                  {seguro.cpf_socio_2 && (
                    <p>
                      <strong>CPF do Sócio 2:</strong> {seguro.cpf_socio_2}
                    </p>
                  )}
                  {seguro.cpf_socio_3 && (
                    <p>
                      <strong>CPF do Sócio 3:</strong> {seguro.cpf_socio_3}
                    </p>
                  )}
                </>
              )}
            </>
          </div>

          {/* Segunda Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            {/* Endereço Residencial */}
            {/* <>
              <h3 className="text-lg font-semibold text-[#025d37]">
                Endereço Residencial
              </h3>
              {seguro.cep && (
                <p>
                  <strong>CEP:</strong> {seguro.cep}
                </p>
              )}
              {seguro.endereco && (
                <p>
                  <strong>Endereço:</strong> {seguro.endereco}
                </p>
              )}
              {seguro.numero && (
                <p>
                  <strong>Número:</strong> {seguro.numero}
                </p>
              )}
              {seguro.complemento && (
                <p>
                  <strong>Complemento:</strong> {seguro.complemento}
                </p>
              )}
              {seguro.bairro && (
                <p>
                  <strong>Bairro:</strong> {seguro.bairro}
                </p>
              )}
              {seguro.cidade && (
                <p>
                  <strong>Cidade:</strong> {seguro.cidade}
                </p>
              )}
              {seguro.estado && (
                <p>
                  <strong>Estado:</strong> {seguro.estado}
                </p>
              )}

              <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                Informações sobre a Residência
              </h3>
              <p>
                <strong>Tipo de Residência:</strong> {seguro.tipo_residencia}
              </p>
              <p>
                <strong>Condição do Imóvel:</strong> {seguro.condicao_imovel}
              </p>
              <p>
                <strong>Arca com Aluguel:</strong> {seguro.arca_com_aluguel}
              </p>
              {seguro.valor_aluguel_atual !== undefined && (
                <p>
                  <strong>Valor do Aluguel Atual:</strong> R${" "}
                  {formatValor(seguro.valor_aluguel_atual.toFixed(2))}
                </p>
              )}
              {seguro.nome_locator_proprietario_imobiliaria && (
                <p>
                  <strong>Nome do Locador/Proprietário/Imobiliária:</strong>{" "}
                  {seguro.nome_locator_proprietario_imobiliaria}
                </p>
              )}
              {seguro.telefone_contato && (
                <p>
                  <strong>Telefone de Contato:</strong>{" "}
                  {seguro.telefone_contato}
                </p>
              )}
            </> */}

            {/* Informações Profissionais */}
            <>
              <h3 className="text-lg font-semibold text-[#025d37]">
                Informações Profissionais
              </h3>
              <p>
                <strong>Vínculo Empregatício:</strong>{" "}
                {seguro.vinculo_empregaticio}
              </p>
              <p>
                <strong>Profissão:</strong> {seguro.profissao}
              </p>
              {seguro.nome_empresa_trabalho && (
                <p>
                  <strong>Nome da Empresa:</strong>{" "}
                  {seguro.nome_empresa_trabalho}
                </p>
              )}
              {seguro.data_emissao && (
                <p>
                  <strong>Data de Emissão:</strong>{" "}
                  {formatarData(seguro.data_emissao)}
                </p>
              )}
              {seguro.fone && (
                <p>
                  <strong>Fone:</strong> {seguro.fone}
                </p>
              )}
              {seguro.ramal && (
                <p>
                  <strong>Ramal:</strong> {seguro.ramal}
                </p>
              )}

              {seguro.salario !== undefined && seguro.salario !== 0 ? (
                <p>
                  <strong>Salário / Rendimentos:</strong> R${" "}
                  {formatValor(seguro.salario.toFixed(2))}
                </p>
              ) : (
                <p>
                  <strong>Salário / Rendimentos:</strong> Não Informado
                </p>
              )}
            </>

            {/* Informações Profissionais do Cônjuge */}
            {seguro.composicao_renda_conjuge === "SIM" && (
              <>
                <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                  Informações Profissionais do Cônjuge
                </h3>
                <p>
                  <strong>Vínculo Empregatício:</strong>{" "}
                  {seguro.vinculo_empregaticio_conjuge}
                </p>
                <p>
                  <strong>Quadro Societário:</strong> {seguro.quadro_societario}
                </p>
                {seguro.profissao_conjuge && (
                  <p>
                    <strong>Profissão:</strong> {seguro.profissao_conjuge}
                  </p>
                )}
                {seguro.nome_empresa_trabalho_conjuge && (
                  <p>
                    <strong>Nome da Empresa:</strong>{" "}
                    {seguro.nome_empresa_trabalho_conjuge}
                  </p>
                )}
                {seguro.data_emissao_conjuge && (
                  <p>
                    <strong>Data de Emissão Cônjuge:</strong>{" "}
                    {formatarData(seguro.data_emissao_conjuge)}
                  </p>
                )}
                {seguro.fone_conjuge && (
                  <p>
                    <strong>Fone:</strong> {seguro.fone_conjuge}
                  </p>
                )}
                {seguro.ramal_conjuge && (
                  <p>
                    <strong>Ramal:</strong> {seguro.ramal_conjuge}
                  </p>
                )}
                {seguro.salario_conjuge !== undefined &&
                seguro.salario_conjuge !== 0 ? (
                  <p>
                    <strong>Salário:</strong> R${" "}
                    {formatValor(seguro.salario_conjuge.toFixed(2))}
                  </p>
                ) : (
                  <p>
                    <strong>Salário:</strong> Não Informado
                  </p>
                )}
                {seguro.outros_rendimentos_conjuge !== undefined && (
                  <p>
                    <strong>Outros Rendimentos:</strong> R${" "}
                    {formatValor(seguro.outros_rendimentos_conjuge.toFixed(2))}
                  </p>
                )}
                {seguro.total_rendimentos_mensais_conjuge !== undefined && (
                  <p>
                    <strong>Total de Rendimentos Mensais:</strong> R${" "}
                    {formatValor(
                      seguro.total_rendimentos_mensais_conjuge.toFixed(2)
                    )}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Terceira Coluna */}
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg ">
            {/* Investimento Inicial */}
            {/* <>
              <h3 className="text-lg font-semibold text-[#025d37]">
                Investimento Inicial
              </h3>
              <p>
                <strong>Investimento para Abertura:</strong>{" "}
                {seguro.investimento_abertura}
              </p>

              {seguro.investimento_abertura === "SIM" && (
                <>
                  {seguro.compra_produto_cap_inicial !== undefined && (
                    <p>
                      <strong>Compra de Produto (Capital Inicial):</strong> R${" "}
                      {formatValor(
                        seguro.compra_produto_cap_inicial.toFixed(2)
                      )}
                    </p>
                  )}
                  {seguro.obras_reformas_cap_inicial !== undefined && (
                    <p>
                      <strong>Obras e Reformas (Capital Inicial):</strong> R${" "}
                      {formatValor(
                        seguro.obras_reformas_cap_inicial.toFixed(2)
                      )}
                    </p>
                  )}
                  {seguro.maquinas_cap_inicial !== undefined && (
                    <p>
                      <strong>Máquinas (Capital Inicial):</strong> R${" "}
                      {formatValor(seguro.maquinas_cap_inicial.toFixed(2))}
                    </p>
                  )}
                  {seguro.despesas_legais_cap_inicial !== undefined && (
                    <p>
                      <strong>Despesas Legais (Capital Inicial):</strong> R${" "}
                      {formatValor(
                        seguro.despesas_legais_cap_inicial.toFixed(2)
                      )}
                    </p>
                  )}
                  {seguro.moveis_cap_inicial !== undefined && (
                    <p>
                      <strong>Móveis (Capital Inicial):</strong> R${" "}
                      {formatValor(seguro.moveis_cap_inicial.toFixed(2))}
                    </p>
                  )}
                  {seguro.cursos_cap_inicial !== undefined && (
                    <p>
                      <strong>Cursos (Capital Inicial):</strong> R${" "}
                      {formatValor(seguro.cursos_cap_inicial.toFixed(2))}
                    </p>
                  )}
                  {seguro.estoques_cap_inicial !== undefined && (
                    <p>
                      <strong>Estoques (Capital Inicial):</strong> R${" "}
                      {formatValor(seguro.estoques_cap_inicial.toFixed(2))}
                    </p>
                  )}
                  {seguro.divulgacao_cap_inicial !== undefined && (
                    <p>
                      <strong>Divulgação (Capital Inicial):</strong> R${" "}
                      {formatValor(seguro.divulgacao_cap_inicial.toFixed(2))}
                    </p>
                  )}

                  <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                    Capital de Giro
                  </h3>
                  {seguro.reposicao_material_cap_giro !== undefined && (
                    <p>
                      <strong>Reposição de Material:</strong> R${" "}
                      {formatValor(
                        seguro.reposicao_material_cap_giro.toFixed(2)
                      )}
                    </p>
                  )}
                  {seguro.consumo_cap_giro !== undefined && (
                    <p>
                      <strong>Consumo:</strong> R${" "}
                      {formatValor(seguro.consumo_cap_giro.toFixed(2))}
                    </p>
                  )}
                  {seguro.reposicao_estoque_cap_giro !== undefined && (
                    <p>
                      <strong>Reposição de Estoque:</strong> R${" "}
                      {formatValor(
                        seguro.reposicao_estoque_cap_giro.toFixed(2)
                      )}
                    </p>
                  )}
                  {seguro.folha_pagamento_cap_giro !== undefined && (
                    <p>
                      <strong>Folha de Pagamento:</strong> R${" "}
                      {formatValor(seguro.folha_pagamento_cap_giro.toFixed(2))}
                    </p>
                  )}
                  {seguro.financiamento_vendas_cap_giro !== undefined && (
                    <p>
                      <strong>Financiamento de Vendas:</strong> R${" "}
                      {formatValor(
                        seguro.financiamento_vendas_cap_giro.toFixed(2)
                      )}
                    </p>
                  )}
                  {seguro.impostos_taxas_cap_giro !== undefined && (
                    <p>
                      <strong>Impostos e Taxas:</strong> R${" "}
                      {formatValor(seguro.impostos_taxas_cap_giro.toFixed(2))}
                    </p>
                  )}
                </>
              )}
            </> */}

            {/* Endereço do Imóvel Alugado */}
            <>
              <h3 className="text-lg font-semibold text-[#025d37]">
                Endereço do Imóvel Alugado
              </h3>
              {seguro.cep_imovel_alugado && (
                <p>
                  <strong>CEP:</strong> {seguro.cep_imovel_alugado}
                </p>
              )}
              {seguro.endereco_imovel_alugado && (
                <p>
                  <strong>Endereço:</strong> {seguro.endereco_imovel_alugado}
                </p>
              )}
              {seguro.numero_imovel_alugado && (
                <p>
                  <strong>Número:</strong> {seguro.numero_imovel_alugado}
                </p>
              )}
              {seguro.complemento_imovel_alugado && (
                <p>
                  <strong>Complemento:</strong>{" "}
                  {seguro.complemento_imovel_alugado}
                </p>
              )}
              {seguro.bairro_imovel_alugado && (
                <p>
                  <strong>Bairro:</strong> {seguro.bairro_imovel_alugado}
                </p>
              )}
              {seguro.cidade_imovel_alugado && (
                <p>
                  <strong>Cidade:</strong> {seguro.cidade_imovel_alugado}
                </p>
              )}
              {seguro.estado_imovel_alugado && (
                <p>
                  <strong>Estado:</strong> {seguro.estado_imovel_alugado}
                </p>
              )}
            </>

            {/* Despesas do Imóvel Alugado */}
            <>
              <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                Despesas do Imóvel Alugado
              </h3>
              {seguro.aluguel_imovel_alugado != null &&
                !isNaN(seguro.aluguel_imovel_alugado) && (
                  <p>
                    <strong>Aluguel:</strong> R${" "}
                    {formatValor(seguro.aluguel_imovel_alugado.toFixed(2))}
                  </p>
                )}
              {seguro.desp_ordinarias_cond_imovel_alugado != null &&
                !isNaN(seguro.desp_ordinarias_cond_imovel_alugado) && (
                  <p>
                    <strong>Despesas Ordinárias do Condomínio:</strong> R${" "}
                    {formatValor(
                      seguro.desp_ordinarias_cond_imovel_alugado.toFixed(2)
                    )}
                  </p>
                )}
              {seguro.iptu_imovel_alugado != null &&
                !isNaN(seguro.iptu_imovel_alugado) && (
                  <p>
                    <strong>IPTU:</strong> R${" "}
                    {formatValor(seguro.iptu_imovel_alugado.toFixed(2))}
                  </p>
                )}
              {seguro.agua_imovel_alugado != null &&
                !isNaN(seguro.agua_imovel_alugado) && (
                  <p>
                    <strong>Água:</strong> R${" "}
                    {formatValor(seguro.agua_imovel_alugado.toFixed(2))}
                  </p>
                )}
              {seguro.luz_imovel_alugado != null &&
                !isNaN(seguro.luz_imovel_alugado) &&
                seguro.luz_imovel_alugado > 0 && (
                  <p>
                    <strong>Luz:</strong> R${" "}
                    {formatValor(seguro.luz_imovel_alugado.toFixed(2))}
                  </p>
                )}
              {seguro.energia_imovel_alugado != null &&
                !isNaN(seguro.energia_imovel_alugado) && (
                  <p>
                    <strong>Energia:</strong> R${" "}
                    {formatValor(seguro.energia_imovel_alugado.toFixed(2))}
                  </p>
                )}
              {seguro.gas_canalizado_imovel_alugado != null &&
                !isNaN(seguro.gas_canalizado_imovel_alugado) && (
                  <p>
                    <strong>Gás Canalizado:</strong> R${" "}
                    {formatValor(
                      seguro.gas_canalizado_imovel_alugado.toFixed(2)
                    )}
                  </p>
                )}
              <p>
                <strong>Danos ao Imóvel:</strong> {seguro.danos_imovel}
              </p>
              <p>
                <strong>Multa por Rescisão:</strong> {seguro.multa_rescisao}
              </p>
              <p>
                <strong>Pintura Interna:</strong> {seguro.pintura_interna}
              </p>
              <p>
                <strong>Pintura Externa:</strong> {seguro.pintura_externa}
              </p>
            </>

            {/* Motivo da Locação */}
            <>
              <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                Motivo da Locação
              </h3>
              <p>
                <strong>Motivo da Locação:</strong> {seguro.motivo_locacao}
              </p>
              {seguro.motivo_locacao === "LOCAÇÃO PARA MORADIA" && (
                <>
                  <p>
                    <strong>CPF do Morador:</strong> {seguro.cpf_morador}
                  </p>
                </>
              )}
            </>

            {/* Ônus */}
            {/* <>
              {seguro.onus && (
                <>
                  <h3 className="text-lg font-semibold mt-6 text-[#025d37]">
                    Ônus (Dívidas)
                  </h3>
                  <p>
                    <strong>Possui Ônus:</strong> {seguro.onus}
                  </p>
                </>
              )}

              {seguro.onus === "SIM" && (
                <>
                  {seguro.detalhamento_onus && (
                    <p>
                      <strong>Detalhamento dos Ônus:</strong>{" "}
                      {seguro.detalhamento_onus}
                    </p>
                  )}

                  {(seguro.tipo_qtd_parcela_a_1 ||
                    seguro.valor_parcela_a_1) && (
                    <>
                      <h4 className="text-md font-semibold mt-4">
                        Parcelas Tipo A
                      </h4>
                      {seguro.tipo_qtd_parcela_a_1 && (
                        <p>
                          <strong>Quantidade de Parcelas Tipo A1:</strong>{" "}
                          {seguro.tipo_qtd_parcela_a_1}
                        </p>
                      )}
                      {seguro.valor_parcela_a_1 !== undefined && (
                        <p>
                          <strong>Valor da Parcela A1:</strong> R${" "}
                          {formatValor(seguro.valor_parcela_a_1.toFixed(2))}
                        </p>
                      )}
                      {seguro.tipo_qtd_parcela_a_2 && (
                        <p>
                          <strong>Quantidade de Parcelas Tipo A2:</strong>{" "}
                          {seguro.tipo_qtd_parcela_a_2}
                        </p>
                      )}
                      {seguro.valor_parcela_a_2 !== undefined && (
                        <p>
                          <strong>Valor da Parcela A2:</strong> R${" "}
                          {formatValor(seguro.valor_parcela_a_2.toFixed(2))}
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </> */}
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
