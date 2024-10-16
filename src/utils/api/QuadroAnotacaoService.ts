import { QuadroAnotacao } from "@/types/QuadroAnotacao";
import pb from "../backend/pb";
import { ClientResponseError, RecordSubscription } from "pocketbase";

// Função para buscar o Quadro de Anotação
export async function fetchQuadroAnotacao(): Promise<QuadroAnotacao> {
  const id = "exdcxe57lff9p9o";

  try {
    const record = await pb
      .collection("quadro_anotacao")
      .getOne<QuadroAnotacao>(id);
    return record;
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao buscar o Quadro de Anotação:", err);
    throw new Error("Erro ao buscar o Quadro de Anotação");
  }
}

// Função para atualizar o Quadro de Anotação
export async function updateQuadroAnotacao(
  data: Partial<QuadroAnotacao>
): Promise<QuadroAnotacao> {
  const id = "exdcxe57lff9p9o";

  try {
    const updatedRecord = await pb
      .collection("quadro_anotacao")
      .update<QuadroAnotacao>(id, data);
    return updatedRecord;
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao atualizar o Quadro de Anotação:", err);
    throw new Error("Erro ao atualizar o Quadro de Anotação");
  }
}

// Função de assinatura para ouvir eventos de tempo real na coleção "quadro_anotacao"
export function subscribeToQuadroAnotacaoUpdates(
  callback: (e: RecordSubscription<QuadroAnotacao>) => void
) {
  pb.collection("quadro_anotacao").subscribe("*", callback);
}

// Função para cancelar a assinatura
export function unsubscribeFromQuadroAnotacaoUpdates() {
  pb.collection("quadro_anotacao").unsubscribe();
}
