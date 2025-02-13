// @/types/Imobiliarias.ts
export type Imobiliaria = {
  id: string;
  username: string;
  email: string;
  password: string;
  nome: string;
  contato: string;
  porto_boleto_fianca_essencial?: number;
  porto_boleto_fianca_tradicional?: number;
  porto_boleto_incendio_residencial?: number;
  porto_boleto_incendio_comercial?: number;
  potencial_boleto_fianca?: number;
  tokio_boleto_fianca?: number;
  tokio_relatorio_fianca?: number;
  too_boleto_fianca?: number;
  too_relatorio_fianca?: number;

  created?: Date;
};
