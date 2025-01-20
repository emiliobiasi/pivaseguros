// src/constants/insuranceCompanies.ts

import { Imobiliaria } from "@/types/Imobiliarias";

/**
 * Define o nome da seguradora e
 * a chave que será utilizada para extrair o valor do objeto Imobiliaria.
 */
export const insuranceCompanies = [
  {
    label: "PORTO",
    field: "qtd_boleto_porto" as keyof Imobiliaria,
  },
  {
    label: "POTENCIAL",
    field: "qtd_boleto_potencial" as keyof Imobiliaria,
  },
  {
    label: "TOKIO",
    field: "qtd_boleto_tokio" as keyof Imobiliaria,
  },
  {
    label: "TOO",
    field: "qtd_boleto_too" as keyof Imobiliaria,
  },
];
