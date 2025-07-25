import { InsuranceRule } from '../types/insurance'

export const insuranceRules: InsuranceRule[] = [
  {
    company: "POTENCIAL",
    rules: [
      {
        type: "PDF",
        documentType: "Boleto Fiança"
      }
    ]
  },
  {
    company: "TOO",
    rules: [
      {
        type: "PDF",
        documentType: "Boleto Fiança"
      },
      {
        type: "PDF",
        documentType: "Relatório"
      }
    ]
  },
  {
    company: "TOKIO",
    rules: [
      {
        type: "PDF",
        documentType: "Boleto Fiança"
      },
      {
        type: "Excel",
        documentType: "Relatório"
      }
    ]
  },
  {
    company: "PORTO",
    rules: [
      {
        type: "PDF",
        documentType: "Fiança Tradicional"
      },
      {
        type: "PDF",
        documentType: "Fiança Essencial"
      },
      {
        type: "PDF",
        documentType: "Incêndio Residencial"
      },
      {
        type: "PDF",
        documentType: "Incêndio Comercial"
      }
    ]
  }
]

