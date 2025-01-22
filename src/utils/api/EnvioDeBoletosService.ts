import { EnvioDeBoletos } from "@/types/EnviosDeBoletos";
import pb, { PocketBaseError } from "@/utils/backend/pb";
import { ClientResponseError, RecordSubscription } from "pocketbase";

/**
 * Função para criar um novo Envio de Boletos.
 * @param data Dados do envio de boletos a ser criado.
 * @param files Lista de arquivos para o envio.
 * @returns O envio de boletos criado.
 */
export async function createEnvioDeBoletos(
  data: Omit<EnvioDeBoletos, "id" | "created" | "arquivos">,
  files: File[] // Adicione os arquivos como parâmetro
): Promise<EnvioDeBoletos> {
  try {
    // Criar o FormData para enviar os dados
    const formData = new FormData();

    // Adicionar os campos regulares
    formData.append("imobiliaria", data.imobiliaria);

    // Adicionar os arquivos
    files.forEach((file) => {
      formData.append("arquivos", file); // Certifique-se de que "arquivos" é o nome do campo no PocketBase
    });

    // Enviar a requisição para o PocketBase
    const record = await pb
      .collection("envios_de_boletos")
      .create<EnvioDeBoletos>(formData);

    console.log("Envio de boletos criado com sucesso:", record);
    return record;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error("Erro ao criar o envio de boletos:", err);
    throw new Error("Erro ao criar o envio de boletos");
  }
}

/**
 * Função para buscar uma lista de Envios de Boletos com paginação e filtros.
 * @param page Número da página atual.
 * @param limit Número de itens por página.
 * @param searchTerm Termo de busca para filtrar por imobiliária.
 * @param filter Filtros adicionais (opcional).
 * @returns Objeto contendo os itens, total de itens e total de páginas.
 */
export async function fetchEnvioDeBoletosList(
  page: number,
  limit: number,
  searchTerm: string = "",
  filter: Partial<EnvioDeBoletos> = {}
): Promise<{
  items: EnvioDeBoletos[];
  totalItems: number;
  totalPages: number;
}> {
  try {
    const searchFilter = searchTerm ? `(imobiliaria ~ "${searchTerm}")` : "";

    const additionalFilters = Object.entries(filter)
      .filter(([_, value]) => value !== undefined && value !== "")
      .map(([key, value]) => `${key} = "${value}"`)
      .join(" && ");

    const combinedFilter = [searchFilter, additionalFilters]
      .filter(Boolean)
      .join(" && ");

    const response = await pb
      .collection("envios_de_boletos")
      .getList<EnvioDeBoletos>(page, limit, {
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
    console.error("Erro ao buscar a lista de envios de boletos:", err);
    throw new Error("Erro ao buscar a lista de envios de boletos");
  }
}

/**
 * Função para atualizar um Envio de Boletos existente.
 * @param id ID do envio de boletos a ser atualizado.
 * @param data Dados atualizados do envio de boletos.
 * @returns O envio de boletos atualizado.
 */
export async function updateEnvioDeBoletos(
  id: string,
  data: Partial<Omit<EnvioDeBoletos, "id" | "created">>
): Promise<EnvioDeBoletos> {
  try {
    const updatedRecord = await pb
      .collection("envios_de_boletos")
      .update<EnvioDeBoletos>(id, data);

    console.log(
      `Envio de boletos ${id} atualizado com sucesso:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(`Erro ao atualizar o envio de boletos ${id}:`, err);
    throw new Error("Erro ao atualizar o envio de boletos");
  }
}

/**
 * Função para excluir um Envio de Boletos.
 * @param id ID do envio de boletos a ser excluído.
 */
export async function deleteEnvioDeBoletos(id: string): Promise<void> {
  try {
    await pb.collection("envios_de_boletos").delete(id);
    console.log(`Envio de boletos ${id} excluído com sucesso.`);
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(`Erro ao excluir o envio de boletos ${id}:`, err);
    throw new Error("Erro ao excluir o envio de boletos");
  }
}

/**
 * Função para buscar Envios de Boletos do último mês.
 * @returns Lista de envios de boletos criados no último mês.
 */
export async function fetchEnvioDeBoletosLastMonth(): Promise<
  EnvioDeBoletos[]
> {
  try {
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    const lastMonthFilter = `created >= "${lastMonthDate.toISOString()}"`;

    const response = await pb
      .collection("envios_de_boletos")
      .getFullList<EnvioDeBoletos>({
        sort: "-created",
        filter: lastMonthFilter,
      });

    return response;
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao buscar envios de boletos do último mês:", err);
    throw new Error("Erro ao buscar envios de boletos do último mês");
  }
}

/**
 * Função para assinar atualizações em tempo real na coleção "envios_de_boletos".
 * @param onRecordChange Callback a ser executado quando houver uma mudança.
 * @returns Função para desinscrever a assinatura.
 */
export async function subscribeToEnvioDeBoletosUpdates(
  onRecordChange: (data: RecordSubscription<EnvioDeBoletos>) => void
): Promise<() => void> {
  try {
    const unsubscribe = await pb
      .collection("envios_de_boletos")
      .subscribe("*", onRecordChange);
    console.log("Subscrição para atualizações de envios de boletos iniciada.");
    return unsubscribe;
  } catch (error) {
    console.error("Erro ao assinar atualizações de envios de boletos:", error);
    throw new Error("Erro ao assinar atualizações de envios de boletos");
  }
}
