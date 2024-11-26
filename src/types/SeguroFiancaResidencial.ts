export type SeguroFiancaResidencial = {
  id: string;
  id_numero: number;
  status: "EM ANÁLISE" | "APROVADO" | "REPROVADO";
  acao: "PENDENTE" | "FINALIZADO";

  nome_imobiliaria_corretor: string;
  nome_residente: string;
  cpf_residente: string;
  telefone: string;
  email: string;
  profissao: string;
  renda_mensal?: number;
  data_nascimento: Date;
  estado_civil_residente: "SOLTEIRO" | "CASADO" | "VIÚVO" | "DIVORCIADO";

  nome_residente_nao?: string;
  cpf_residente_nao?: string;
  data_nascimento_residente_nao: Date;
  profissao_residente_nao?: string;
  renda_mensal_residente_nao?: number;

  telefone_residente_nao?: string;
  email_residente_nao?: string;

  residir_imovel: "SIM" | "NÃO";
  responder_financeiramente: "SIM" | "NÃO";

  renda_composta_conjuge?: "SIM" | "NÃO";
  nome_conjuge?: string;
  cpf_conjuge: string;
  profissao_conjuge_opcional?: string;
  telefone_conjuge?: string;
  email_conjuge?: string;
  renda_mensal_conjuge_opcional?: string;

  // //////////////////////////////////

  nome_imobiliaria_corretor_2?: string;
  nome_residente_2?: string;
  cpf_residente_2?: string;
  telefone_2?: string;
  email_2?: string;
  profissao_2?: string;
  renda_mensal_2?: number;
  data_nascimento_2?: Date;
  estado_civil_residente_2?: "SOLTEIRO" | "CASADO" | "VIÚVO" | "DIVORCIADO";

  nome_residente_nao_2?: string;
  cpf_residente_nao_2?: string;
  data_nascimento_residente_nao_2?: Date;
  profissao_residente_nao_2?: string;
  renda_mensal_residente_nao_2?: number;

  telefone_residente_nao_2?: string;
  email_residente_nao_2?: string;

  residir_imovel_2?: "SIM" | "NÃO";
  responder_financeiramente_2?: "SIM" | "NÃO";

  renda_composta_conjuge_2?: "SIM" | "NÃO";
  nome_conjuge_2?: string;
  cpf_conjuge_2?: string;
  profissao_conjuge_opcional_2?: string;
  telefone_conjuge_2?: string;
  email_conjuge_2?: string;
  renda_mensal_conjuge_opcional_2?: string;

  cep_locacao: string;
  endereco_locacao: string;
  numero_locacao: string;
  bairro_locacao: string;
  cidade_locacao: string;
  estado_locacao: string;
  tipo_imovel: "CASA" | "APTO" | "CASA CONDOMÍNIO";
  complemento_locacao?: string;
  valor_aluguel: number;
  valor_conta_agua?: number;
  valor_conta_energia?: number;
  valor_conta_gas?: number;
  valor_condominio?: number;
  valor_iptu?: number;
  danos_imovel: "SIM" | "NÃO";
  multa_recisao: "SIM" | "NÃO";
  pintura_interna: "SIM" | "NÃO";
  pintura_externa: "SIM" | "NÃO";

  incluir_pretendente: "SIM" | "NÃO";

  observacao?: string;
  created: Date;
};
