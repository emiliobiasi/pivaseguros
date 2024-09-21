export function formatTelefone(telefone: string): string {
  // Remove todos os caracteres não numéricos
  telefone = telefone.replace(/\D/g, "");

  // Aplica a formatação de telefone:
  // (xx) xxxx-xxxx ou (xx) xxxxx-xxxx dependendo do tamanho
  if (telefone.length <= 10) {
    // Formato para telefones fixos
    telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    // Formato para celulares
    telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return telefone;
}
