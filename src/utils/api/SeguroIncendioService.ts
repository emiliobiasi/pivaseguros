import pb, { PocketBaseError } from "@/utils/backend/pb";
import { SeguroIncendio } from "@/types/SeguroIncendio";
import { ClientResponseError } from "pocketbase";

// Função para criar um seguro de incêndio e monitorar as mudanças em tempo real
export async function createSeguroIncendio(
  data: SeguroIncendio
): Promise<SeguroIncendio> {
  try {
    const record = await pb
      .collection("seguro_incendio")
      .create<SeguroIncendio>(data);
    console.log("Seguro Incêndio criado com sucesso:", record);
    return record;
  } catch (error) {
    const err = error as PocketBaseError;
    console.error("Erro ao criar o Seguro Incêndio:", err);
    throw new Error("Erro ao criar o Seguro Incêndio");
  }
}

// Função para buscar a lista de seguros de incêndio e se inscrever para atualizações em tempo real
export async function fetchSeguroIncendioList(): Promise<SeguroIncendio[]> {
  try {
    const records = await pb
      .collection("seguro_incendio")
      .getFullList<SeguroIncendio>({
        sort: "-created",
      });
    console.log("Lista de Seguros Incêndio:", records);
    pb.collection("seguro_incendio").subscribe("*", function (e) {
      console.log("Mudança detectada:", e.action);
      console.log("Dados alterados:", e.record);
    });
    return records;
  } catch (error) {
    const err = error as ClientResponseError;
    console.error("Erro ao buscar a lista de Seguros Incêndio:", err);
    throw new Error("Erro ao buscar a lista de Seguros Incêndio");
  }
}

// Função para cancelar as assinaturas em caso de necessidade
export function unsubscribeSeguroIncendio() {
  pb.collection("seguro_incendio").unsubscribe("*");
  console.log("Subscrição cancelada.");
}
