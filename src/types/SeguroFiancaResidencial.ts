export type SeguroFiancaResidencial = {
  id: string;
  id_numero: number;
  acao: "PENDENTE" | "FINALIZADO";
  nome_imobiliaria_corretor: string; 
  cpf_residente: string; 
  nome_residente: string; 
  telefone: string;
  email: string; 
  profissao: string;
  renda_mensal?: number;
  data_nascimento: Date; 
  residir_imovel: "SIM" | "NÃO";
  responder_financeiramente: "SIM" | "NÃO";
  estado_civil_residente: "SOLTEIRO" | "CASADO" | "VIÚVO" | "DIVORCIADO";
  nome_conjuge?: string;
  cpf_conjuge?: string;
  renda_composta_conjuge: "SIM" | "NÃO";
  profissao_conjuge_opcional?: string;
  renda_mensal_conjuge_opcional?: string;



  cep_locacao: string;
  endereco_locacao: string;
  numero_locacao: string;
  bairro_locacao: string;
  cidade_locacao: string;
  estado_locacao: string;



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
