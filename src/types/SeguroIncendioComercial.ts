export type SeguroIncendioComercial = {
  id: string;
  id_numero: number;
  acao: "PENDENTE" | "FINALIZADO";
  nome_imobiliaria: string;
  email_imobiliaria: string;
  nome_locatario: string;
  cpf_locatario: string;
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
  tipo_imovel: "CASA" | "APARTAMENTO";
  incendio?: number;
  vendaval?: number;
  danos_eletricos?: number;
  impacto_veiculos?: number;
  perda_aluguel?: number;
  responsabilidade_civil?: number;
  atividade: string;
  plano_escolhido:
    | "PLANO PADRÃO GRATUITO"
    | "PLANO INTERMEDIÁRIO (CUSTO DE R$30)"
    | "PLANO DE REDE REFERENCIADA (CUSTO DE R$125)";
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
  cpf_locador_opcional?: string;
  nome_locador?: string;
  created: Date;
};
