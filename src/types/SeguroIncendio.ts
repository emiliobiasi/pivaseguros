export type SeguroIncendio = {
  id: string;
  id_numero: number;
  acao: "PENDENTE" | "FINALIZADO";
  nome_imobiliaria: string;
  email_imobiliaria: string;
  nome_locatario: string;
  cpf_locatario?: string;
  cnpj_locatario?: string;
  data_nascimento_locatario: Date;
  estado_civil: "SOLTEIRO" | "CASADO" | "VIÚVO" | "DIVORCIADO";
  sexo_locatario: "MASCULINO" | "FEMININO";
  cep: string;
  endereco: string;
  bairro: string;
  numero_endereco: number;
  complemento?: string;
  cidade: string;
  estado: string;

  vigencia_seguro_inicio?: Date;
  vigencia_seguro_termino?: Date;

  tipo_imovel: "CASA" | "APARTAMENTO";
  incendio?: number;
  vendaval?: number;
  danos_eletricos?: number;
  impacto_veiculos?: number;
  perda_aluguel?: number;
  responsabilidade_civil?: number;
  plano_escolhido:
    | "PLANO PADRÃO GRATUITO"
    | "PLANO INTERMEDIÁRIO"
    | "PLANO DE REDE REFERENCIADA";
  valor_seguro: number;
  forma_pagamento:
    | "1X FATURA MENSAL - SEM ENTRADA"
    | "2X FATURA MENSAL - SEM ENTRADA"
    | "3X FATURA MENSAL - SEM ENTRADA"
    | "4X FATURA MENSAL - SEM ENTRADA"
    | "5X FATURA MENSAL - SEM ENTRADA"
    | "6X FATURA MENSAL - SEM ENTRADA"
    | "7X FATURA MENSAL - SEM ENTRADA"
    | "8X FATURA MENSAL - SEM ENTRADA"
    | "9X FATURA MENSAL - SEM ENTRADA"
    | "10X FATURA MENSAL - SEM ENTRADA"
    | "11X FATURA MENSAL - SEM ENTRADA";
  inclusao_clausula_beneficiaria: "SIM" | "NÃO";
  cnpj_ou_cpf: "CNPJ" | "CPF";
  cpf_locador_opcional?: string;
  cnpj_locador_opcional?: string;
  nome_locador?: string;
  nome_locador_cnpj?: string;
  created: Date;
};
