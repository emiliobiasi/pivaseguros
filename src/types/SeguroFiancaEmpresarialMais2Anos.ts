export type SeguroFiancaEmpresarialMais2Anos = {
  id: string;
  id_numero: number;
  acao: "PENDENTE" | "FINALIZADO";
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

  motivo_locacao:
    | "ABERTURA DE FILIA"
    | "TROCA DO LOCAL"
    | "DE SEDE"
    | "LOCAÇÃO PARA MORADIA";
  tipo_imovel: "PRÓPRIO" | "ALUGADO";
  valor_aluguel: number;
  nome_locador_imobiliaria: string;
  telefone: number;
  created: Date;
  updated: Date;
};
