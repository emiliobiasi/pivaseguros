export function formatValor(valor: string): string {
  // Remove todos os caracteres não numéricos
  valor = valor.replace(/\D/g, "");

  // Adiciona zeros à esquerda se necessário
  valor = valor.padStart(3, "0");

  // Separa parte inteira e decimal
  let inteiro = valor.slice(0, -2);
  let decimal = valor.slice(-2);

  // Garante que o decimal tenha dois dígitos
  if (decimal.length < 2) {
    decimal = decimal.padStart(2, "0");
  }

  // Remove os zeros à esquerda da parte inteira
  inteiro = parseInt(inteiro, 10).toString();

  // Formata a parte inteira com pontos a cada 3 dígitos
  inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Junta a parte inteira e decimal com vírgula
  return `${inteiro},${decimal}`;
}
