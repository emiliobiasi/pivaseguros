import pb, { PocketBaseError } from "@/utils/backend/pb";
import { SeguroFiancaEmpresarialMenos2Anos } from "@/types/SeguroFiancaEmpresarialMenos2Anos";
import { ClientResponseError, RecordSubscription } from "pocketbase";

// Função para criar um Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos) com campo "id_numero" incremental
export async function createSeguroFiancaEmpresarialMenos2Anos(
  data: SeguroFiancaEmpresarialMenos2Anos
): Promise<SeguroFiancaEmpresarialMenos2Anos> {
  try {
    // Inicializa lastRecord como nulo
    let lastRecord: SeguroFiancaEmpresarialMenos2Anos | null = null;

    try {
      // Tenta obter o último registro com base em "id_numero"
      lastRecord = await pb
        .collection("seguro_fianca_empresarial_menos_2_anos")
        .getFirstListItem<SeguroFiancaEmpresarialMenos2Anos>("", {
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
      .collection("seguro_fianca_empresarial_menos_2_anos")
      .create<SeguroFiancaEmpresarialMenos2Anos>({
        ...data,
        id_numero: nextIdNumero,
      });

    console.log(
      "Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos) criado com sucesso:",
      record
    );
    return record;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      "Erro ao criar o Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos):",
      err
    );
    throw new Error(
      "Erro ao criar o Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos)"
    );
  }
}

// Função para buscar a lista de seguros de incêndio com paginação e busca
export async function fetchSeguroFiancaEmpresarialMenos2AnosList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: "PENDENTE" | "FINALIZADO" | "" = ""
): Promise<{
  items: SeguroFiancaEmpresarialMenos2Anos[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    const actionFilter = filter ? `acao = "${filter}"` : "";
    const searchFilter = searchTerm
      ? `(nome_pretendente ~ "${searchTerm}" || nome_franqueadora ~ "${searchTerm}" || id_numero ~ "${searchTerm}")`
      : "";

    // Concatena os filtros de busca e ação, se houver
    const combinedFilter = [actionFilter, searchFilter]
      .filter(Boolean)
      .join(" && ");

    const response = await pb
      .collection("seguro_fianca_empresarial_menos_2_anos")
      .getList<SeguroFiancaEmpresarialMenos2Anos>(page, limit, {
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
      "Erro ao buscar a lista de Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos):",
      err
    );
    throw new Error(
      "Erro ao buscar a lista de Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos)"
    );
  }
}

// Função para atualizar o campo "acao" para "PENDENTE"
export async function updateSeguroFiancaEmpresarialMenos2AnosToPending(
  id: string
): Promise<SeguroFiancaEmpresarialMenos2Anos> {
  try {
    const updatedRecord = await pb
      .collection("seguro_fianca_empresarial_menos_2_anos")
      .update<SeguroFiancaEmpresarialMenos2Anos>(id, {
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
      `Erro ao atualizar o Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos) ${id} para PENDENTE:`,
      err
    );
    throw new Error(
      "Erro ao atualizar o Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos) para PENDENTE"
    );
  }
}

// Função para atualizar o campo "acao" para "FINALIZADO"
export async function updateSeguroFiancaEmpresarialMenos2AnosToFinalized(
  id: string
): Promise<SeguroFiancaEmpresarialMenos2Anos> {
  try {
    const updatedRecord = await pb
      .collection("seguro_fianca_empresarial_menos_2_anos")
      .update<SeguroFiancaEmpresarialMenos2Anos>(id, {
        acao: "FINALIZADO",
      });
    console.log(
      `Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos) ${id} atualizado para FINALIZADO:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(
      `Erro ao atualizar o Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos) ${id} para FINALIZADO:`,
      err
    );
    throw new Error(
      "Erro ao atualizar o Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos) para FINALIZADO"
    );
  }
}

// Função para iniciar a subscription em tempo real
export function subscribeToSeguroFiancaEmpresarialMenos2AnosUpdates(
  onRecordChange: (
    data: RecordSubscription<SeguroFiancaEmpresarialMenos2Anos>
  ) => void
) {
  pb.collection("seguro_fianca_empresarial_menos_2_anos").subscribe(
    "*",
    onRecordChange
  );
}

// Função para cancelar a subscription
export function unsubscribeFromSeguroFiancaEmpresarialMenos2AnosUpdates() {
  pb.collection("seguro_fianca_empresarial_menos_2_anos").unsubscribe("*");
  console.log("Subscrição cancelada.");
}
