export function formatCPF(cpf: string): string {
  // Remove todos os caracteres não numéricos
  cpf = cpf.replace(/\D/g, "");

  // Limita o CPF a 11 dígitos
  cpf = cpf.slice(0, 11);

  // Aplica a formatação CPF: xxx.xxx.xxx-xx
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return cpf;
}
