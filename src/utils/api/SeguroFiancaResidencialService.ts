import pb, { PocketBaseError } from "@/utils/backend/pb";
import { SeguroFiancaResidencial } from "@/types/SeguroFiancaResidencial";
import { ClientResponseError, RecordSubscription } from "pocketbase";

// Função para criar um seguro de incêndio e monitorar as mudanças em tempo real com campo "id_numero" incremental
export async function createSeguroFiancaResidencial(
  data: SeguroFiancaResidencial
): Promise<SeguroFiancaResidencial> {
  let lastRecord: SeguroFiancaResidencial | null = null;

  try {
    // Attempt to get the last record
    lastRecord = await pb
      .collection("seguro_fianca_residencial")
      .getFirstListItem<SeguroFiancaResidencial>("", {
        sort: "-id_numero",
        limit: 1,
      });
  } catch (error) {
    const err = error as PocketBaseError;
    if (err.status === 404) {
      // No records found, set lastRecord to null
      lastRecord = null;
    } else {
      // Other errors, rethrow
      throw err;
    }
  }

  try {
    // Determine the next id_numero
    const nextIdNumero = lastRecord ? (lastRecord.id_numero || 0) + 1 : 1;

    // Create the new record with the incremented id_numero
    const record = await pb
      .collection("seguro_fianca_residencial")
      .create<SeguroFiancaResidencial>({
        ...data,
        id_numero: nextIdNumero,
      });

    console.log("Seguro Fiança Residencial criado com sucesso:", record);
    return record;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      "Erro ao criar o Seguro Fianca Residencial:",
      err.message,
      err.response
    );
    throw new Error(
      `Erro ao criar o Seguro Fianca Residencial: ${err.message}`
    );
  }
}

// Função para buscar a lista de seguros de incêndio com paginação e busca
export async function fetchSeguroFiancaResidencialList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: "PENDENTE" | "FINALIZADO" | "" = ""
): Promise<{
  items: SeguroFiancaResidencial[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    const actionFilter = filter ? `acao = "${filter}"` : "";
    const searchFilter = searchTerm
      ? `(nome_residente ~ "${searchTerm}" || nome_imobiliaria_corretor ~ "${searchTerm}" || id_numero ~ "${searchTerm}")`
      : "";

    // Concatena os filtros de busca e ação, se houver
    const combinedFilter = [actionFilter, searchFilter]
      .filter(Boolean)
      .join(" && ");

    const response = await pb
      .collection("seguro_fianca_residencial")
      .getList<SeguroFiancaResidencial>(page, limit, {
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
    console.error("Erro ao buscar a lista de Seguro Fianca Residencial:", err);
    throw new Error("Erro ao buscar a lista de Seguro Fianca Residencial");
  }
}

// Função para atualizar o campo "acao" para "PENDENTE"
export async function updateSeguroFiancaResidencialToPending(
  id: string
): Promise<SeguroFiancaResidencial> {
  try {
    const updatedRecord = await pb
      .collection("seguro_fianca_residencial")
      .update<SeguroFiancaResidencial>(id, {
        acao: "PENDENTE",
      });
    console.log(
      `Seguro Fiança Residencial ${id} atualizado para PENDENTE:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Seguro Fiança Residencial ${id} para PENDENTE:`,
      err
    );
    throw new Error(
      "Erro ao atualizar o Seguro Fiança Residencial para PENDENTE"
    );
  }
}

// Função para atualizar o campo "acao" para "FINALIZADO"
export async function updateSeguroFiancaResidencialToFinalized(
  id: string
): Promise<SeguroFiancaResidencial> {
  try {
    const updatedRecord = await pb
      .collection("seguro_fianca_residencial")
      .update<SeguroFiancaResidencial>(id, {
        acao: "FINALIZADO",
      });
    console.log(
      `Seguro Fiança Residencial ${id} atualizado para FINALIZADO:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Seguro Fiança Residencial ${id} para FINALIZADO:`,
      err
    );
    throw new Error(
      "Erro ao atualizar o Seguro Fiança Residencial para FINALIZADO"
    );
  }
}

// Função para atualizar o campo "status" para "APROVADO" ou "REPROVADO"
export async function updateSeguroFiancaResidencialStatus(
  id: string,
  status: "APROVADO" | "REPROVADO"
): Promise<SeguroFiancaResidencial> {
  try {
    const updatedRecord = await pb
      .collection("seguro_fianca_residencial")
      .update<SeguroFiancaResidencial>(id, {
        status: status,
      });
    console.log(
      `Seguro Fiança Residencial ${id} atualizado para ${status}:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Seguro Fiança Residencial ${id} para ${status}:`,
      err
    );
    throw new Error(
      `Erro ao atualizar o Seguro Fiança Residencial para ${status}`
    );
  }
}

// Função para iniciar a subscription em tempo real
export function subscribeToSeguroFiancaResidencialUpdates(
  onRecordChange: (data: RecordSubscription<SeguroFiancaResidencial>) => void
) {
  pb.collection("seguro_fianca_residencial").subscribe("*", onRecordChange);
}

// Função para cancelar a subscription
export function unsubscribeFromSeguroFiancaResidencialUpdates() {
  pb.collection("seguro_fianca_residencial").unsubscribe("*");
  console.log("Subscrição cancelada.");
}
