export type SeguroFiancaResidencial = {
  id: string;
  id_numero: number;
  status: "EM ANÁLISE" | "APROVADO" | "REPROVADO";
  acao: "PENDENTE" | "FINALIZADO";
  nome_imobiliaria_corretor: string;

  cpf_residente: string;
  nome_residente: string;
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
  observacao?: string;
  created: Date;
};
