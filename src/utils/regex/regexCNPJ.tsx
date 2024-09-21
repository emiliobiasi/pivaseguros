export function formatCNPJ(cnpj: string): string {
  // Remove todos os caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, "");

  // Aplica a formatação CNPJ: xx.xxx.xxx/xxxx-xx
  cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
  cnpj = cnpj.replace(/(\d{4})(\d{2})$/, "$1-$2");

  return cnpj;
}
