import { AberturaSinistro } from "@/types/AberturaSinistro"
import pb, { PocketBaseError } from "@/utils/backend/pb-imob"
import { ClientResponseError, RecordSubscription } from "pocketbase"

// Função para criar um Abertura de Sinistro com campo "id_numero" incremental
export async function createAberturaSinistro(
  data: AberturaSinistro,
  files: File[] = []
): Promise<AberturaSinistro> {
  try {
    // Captura informações da imobiliária autenticada, se houver
    const authModel: any = pb.authStore.model
    const isImobiliaria = authModel?.collectionName === "imobiliarias"
    const imobiliariaId: string | undefined = isImobiliaria
      ? authModel.id
      : undefined
    // Inicializa lastRecord como nulo
    let lastRecord: AberturaSinistro | null = null

    try {
      // Tenta obter o último registro com base em "id_numero"
      lastRecord = await pb
        .collection("abertura_sinistro")
        .getFirstListItem<AberturaSinistro>("", {
          sort: "-id_numero",
        })
    } catch (error) {
      const err = error as ClientResponseError
      if (err.status === 404) {
        // Nenhum registro encontrado, continua com lastRecord como nulo
        // console.log("Nenhum registro encontrado. Iniciando id_numero em 1.");
      } else {
        // Re-lança outros erros
        throw err
      }
    }

    // Determina o próximo valor para "id_numero"
    const nextIdNumero = lastRecord ? (lastRecord.id_numero || 0) + 1 : 1

    // Monta FormData para permitir upload de arquivos PDF
    const formData = new FormData()

    // Campos básicos (converter números/datas para string quando necessário)
    formData.append("acao", data.acao)
    // Mantém o nome informado no formulário (sem autofill do auth)
    formData.append("nome_imobiliaria", data.nome_imobiliaria)
    // Relaciona o registro à imobiliária criadora, se disponível no schema
    if (imobiliariaId) {
      formData.append("imobiliaria", imobiliariaId)
    }

    formData.append("nome_inquilino", data.nome_inquilino)
    if (data.cpf_inquilino) formData.append("cpf_inquilino", data.cpf_inquilino)

    formData.append("nome_proprietario", data.nome_proprietario)
    if (data.cpf_proprietario)
      formData.append("cpf_proprietario", data.cpf_proprietario)

    formData.append("cep", data.cep)
    formData.append("endereco", data.endereco)
    formData.append("bairro", data.bairro)
    formData.append("numero_endereco", String(data.numero_endereco))
    if (data.complemento) formData.append("complemento", data.complemento)
    formData.append("cidade", data.cidade)
    formData.append("estado", data.estado)

    formData.append("tipo_seguro", data.tipo_seguro)

    // Define o id_numero incremental
    formData.append("id_numero", String(nextIdNumero))

    // Anexa arquivos PDF (campo múltiplo no PocketBase)
    if (files && files.length > 0) {
      files.forEach((file) => {
        // Nome do campo conforme schema do PocketBase (pdf_field)
        formData.append("pdf_field", file)
        // Opcional: manter compatibilidade se existir pdf_file no futuro
        // formData.append("pdf_file", file)
      })
    }

    // Cria o novo registro com FormData (multipart)
    const record = await pb
      .collection("abertura_sinistro")
      .create<AberturaSinistro>(formData)

    // console.log("Abertura de Sinistro criado com sucesso:", record);
    return record
  } catch (error) {
    const err = error as PocketBaseError
    console.error("Erro ao criar a Abertura de Sinistro:", err)
    throw new Error("Erro ao criar a Abertura de Sinistro")
  }
}

// Função para buscar a lista de seguros de incêndio com paginação e busca
export async function fetchAberturaSinistroList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: "PENDENTE" | "FINALIZADO" | "" = ""
): Promise<{
  items: AberturaSinistro[]
  totalItems: number
  totalPages: number
}> {
  try {
    const actionFilter = filter ? `acao = "${filter}"` : ""
    const searchFilter = searchTerm
      ? `(
          nome_inquilino ~ "${searchTerm}" ||
          nome_imobiliaria ~ "${searchTerm}" ||
          id_numero ~ "${searchTerm}"
        )`
      : ""

    // Concatena os filtros de busca e ação, se houver
    const combinedFilter = [actionFilter, searchFilter]
      .filter(Boolean)
      .join(" && ")

    const response = await pb
      .collection("abertura_sinistro")
      .getList<AberturaSinistro>(page, limit, {
        sort: "-created",
        filter: combinedFilter, // Aplica o filtro combinado de ação e termo de busca
      })

    return {
      items: response.items,
      totalItems: response.totalItems,
      totalPages: response.totalPages,
    }
  } catch (error) {
    const err = error as ClientResponseError
    console.error("Erro ao buscar a lista de Abertura de Sinistro:", err)
    throw new Error("Erro ao buscar a lista de Abertura de Sinistro")
  }
}

// Função para atualizar o campo "acao" para "PENDENTE"
export async function updateAberturaSinistroToPending(
  id: string
): Promise<AberturaSinistro> {
  try {
    const updatedRecord = await pb
      .collection("abertura_sinistro")
      .update<AberturaSinistro>(id, {
        acao: "PENDENTE",
      })

    return updatedRecord
  } catch (error) {
    const err = error as PocketBaseError
    console.error(
      `Erro ao atualizar a Abertura de Sinistro ${id} para PENDENTE:`,
      err
    )
    throw new Error("Erro ao atualizar a Abertura de Sinistro para PENDENTE")
  }
}

// Função para atualizar o campo "acao" para "FINALIZADO"
export async function updateAberturaSinistroToFinalized(
  id: string
): Promise<AberturaSinistro> {
  try {
    const updatedRecord = await pb
      .collection("abertura_sinistro")
      .update<AberturaSinistro>(id, {
        acao: "FINALIZADO",
      })

    return updatedRecord
  } catch (error) {
    const err = error as PocketBaseError
    console.error(
      `Erro ao atualizar a Abertura de Sinistro ${id} para FINALIZADO:`,
      err
    )
    throw new Error(
      "Erro ao atualizar a Abertura de Sinistro para FINALIZADO"
    )
  }
}

// Função para iniciar a subscription em tempo real
export function subscribeToAberturaSinistroUpdates(
  onRecordChange: (data: RecordSubscription<AberturaSinistro>) => void
) {
  pb.collection("abertura_sinistro").subscribe("*", onRecordChange)
}

// Função para cancelar a subscription
export function unsubscribeFromAberturaSinistroUpdates() {
  pb.collection("abertura_sinistro").unsubscribe("*")
}
