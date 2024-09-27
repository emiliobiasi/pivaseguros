import pb, { PocketBaseError } from "@/utils/backend/pb";
import { SeguroIncendio } from "@/types/SeguroIncendio";
import { ClientResponseError } from "pocketbase";

// Função para criar um seguro de incêndio e monitorar as mudanças em tempo real com campo "id_numero" incremental
export async function createSeguroIncendio(
  data: SeguroIncendio
): Promise<SeguroIncendio> {
  try {
    // Buscar o seguro existente com o maior valor de "id_numero"
    const lastRecord = await pb
      .collection("seguro_incendio")
      .getFirstListItem<SeguroIncendio>("", {
        sort: "-id_numero", // Ordena em ordem decrescente pelo campo "id_numero"
        limit: 1,
      });

    // Determinar o próximo valor para "id_numero"
    const nextIdNumero = lastRecord ? (lastRecord.id_numero || 0) + 1 : 1;

    // Cria o novo seguro com o campo "id_numero" incrementado
    const record = await pb
      .collection("seguro_incendio")
      .create<SeguroIncendio>({
        ...data,
        id_numero: nextIdNumero, // Adiciona o campo "id_numero" ao novo registro
      });

    console.log("Seguro Incêndio criado com sucesso:", record);
    return record;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error("Erro ao criar o Seguro Incêndio:", err);
    throw new Error("Erro ao criar o Seguro Incêndio");
  }
}

// Função para buscar a lista de seguros de incêndio com paginação e busca
export async function fetchSeguroIncendioList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: "PENDENTE" | "FINALIZADO" | "" = ""
): Promise<{
  items: SeguroIncendio[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    const actionFilter = filter ? `acao = "${filter}"` : "";
    const searchFilter = searchTerm
      ? `(nome_locatario ~ "${searchTerm}" || nome_imobiliaria ~ "${searchTerm}" || id_numero ~ "${searchTerm}")`
      : "";

    // Concatena os filtros de busca e ação, se houver
    const combinedFilter = [actionFilter, searchFilter]
      .filter(Boolean)
      .join(" && ");

    const response = await pb
      .collection("seguro_incendio")
      .getList<SeguroIncendio>(page, limit, {
        sort: "-created",
        filter: combinedFilter, // Aplica o filtro combinado de ação e termo de busca
      });

    return {
      items: response.items,
      totalItems: response.totalItems,
      totalPages: response.totalPages,
    };
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao buscar a lista de Seguros Incêndio:", err);
    throw new Error("Erro ao buscar a lista de Seguros Incêndio");
  }
}

// Função para atualizar o campo "acao" para "PENDENTE"
export async function updateSeguroIncendioToPending(
  id: string
): Promise<SeguroIncendio> {
  try {
    const updatedRecord = await pb
      .collection("seguro_incendio")
      .update<SeguroIncendio>(id, {
        acao: "PENDENTE",
      });
    console.log(
      `Seguro Incêndio ${id} atualizado para PENDENTE:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Seguro Incêndio ${id} para PENDENTE:`,
      err
    );
    throw new Error("Erro ao atualizar o Seguro Incêndio para PENDENTE");
  }
}

// Função para atualizar o campo "acao" para "FINALIZADO"
export async function updateSeguroIncendioToFinalized(
  id: string
): Promise<SeguroIncendio> {
  try {
    const updatedRecord = await pb
      .collection("seguro_incendio")
      .update<SeguroIncendio>(id, {
        acao: "FINALIZADO",
      });
    console.log(
      `Seguro Incêndio ${id} atualizado para FINALIZADO:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Seguro Incêndio ${id} para FINALIZADO:`,
      err
    );
    throw new Error("Erro ao atualizar o Seguro Incêndio para FINALIZADO");
  }
}

// Função para cancelar as assinaturas em caso de necessidade
export function unsubscribeSeguroIncendio() {
  pb.collection("seguro_incendio").unsubscribe("*");
  console.log("Subscrição cancelada.");
}
