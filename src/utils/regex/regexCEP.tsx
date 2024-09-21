export function formatCEP(cep: string): string {
  // Remove todos os caracteres não numéricos
  cep = cep.replace(/\D/g, "");

  // Limita o CEP a 8 dígitos
  cep = cep.slice(0, 8);

  // Aplica a formatação CEP: xxxxx-xxx
  cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");

  return cep;
}
