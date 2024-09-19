export type SeguroFiancaEmpresarialMais2Anos = {
  id: string;
  acao: "PENDENTE" | "FINALIZADO";
  nome_imobiliaria_corretor: string;
  opcao_tributaria: "LUCRO REAL" | "LUCRO" | "PRESUMIDO" | "SIMPLES NACIONAL";
  tipo_empresa:
    | "LIMITADA"
    | "INDIVIDUAL"
    | "MICROEMPRESA"
    | "PÚBLICA"
    | "SEM FINS LUCRATIVOS";
  nome_empresa: string;
  telefone_empresa: string;
  email_empresa: string;
  cnpj: string;
  atividade_economica: string;
  valor_capital_social?: number;
  faturamento_mensal?: number;
  cpf_socio_1?: string;
  cpf_socio_2?: string;
  cpf_socio_3?: string;
  endereco_sede_atual: string;
  motivo_locacao:
    | "ABERTURA DE FILIA"
    | "TROCA DO LOCAL"
    | "DE SEDE"
    | "LOCAÇÃO PARA MORADIA";
  tipo_imovel: "PRÓPRIO" | "ALUGADO";
  valor_locacao_pretendida: number;
  valor_conta_agua?: number;
  valor_conta_energia?: number;
  valor_aluguel_atual?: number;
  nome_locador_imobiliaria: string;
  telefone: number;
  created: Date;
  updated: Date;
};
