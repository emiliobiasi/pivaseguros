import pb, { PocketBaseError } from "@/utils/backend/pb";
import { ClientResponseError, RecordSubscription } from "pocketbase";
import { SeguroIncendioComercial } from "@/types/SeguroIncendioComercial";

// Função para criar um seguro de incêndio comercial e monitorar as mudanças em tempo real com campo "id_numero" incremental
export async function createSeguroIncendioComercial(
  data: SeguroIncendioComercial
): Promise<SeguroIncendioComercial> {
  try {
    // Inicializa lastRecord como nulo
    let lastRecord: SeguroIncendioComercial | null = null;

    try {
      // Tenta obter o último registro com base em "id_numero"
      lastRecord = await pb
        .collection("seguro_incendio_comercial")
        .getFirstListItem<SeguroIncendioComercial>("", {
          sort: "-id_numero",
        });
    } catch (error) {
      const err = error as ClientResponseError;
      if (err.status === 404) {
        // Nenhum registro encontrado, continua com lastRecord como nulo
        console.log("Nenhum registro encontrado. Iniciando id_numero em 1.");
      } else {
        // Re-lança outros erros
        throw err;
      }
    }

    // Determina o próximo valor para "id_numero"
    const nextIdNumero = lastRecord ? (lastRecord.id_numero || 0) + 1 : 1;

    // Cria o novo registro com o campo "id_numero" incrementado
    const record = await pb
      .collection("seguro_incendio_comercial")
      .create<SeguroIncendioComercial>({
        ...data,
        id_numero: nextIdNumero,
      });

    console.log("Seguro Incêndio Comercial criado com sucesso:", record);
    return record;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error("Erro ao criar o Seguro Incêndio Comercial:", err);
    throw new Error("Erro ao criar o Seguro Incêndio Comercial");
  }
}

// Função para buscar a lista de seguros de incêndio comercial com paginação e busca
export async function fetchSeguroIncendioComercialList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: "PENDENTE" | "FINALIZADO" | "" = ""
): Promise<{
  items: SeguroIncendioComercial[];
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
      .collection("seguro_incendio_comercial")
      .getList<SeguroIncendioComercial>(page, limit, {
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
    console.error("Erro ao buscar a lista de Seguros Incêndio Comercial:", err);
    throw new Error("Erro ao buscar a lista de Seguros Incêndio Comercial");
  }
}

// Função para atualizar o campo "acao" para "PENDENTE"
export async function updateSeguroIncendioComercialToPending(
  id: string
): Promise<SeguroIncendioComercial> {
  try {
    const updatedRecord = await pb
      .collection("seguro_incendio_comercial")
      .update<SeguroIncendioComercial>(id, {
        acao: "PENDENTE",
      });
    console.log(
      `Seguro Incêndio Comercial ${id} atualizado para PENDENTE:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Seguro Incêndio Comercial ${id} para PENDENTE:`,
      err
    );
    throw new Error(
      "Erro ao atualizar o Seguro Incêndio Comercial para PENDENTE"
    );
  }
}

// Função para atualizar o campo "acao" para "FINALIZADO"
export async function updateSeguroIncendioComercialToFinalized(
  id: string
): Promise<SeguroIncendioComercial> {
  try {
    const updatedRecord = await pb
      .collection("seguro_incendio_comercial")
      .update<SeguroIncendioComercial>(id, {
        acao: "FINALIZADO",
      });
    console.log(
      `Seguro Incêndio Comercial ${id} atualizado para FINALIZADO:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Seguro Incêndio Comercial ${id} para FINALIZADO:`,
      err
    );
    throw new Error(
      "Erro ao atualizar o Seguro Incêndio Comercial para FINALIZADO"
    );
  }
}

// Função para buscar seguros de incêndio comercial criados no último mês
export async function fetchSeguroIncendioComercialLastMonth(): Promise<
  SeguroIncendioComercial[]
> {
  try {
    // Calcula a data do último mês
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    // Formata a data para ser usada no filtro
    const lastMonthFilter = `created >= "${lastMonthDate.toISOString()}"`;

    // Faz a busca dos registros criados no último mês
    const response = await pb
      .collection("seguro_incendio_comercial")
      .getFullList<SeguroIncendioComercial>({
        sort: "-created",
        filter: lastMonthFilter, // Aplica o filtro para buscar registros do último mês
      });

    return response;
  } catch (error) {
    const err = error as ClientResponseError;
    console.error(
      "Erro ao buscar Seguros Incêndio Comercial do último mês:",
      err
    );
    throw new Error("Erro ao buscar Seguros Incêndio Comercial do último mês");
  }
}

// Função para iniciar a subscription em tempo real
export function subscribeToSeguroIncendioComercialUpdates(
  onRecordChange: (data: RecordSubscription<SeguroIncendioComercial>) => void
) {
  pb.collection("seguro_incendio_comercial").subscribe("*", onRecordChange);
}

// Função para cancelar a subscription
export function unsubscribeFromSeguroIncendioComercialUpdates() {
  pb.collection("seguro_incendio_comercial").unsubscribe("*");
  console.log("Subscrição cancelada.");
}
