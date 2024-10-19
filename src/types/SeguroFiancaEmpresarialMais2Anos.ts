export type SeguroFiancaEmpresarialMais2Anos = {
  id: string;
  id_numero: number;
  status: "EM ANÁLISE" | "APROVADO" | "REPROVADO";
  acao: "PENDENTE" | "FINALIZADO";

  nome_imobiliaria: string;
  opcao_tributaria: "LUCRO REAL" | "LUCRO" | "PRESUMIDO" | "SIMPLES NACIONAL";
  nome_empresa: string;
  cnpj: string;
  telefone_empresa: string;
  email_empresa: string;
  atividade_economica: string;
  capital_social?: number;
  faturamento_mensal?: number;
  nome_socio_1?: string;
  cpf_socio_1?: string;
  nome_socio_2?: string;
  cpf_socio_2?: string;

  cep: string;
  endereco: string;
  bairro: string;
  numero_endereco: number;
  complemento?: string;
  cidade: string;
  estado: string;

  cep_empresa: string;
  endereco_empresa: string;
  bairro_empresa: string;
  numero_endereco_empresa: number;
  cidade_empresa: string;
  estado_empresa: string;
  complemento_empresa?: string;

  motivo_locacao:
    | "ABERTURA DE FILIAL"
    | "TROCA DO LOCAL"
    | "DE SEDE"
    | "LOCAÇÃO PARA MORADIA";
  tipo_imovel: "PRÓPRIO" | "ALUGADO";
  valor_aluguel?: number;
  nome_locador_imobiliaria?: string;
  telefone?: string;
  aluguel: number;
  agua?: number;
  energia?: number;
  gas?: number;
  condominio?: number;
  iptu?: number;
  danos_imovel: "SIM" | "NÃO";
  multa_rescisao: "SIM" | "NÃO";
  pintura_interna: "SIM" | "NÃO";
  pintura_externa: "SIM" | "NÃO";
  observacao?: string;
  created: Date;
  updated: Date;
};
