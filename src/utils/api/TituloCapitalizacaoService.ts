import pb, { PocketBaseError } from "@/utils/backend/pb"
import { TituloCapitalizacao } from "@/types/TituloCapitalizacao"
import { ClientResponseError, RecordSubscription } from "pocketbase"

// Função para criar um título de capitalização com campo "id_numero" incremental
export async function createTituloCapitalizacao(
  data: TituloCapitalizacao
): Promise<TituloCapitalizacao> {
  try {
    // Inicializa lastRecord como nulo
    let lastRecord: TituloCapitalizacao | null = null

    try {
      // Tenta obter o último registro com base em "id_numero"
      lastRecord = await pb
        .collection("titulo_capitalizacao")
        .getFirstListItem<TituloCapitalizacao>("", {
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

    // Cria o novo registro com o campo "id_numero" incrementado
    const record = await pb
      .collection("titulo_capitalizacao")
      .create<TituloCapitalizacao>({
        ...data,
        id_numero: nextIdNumero,
      })

    // console.log("Título de Capitalização criado com sucesso:", record);
    return record
  } catch (error) {
    const err = error as PocketBaseError
    console.error("Erro ao criar o Título de Capitalização:", err)
    throw new Error("Erro ao criar o Título de Capitalização")
  }
}

// Função para buscar a lista de seguros de incêndio com paginação e busca
export async function fetchTituloCapitalizacaoList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: "PENDENTE" | "FINALIZADO" | "" = ""
): Promise<{
  items: TituloCapitalizacao[]
  totalItems: number
  totalPages: number
}> {
  try {
    const actionFilter = filter ? `acao = "${filter}"` : ""
    const searchFilter = searchTerm
      ? `(nome ~ "${searchTerm}" || imobiliaria ~ "${searchTerm}" || id_numero ~ "${searchTerm}")`
      : ""

    // Concatena os filtros de busca e ação, se houver
    const combinedFilter = [actionFilter, searchFilter]
      .filter(Boolean)
      .join(" && ")

    const response = await pb
      .collection("titulo_capitalizacao")
      .getList<TituloCapitalizacao>(page, limit, {
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
    console.error("Erro ao buscar a lista de Titulo de Capitalização:", err)
    throw new Error("Erro ao buscar a lista de Titulo de Capitalização")
  }
}

// Função para atualizar o campo "acao" para "PENDENTE"
export async function updateTituloCapitalizacaoToPending(
  id: string
): Promise<TituloCapitalizacao> {
  try {
    const updatedRecord = await pb
      .collection("titulo_capitalizacao")
      .update<TituloCapitalizacao>(id, {
        acao: "PENDENTE",
      })
    // console.log(
    //   `Seguro Incêndio ${id} atualizado para PENDENTE:`,
    //   updatedRecord
    // )
    return updatedRecord
  } catch (error) {
    const err = error as PocketBaseError
    console.error(
      `Erro ao atualizar o Titulo de Capitalização ${id} para PENDENTE:`,
      err
    )
    throw new Error("Erro ao atualizar o Titulo de Capitalização para PENDENTE")
  }
}

// Função para atualizar o campo "acao" para "FINALIZADO"
export async function updateTituloCapitalizacaoToFinalized(
  id: string
): Promise<TituloCapitalizacao> {
  try {
    const updatedRecord = await pb
      .collection("titulo_capitalizacao")
      .update<TituloCapitalizacao>(id, {
        acao: "FINALIZADO",
      })
    // console.log(
    //   `Titulo de Capitalização ${id} atualizado para FINALIZADO:`,
    //   updatedRecord
    // )
    return updatedRecord
  } catch (error) {
    const err = error as PocketBaseError
    console.error(
      `Erro ao atualizar o Titulo de Capitalização ${id} para FINALIZADO:`,
      err
    )
    throw new Error(
      "Erro ao atualizar o Titulo de Capitalização para FINALIZADO"
    )
  }
}

// Função para iniciar a subscription em tempo real
export function subscribeToTituloCapitalizacaoUpdates(
  onRecordChange: (data: RecordSubscription<TituloCapitalizacao>) => void
) {
  pb.collection("titulo_capitalizacao").subscribe("*", onRecordChange)
}

// Função para cancelar a subscription
export function unsubscribeFromTituloCapitalizacaoUpdates() {
  pb.collection("titulo_capitalizacao").unsubscribe("*")
  // console.log("Subscrição cancelada.")
}
