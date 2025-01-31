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
  data: Omit<Imobiliaria, "id" | "created" | "password"> // Exclui campos que serão gerados automaticamente
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
      .filter(([_, value]) => value !== undefined && value !== "")
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
  data: Partial<Omit<Imobiliaria, "id" | "created" | "password">>
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

/**
 * Função para assinar atualizações em tempo real na coleção "imobiliarias".
 * @param onRecordChange Callback a ser executado quando houver uma mudança.
 * @returns Função para desinscrever a assinatura.
 */
export async function subscribeToImobiliariaUpdates(
  onRecordChange: (data: RecordSubscription<Imobiliaria>) => void
): Promise<() => void> {
  try {
    const unsubscribe = await pb
      .collection("imobiliarias")
      .subscribe("*", onRecordChange);
    console.log("Subscrição para atualizações de Imobiliárias iniciada.");
    return unsubscribe;
  } catch (error) {
    console.error("Erro ao assinar atualizações de Imobiliárias:", error);
    throw new Error("Erro ao assinar atualizações de Imobiliárias");
  }
}

/**
 * Função para atualizar o email de uma Imobiliária.
 * @param id ID da imobiliária a ser atualizada.
 * @param newEmail Novo email da imobiliária.
 * @returns A imobiliária atualizada.
 */
// src/services/imobiliariaService.ts - Função atualizada

export async function updateImobiliariaEmail(
  newEmail: string,
  password: string
): Promise<void> {
  try {
    if (!pb.authStore.model) {
      throw new Error("Usuário não autenticado.");
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new Error("Formato de email inválido.");
    }

    // Autenticar com a senha atual
    await pb
      .collection("imobiliarias")
      .authWithPassword(pb.authStore.model.email, password);

    // Solicitar mudança de email
    await pb.collection("imobiliarias").requestEmailChange(newEmail);
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao atualizar email:", err);
    throw new Error(err.message || "Falha ao solicitar alteração de email");
  }
}

/**
 * Função para atualizar o nome de uma Imobiliária.
 * @param id ID da imobiliária a ser atualizada.
 * @param newName Novo nome da imobiliária.
 * @returns A imobiliária atualizada.
 */
export async function updateImobiliariaName(
  id: string,
  newName: string
): Promise<Imobiliaria> {
  try {
    // Validação básica do nome
    if (newName.trim().length === 0) {
      throw new Error("O nome não pode estar vazio.");
    }

    // Atualiza o campo nome na coleção "imobiliarias"
    const updatedRecord = await pb
      .collection("imobiliarias")
      .update<Imobiliaria>(id, { nome: newName });

    console.log(
      `Nome da Imobiliária ${id} atualizado com sucesso:`,
      updatedRecord
    );
    return updatedRecord;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error(`Erro ao atualizar o nome da Imobiliária ${id}:`, err);
    throw new Error("Erro ao atualizar o nome da Imobiliária.");
  }
}

/**
 * Função para trocar a senha de uma Imobiliária.
 * @param id ID da imobiliária a ser atualizada.
 * @param newPassword Nova senha da imobiliária.
 * @returns A imobiliária atualizada.
 */
export async function changeImobiliariaPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> {
  try {
    // Validações básicas
    if (newPassword !== confirmPassword) {
      throw new Error("As novas senhas não coincidem.");
    }

    if (!pb.authStore.model) {
      throw new Error("Usuário não autenticado.");
    }

    // Autenticar com a senha atual
    await pb
      .collection("imobiliarias")
      .authWithPassword(pb.authStore.model.email, currentPassword);

    // Atualizar a senha
    await pb.collection("imobiliarias").update(pb.authStore.model.id, {
      password: newPassword,
      passwordConfirm: newPassword,
    });

    // Reautenticar com a nova senha
    await pb
      .collection("imobiliarias")
      .authWithPassword(pb.authStore.model.email, newPassword);
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao alterar senha:", err);
    throw new Error(err.message || "Falha ao alterar a senha");
  }
}
