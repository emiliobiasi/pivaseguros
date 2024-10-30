export type SeguroFiancaEmpresarialMenos2Anos = {
  id: string;
  id_numero: number;
  status: "EM ANÁLISE" | "APROVADO" | "REPROVADO";
  acao: "PENDENTE" | "FINALIZADO";
  nome_imobiliaria: string;
  nome_pretendente: string;
  sexo_pretendente: "MASCULINO" | "FEMININO";
  cpf: string;
  rg: string;
  data_expedicao_rg: Date;
  data_nascimento: Date;
  orgao_emissor_rg: string;
  estado_civil_locatario: "SOLTEIRO" | "CASADO" | "DIVORCIADO" | "VIÚVO";
  email: string;
  telefone_pretendente: string;
  nome_conjuge?: string;
  cpf_conjuge?: string;
  sexo_pretendente_conjuge?: "MASCULINO" | "FEMININO";
  composicao_renda_conjuge?: "SIM" | "NÃO";
  data_expedicao_rg_conjuge?: Date;
  data_nascimento_conjuge?: Date;
  orgao_emissor_conjuge?: string;
  quadro_societario?: "SIM" | "NÃO";
  fone_residencial?: string;
  fone_celular?: string;
  cep?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  numero?: string;
  complemento?: string;
  tipo_residencia:
    | "MENOS DE 1 ANO"
    | "1 A 2 ANOS"
    | "3 A 4 ANOS"
    | "5 A 6 ANOS"
    | "7 A 9 ANOS"
    | "ACIMA DE 10 ANOS";
  condicao_imovel:
    | "ALUGADO (EM NOME DO PRETENDENTE)"
    | "ALUGADO (NOME DOS OUTROS)"
    | "PRÓPRIO"
    | "FINANCIADO (EM NOME PRÓPRIO)"
    | "FINANCIADO (NOME DE OUTROS)";
  arca_com_aluguel: "SIM" | "NÃO";
  valor_aluguel_atual?: number;
  nome_locator_proprietario_imobiliaria?: string;
  telefone_contato?: string;
  vinculo_empregaticio:
    | "AUTÔNOMO"
    | "EMPRESÁRIO"
    | "ESTUDANTE"
    | "FUNCIONÁRIO PÚBLICO"
    | "FUNCIONÁRIO COM REGISTRO CLT"
    | "PROFISSIONAL LIBERAL"
    | "APOSENTADO";
  profissao: string;
  nome_empresa_trabalho?: string;
  data_emissao?: Date;
  fone?: string;
  ramal?: string;
  salario?: number;
  outros_rendimentos?: number;
  total_rendimentos_mensais?: number;
  vinculo_empregaticio_conjuge?:
    | "AUTÔNOMO"
    | "EMPRESÁRIO"
    | "ESTUDANTE"
    | "FUNCIONÁRIO PÚBLICO"
    | "FUNCIONÁRIO COM REGISTRO CLT"
    | "PROFISSIONAL LIBERAL"
    | "APOSENTADO";
  profissao_conjuge?: string;
  nome_empresa_trabalho_conjuge?: string;
  data_emissao_conjuge?: Date;
  fone_conjuge?: string;
  ramal_conjuge?: string;
  salario_conjuge?: number;
  outros_rendimentos_conjuge?: number;
  total_rendimentos_mensais_conjuge?: number;
  alocacao_pretendida_constituida: "SIM" | "NÃO";
  cnpj_pessoa_fisica_nao_residencial?: string;
  cnae_empresa?: string;
  franquia: "SIM" | "NÃO";
  nome_franqueadora?: string;
  principais_produtos_servicos?: string;
  xp_ramo_pretendido?: string;
  cpf_socio_1?: string;
  cpf_socio_2?: string;
  cpf_socio_3?: string;
  onus: "SIM" | "NÃO";
  detalhamento_onus?: string;
  tipo_qtd_parcela_a_1?: number;
  tipo_qtd_parcela_a_2?: number;
  tipo_qtd_parcela_a_3?: number;
  valor_parcela_a_1?: number;
  valor_parcela_a_2?: number;
  valor_parcela_a_3?: number;
  tipo_qtd_parcela_b_1?: number;
  tipo_qtd_parcela_b_2?: number;
  tipo_qtd_parcela_b_3?: number;
  valor_parcela_b_1?: number;
  valor_parcela_b_2?: number;
  valor_parcela_b_3?: number;
  investimento_abertura: "SIM" | "NÃO";
  compra_produto_cap_inicial?: number;
  obras_reformas_cap_inicial?: number;
  maquinas_cap_inicial?: number;
  despesas_legais_cap_inicial?: number;
  moveis_cap_inicial?: number;
  cursos_cap_inicial?: number;
  estoques_cap_inicial?: number;
  divulgacao_cap_inicial?: number;
  reposicao_material_cap_giro?: number;
  consumo_cap_giro?: number;
  reposicao_estoque_cap_giro?: number;
  folha_pagamento_cap_giro?: number;
  financiamento_vendas_cap_giro?: number;
  impostos_taxas_cap_giro?: number;
  cep_imovel_alugado?: string;
  endereco_imovel_alugado?: string;
  bairro_imovel_alugado?: string;
  cidade_imovel_alugado?: string;
  estado_imovel_alugado?: string;
  numero_imovel_alugado?: string;
  complemento_imovel_alugado?: string;
  aluguel_imovel_alugado?: number;
  desp_ordinarias_cond_imovel_alugado?: number;
  iptu_imovel_alugado?: number;
  agua_imovel_alugado?: number;
  luz_imovel_alugado?: number;
  energia_imovel_alugado?: number;
  gas_canalizado_imovel_alugado?: number;

  danos_imovel: "SIM" | "NÃO";
  multa_rescisao: "SIM" | "NÃO";
  pintura_interna: "SIM" | "NÃO";
  pintura_externa: "SIM" | "NÃO";

  motivo_locacao:
    | "ABERTURA DE FILIAL"
    | "ABERTURA DE MATRIZ"
    | "TROCA LOCAL DE SEDE"
    | "REDUÇÃO DE CUSTOS"
    | "LOCAÇÃO PARA MORADIA";
  cpf_morador?: string;
  created: Date;
};
