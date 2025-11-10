export type CancelamentoSeguros = {
  id: string
  id_numero: number
  acao: "PENDENTE" | "FINALIZADO"

  nome_imobiliaria: string
  // Relation to the imobiliaria (creator). PocketBase relation field id
  imobiliaria?: string

  nome_inquilino: string
  cpf_inquilino?: string
  cnpj_inquilino?: string
  nome_proprietario: string
  cpf_proprietario?: string
  cnpj_proprietario?: string

  cep: string
  endereco: string
  bairro: string
  numero_endereco: number
  complemento?: string
  cidade: string
  estado: string

  tipo_seguro: "SEGURO FIANÇA" | "SEGURO INCÊNDIO" | "RESGATE DE TÍTULO"
  pdf_field?: string[]
  observacao?: string
  created: Date
}
