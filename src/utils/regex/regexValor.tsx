export function formatValor(valor: string): string {
  valor = valor.replace(/\D/g, "");

  valor = valor.padStart(3, "0");

  let inteiro = valor.slice(0, -2);
  let decimal = valor.slice(-2);

  if (decimal.length < 2) {
    decimal = decimal.padStart(2, "0");
  }

  inteiro = parseInt(inteiro, 10).toString();

  inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${inteiro},${decimal}`;
}
