import { Notificacao } from "@/types/Notificacao";
import pb from "../backend/pb";
import { ClientResponseError, RecordSubscription } from "pocketbase";

export async function fetchAllNotifications(): Promise<{
  items: Notificacao[];
}> {
  try {
    const response = await pb
      .collection("notificacoes")
      .getFullList<Notificacao>({
        sort: "-created",
      });

    return {
      items: response,
    };
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao buscar a lista de Notificações:", err);
    throw new Error("Erro ao buscar a lista de Notificações");
  }
}

export async function deleteNotifications(notifications: Notificacao[]): Promise<void> {
  try {
    // Para cada notificação, deletar o registro correspondente
    for (const notification of notifications) {
      await pb.collection("notificacoes").delete(notification.id);
    }
    console.log("Notificações deletadas com sucesso.");
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao deletar as notificações:", err);
    throw new Error("Erro ao deletar as notificações");
  }
}

// Função de assinatura para ouvir eventos de tempo real na coleção "notificacoes"
export function subscribeToNotificationsUpdates(
  callback: (e: RecordSubscription<Notificacao>) => void
) {
  pb.collection("notificacoes").subscribe("*", callback);
}

// Função para cancelar a assinatura
export function unsubscribeFromNotificationsUpdates() {
  pb.collection("notificacoes").unsubscribe();
}
