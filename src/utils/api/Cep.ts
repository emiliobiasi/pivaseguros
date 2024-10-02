export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export async function buscaEnderecoPorCEP(
  cep: string
): Promise<EnderecoViaCep> {
  const cepNumeros = cep.replace(/\D/g, "");

  if (cepNumeros.length !== 8) {
    throw new Error("CEP inválido. Deve conter 8 dígitos numéricos.");
  }

  const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);

  if (!response.ok) {
    throw new Error("Erro na requisição à API do ViaCEP.");
  }

  const data: EnderecoViaCep = await response.json();

  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }

  return data;
}
