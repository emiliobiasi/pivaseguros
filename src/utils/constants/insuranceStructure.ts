// src/utils/constants/insuranceStructure.ts
export const insuranceStructure = [
  {
    name: "PORTO",
    colorKey: "PORTO",
    // Subcampos
    subcategories: [
      {
        label: "Fiança Essencial",
        field: "porto_boleto_fianca_essencial",
      },
      {
        label: "Fiança Tradicional",
        field: "porto_boleto_fianca_tradicional",
      },
      {
        label: "Incêndio Residencial",
        field: "porto_boleto_incendio_residencial",
      },
      {
        label: "Incêndio Comercial",
        field: "porto_boleto_incendio_comercial",
      },
    ],
  },
  {
    name: "POTENCIAL",
    colorKey: "POTENCIAL",
    subcategories: [
      {
        label: "Fiança",
        field: "potencial_boleto_fianca",
      },
      {
        label: "Relatório Fiança",
        field: "potencial_relatorio_fianca",
      },
    ],
  },
  {
    name: "TOKIO",
    colorKey: "TOKIO",
    subcategories: [
      {
        label: "Fiança",
        field: "tokio_boleto_fianca",
      },
      {
        label: "Relatório Fiança",
        field: "tokio_relatorio_fianca",
      },
    ],
  },
  {
    name: "TOO",
    colorKey: "TOO",
    subcategories: [
      {
        label: "Fiança",
        field: "too_boleto_fianca",
      },
      {
        label: "Relatório Fiança",
        field: "too_relatorio_fianca",
      },
    ],
  },
]
