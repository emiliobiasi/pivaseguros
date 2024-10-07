import pb, { PocketBaseError } from "@/utils/backend/pb";
import { SeguroFiancaEmpresarialMais2Anos } from "@/types/SeguroFiancaEmpresarialMais2Anos";
import { ClientResponseError, RecordSubscription } from "pocketbase";

// Função para criar um seguro de incêndio e monitorar as mudanças em tempo real com campo "id_numero" incremental
export async function createSeguroFiancaEmpresarialMais2Anos(
  data: SeguroFiancaEmpresarialMais2Anos
): Promise<SeguroFiancaEmpresarialMais2Anos> {
  let lastRecord: SeguroFiancaEmpresarialMais2Anos | null = null;

  try {
    // Attempt to get the last record
    lastRecord = await pb
      .collection("seguro_fianca_empresarial_mais_2_anos")
      .getFirstListItem<SeguroFiancaEmpresarialMais2Anos>("", {
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
      .collection("seguro_fianca_empresarial_mais_2_anos")

      .create<SeguroFiancaEmpresarialMais2Anos>({
        ...data,
        id_numero: nextIdNumero,
      });

    console.log(
      "Seguro Fiança Empresarial Acima de 2 Anos criado com sucesso:",
      record
    );
    return record;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      "Erro ao criar o Seguro Fiança Empresarial Acima de 2 Anos:",
      err.message,
      err.response
    );
    throw new Error(
      `Erro ao criar o Seguro Fiança Empresarial Acima de 2 Anos: ${err.message}`
    );
  }
}

// Função para buscar a lista de seguros de incêndio com paginação e busca
export async function fetchSeguroFiancaEmpresarialMais2AnosList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: "PENDENTE" | "FINALIZADO" | "" = ""
): Promise<{
  items: SeguroFiancaEmpresarialMais2Anos[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    const actionFilter = filter ? `acao = "${filter}"` : "";
    const searchFilter = searchTerm
      ? `(nome_empresa ~ "${searchTerm}" || email_empresa ~ "${searchTerm}" || id_numero ~ "${searchTerm}")`
      : "";

    // Concatena os filtros de busca e ação, se houver
    const combinedFilter = [actionFilter, searchFilter]
      .filter(Boolean)
      .join(" && ");

    const response = await pb
      .collection("seguro_fianca_empresarial_mais_2_anos")

      .getList<SeguroFiancaEmpresarialMais2Anos>(page, limit, {
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
    console.error(
      "Erro ao buscar a lista de Seguro Fiança Empresarial Acima de 2 Anos:",
      err
    );
    throw new Error(
      "Erro ao buscar a lista de Seguro Fiança Empresarial Acima de 2 Anos"
    );
  }
}

// Função para atualizar o campo "acao" para "PENDENTE"
export async function updateSeguroFiancaEmpresarialMais2AnosToPending(
  id: string
): Promise<SeguroFiancaEmpresarialMais2Anos> {
  try {
    const updatedRecord = await pb
      .collection("seguro_fianca_empresarial_mais_2_anos")

      .update<SeguroFiancaEmpresarialMais2Anos>(id, {
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
export async function updateSeguroFiancaEmpresarialMais2AnosToFinalized(
  id: string
): Promise<SeguroFiancaEmpresarialMais2Anos> {
  try {
    const updatedRecord = await pb
      .collection("seguro_fianca_empresarial_mais_2_anos")

      .update<SeguroFiancaEmpresarialMais2Anos>(id, {
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

// Função para iniciar a subscription em tempo real
export function subscribeToSeguroFiancaEmpresarialMais2AnosUpdates(
  onRecordChange: (
    data: RecordSubscription<SeguroFiancaEmpresarialMais2Anos>
  ) => void
) {
  pb.collection("seguro_fianca_empresarial_mais_2_anos").subscribe(
    "*",
    onRecordChange
  );
}

// Função para cancelar a subscription
export function unsubscribeFromSeguroFiancaEmpresarialMais2AnosUpdates() {
  pb.collection("seguro_fianca_empresarial_mais_2_anos").unsubscribe("*");
  console.log("Subscrição cancelada.");
}
