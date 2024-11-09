export function formatarData(dataInput: Date | string): string {
  let ano: string, mes: string, dia: string;

  if (typeof dataInput === "string") {
    // Remove qualquer parte de tempo na string e pega apenas a data no formato "YYYY-MM-DD"
    const dataPart = dataInput.split(" ")[0]; // Separa apenas a data antes do espaço, ignorando o horário
    [ano, mes, dia] = dataPart.split("-");
  } else {
    // Se for um objeto Date, extraímos ano, mês e dia manualmente
    ano = dataInput.getFullYear().toString();
    mes = (dataInput.getMonth() + 1).toString().padStart(2, "0"); // Mês é zero-indexado
    dia = dataInput.getDate().toString().padStart(2, "0");
  }

  // Retorna a data no formato `dd/MM/yyyy`
  return `${dia}/${mes}/${ano}`;
}
