import { QuadroAnotacao } from "@/types/QuadroAnotacao";
import pb from "../backend/pb";
import { ClientResponseError } from "pocketbase";

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
