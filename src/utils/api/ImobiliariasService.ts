// src/services/imobiliariaService.ts

import pb, { PocketBaseError } from "@/utils/backend/pb";
import { Imobiliaria } from "@/types/Imobiliarias";
import { ClientResponseError, RecordSubscription } from "pocketbase";

/**
 * Função para criar uma nova Imobiliária.
 * @param data Dados da imobiliária a ser criada.
 * @returns A imobiliária criada.
 */
export async function createImobiliaria(
  data: Omit<Imobiliaria, "id" | "created"> // Exclui campos que serão gerados automaticamente
): Promise<Imobiliaria> {
  try {
    // Cria o novo registro na coleção "imobiliarias"
    const record = await pb.collection("imobiliarias").create<Imobiliaria>({
      ...data,
      created: new Date(), // Define a data de criação
    });

    console.log("Imobiliária criada com sucesso:", record);
    return record;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error("Erro ao criar a Imobiliária:", err);
    throw new Error("Erro ao criar a Imobiliária");
  }
}

/**
 * Função para buscar uma lista de Imobiliárias com paginação e filtros.
 * @param page Número da página atual.
 * @param limit Número de itens por página.
 * @param searchTerm Termo de busca para filtrar por nome, email ou username.
 * @param filter Filtros adicionais (opcional).
 * @returns Objeto contendo os itens, total de itens e total de páginas.
 */
export async function fetchImobiliariaList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: Partial<Imobiliaria> = {}
): Promise<{
  items: Imobiliaria[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    // Construir filtros de busca
    const searchFilter = searchTerm
      ? `(nome ~ "${searchTerm}" || email ~ "${searchTerm}" || username ~ "${searchTerm}")`
      : "";

    // Construir filtros adicionais
    const additionalFilters = Object.entries(filter)
      .map(([key, value]) => `${key} = "${value}"`)
      .join(" && ");

    // Combinar filtros
    const combinedFilter = [searchFilter, additionalFilters]
      .filter(Boolean)
      .join(" && ");

    // Buscar a lista na coleção "imobiliarias"
    const response = await pb
      .collection("imobiliarias")
      .getList<Imobiliaria>(page, limit, {
        sort: "-created", // Ordena por data de criação decrescente
        filter: combinedFilter,
      });

    return {
      items: response.items,
      totalItems: response.totalItems,
      totalPages: response.totalPages,
    };
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao buscar a lista de Imobiliárias:", err);
    throw new Error("Erro ao buscar a lista de Imobiliárias");
  }
}

/**
 * Função para atualizar uma Imobiliária existente.
 * @param id ID da imobiliária a ser atualizada.
 * @param data Dados atualizados da imobiliária.
 * @returns A imobiliária atualizada.
 */
export async function updateImobiliaria(
  id: string,
  data: Partial<Omit<Imobiliaria, "id" | "created">>
): Promise<Imobiliaria> {
  try {
    // Atualiza o registro na coleção "imobiliarias"
    const updatedRecord = await pb
      .collection("imobiliarias")
      .update<Imobiliaria>(id, data);

    console.log(`Imobiliária ${id} atualizada com sucesso:`, updatedRecord);
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(`Erro ao atualizar a Imobiliária ${id}:`, err);
    throw new Error("Erro ao atualizar a Imobiliária");
  }
}

/**
 * Função para excluir uma Imobiliária.
 * @param id ID da imobiliária a ser excluída.
 */
export async function deleteImobiliaria(id: string): Promise<void> {
  try {
    await pb.collection("imobiliarias").delete(id);
    console.log(`Imobiliária ${id} excluída com sucesso.`);
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(`Erro ao excluir a Imobiliária ${id}:`, err);
    throw new Error("Erro ao excluir a Imobiliária");
  }
}

/**
 * Função para buscar Imobiliárias criadas no último mês.
 * @returns Lista de imobiliárias criadas no último mês.
 */
export async function fetchImobiliariaLastMonth(): Promise<Imobiliaria[]> {
  try {
    // Calcula a data do último mês
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    // Formata a data para ser usada no filtro
    const lastMonthFilter = `created >= "${lastMonthDate.toISOString()}"`;

    // Busca os registros na coleção "imobiliarias"
    const response = await pb
      .collection("imobiliarias")
      .getFullList<Imobiliaria>({
        sort: "-created",
        filter: lastMonthFilter,
      });

    return response;
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao buscar Imobiliárias do último mês:", err);
    throw new Error("Erro ao buscar Imobiliárias do último mês");
  }
}

// /**
//  * Função para assinar atualizações em tempo real na coleção "imobiliarias".
//  * @param onRecordChange Callback a ser executado quando houver uma mudança.
//  * @returns Subscription ID para cancelar posteriormente.
//  */
// export function subscribeToImobiliariaUpdates(
//   onRecordChange: (data: RecordSubscription<Imobiliaria>) => void
// ): string {
//   const subscription = pb
//     .collection("imobiliarias")
//     .subscribe("*", onRecordChange);
//   console.log("Subscrição para atualizações de Imobiliárias iniciada.");
//   return subscription;
// }

// /**
//  * Função para cancelar a assinatura de atualizações na coleção "imobiliarias".
//  * @param subscriptionId ID da subscrição a ser cancelada.
//  */
// export function unsubscribeFromImobiliariaUpdates(
//   subscriptionId: string
// ): void {
//   pb.collection("imobiliarias").unsubscribe(subscriptionId);
//   console.log("Subscrição de Imobiliárias cancelada.");
// }
