import pb, { PocketBaseError } from "@/utils/backend/pb";
import { EfetivacaoSeguroFianca } from "@/types/EfetivacaoSeguroFianca";
import { ClientResponseError, RecordSubscription } from "pocketbase";

export async function createEfetivacaoSeguroFianca(
  data: EfetivacaoSeguroFianca
): Promise<EfetivacaoSeguroFianca> {
  try {
    // Inicializa lastRecord como nulo
    let lastRecord: EfetivacaoSeguroFianca | null = null;

    try {
      // Tenta obter o último registro com base em "id_numero"
      lastRecord = await pb
        .collection("efetivacao_seguro_fianca_tb")
        .getFirstListItem<EfetivacaoSeguroFianca>("", {
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
      .collection("efetivacao_seguro_fianca_tb")
      .create<EfetivacaoSeguroFianca>({
        ...data,
        id_numero: nextIdNumero,
      });

    console.log("Efetivação Seguro Fiança criado com sucesso:", record);
    return record;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error("Erro ao criar o Efetivação Seguro Fiança:", err);
    throw new Error("Erro ao criar o Efetivação Seguro Fiança");
  }
}

export async function fetchEfetivacaoSeguroFiancaList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: "PENDENTE" | "FINALIZADO" | "" = ""
): Promise<{
  items: EfetivacaoSeguroFianca[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    const actionFilter = filter ? `acao = "${filter}"` : "";
    const searchFilter = searchTerm
      ? `(nome_proprietario ~ "${searchTerm}" || nome_imobiliaria ~ "${searchTerm}" || id_numero ~ "${searchTerm}")`
      : "";

    const combinedFilter = [actionFilter, searchFilter]
      .filter(Boolean)
      .join(" && ");

    const response = await pb
      .collection("efetivacao_seguro_fianca_tb")
      .getList<EfetivacaoSeguroFianca>(page, limit, {
        sort: "-created",
        filter: combinedFilter,
      });

    return {
      items: response.items,
      totalItems: response.totalItems,
      totalPages: response.totalPages,
    };
  } catch (error) {
    const err = error as ClientResponseError;
    console.error(
      "Erro ao buscar a lista de Efetivação do Seguro Fiança:",
      err
    );
    throw new Error("Erro ao buscar a lista de Efetivação do Seguro Fiança");
  }
}

export async function updateEfetivacaoSeguroFiancaToPending(
  id: string
): Promise<EfetivacaoSeguroFianca> {
  try {
    const updatedRecord = await pb
      .collection("efetivacao_seguro_fianca_tb")
      .update<EfetivacaoSeguroFianca>(id, {
        acao: "PENDENTE",
      });
    console.log(
      `Efetivação do Seguro Fiança ${id} atualizado para PENDENTE:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Efetivação do Seguro Fiança ${id} para PENDENTE:`,
      err
    );
    throw new Error(
      "Erro ao atualizar o Efetivação do Seguro Fiança para PENDENTE"
    );
  }
}

export async function updateEfetivacaoSeguroFiancaToFinalized(
  id: string
): Promise<EfetivacaoSeguroFianca> {
  try {
    const updatedRecord = await pb
      .collection("efetivacao_seguro_fianca_tb")
      .update<EfetivacaoSeguroFianca>(id, {
        acao: "FINALIZADO",
      });
    console.log(
      `Efetivação do Seguro Fiança ${id} atualizado para FINALIZADO:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Efetivação do Seguro Fiança ${id} para FINALIZADO:`,
      err
    );
    throw new Error(
      "Erro ao atualizar o Efetivação do Seguro Fiança para FINALIZADO"
    );
  }
}

export function subscribeToEfetivacaoSeguroFiancaUpdates(
  onRecordChange: (data: RecordSubscription<EfetivacaoSeguroFianca>) => void
) {
  pb.collection("efetivacao_seguro_fianca_tb").subscribe("*", onRecordChange);
}

// Função para cancelar a subscription
export function unsubscribeFromEfetivacaoSeguroFiancaUpdates() {
  pb.collection("efetivacao_seguro_fianca_tb").unsubscribe("*");
  console.log("Subscrição cancelada.");
}
