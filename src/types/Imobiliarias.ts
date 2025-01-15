export type Imobiliaria = {
  id: string;
  username: string;
  email: string;
  password: string;
  nome: string;
  contato: string;
  qtd_boleto_porto?: number;
  qtd_boleto_potencial?: number;
  qtd_boleto_tokio?: number;
  qtd_boleto_too?: number;
  created?: Date;
};
