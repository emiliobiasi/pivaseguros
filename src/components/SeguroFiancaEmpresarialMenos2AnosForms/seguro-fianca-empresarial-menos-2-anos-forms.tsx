import { SeguroFiancaEmpresarialMenos2Anos } from "@/types/SeguroFiancaEmpresarialMenos2Anos";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Send,
  Loader2,
} from "lucide-react";
import { formatCPF } from "@/utils/regex/regexCPF";
import { formatCNPJ } from "@/utils/regex/regexCNPJ";
import { formatCEP } from "@/utils/regex/regexCEP";
import { formatRG } from "@/utils/regex/regexRG";
import { formatTelefone } from "@/utils/regex/regexTelefone";
import { createSeguroFiancaEmpresarialMenos2Anos } from "@/utils/api/SeguroFiancaEmpresarialMenos2AnosService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import pivaLogo from "@/assets/logo.png";
import { buscaEnderecoPorCEP, EnderecoViaCep } from "@/utils/api/Cep";

export function SeguroFiancaEmpresarialMenos2AnosForms() {
  const [currentTab, setCurrentTab] = useState("dadosPretendente");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<SeguroFiancaEmpresarialMenos2Anos>({
    id: "",
    id_numero: 0,
    status: "EM ANÁLISE",
    acao: "PENDENTE",
    nome_imobiliaria: "",
    nome_pretendente: "",
    sexo_pretendente: "MASCULINO",
    cpf: "",
    rg: "",
    data_expedicao_rg: new Date(),
    data_nascimento: new Date(),
    orgao_emissor_rg: "",
    estado_civil_locatario: "SOLTEIRO",
    email: "",
    telefone_pretendente: "",
    tipo_residencia: "MENOS DE 1 ANO",
    condicao_imovel: "PRÓPRIO",
    arca_com_aluguel: "SIM",
    vinculo_empregaticio: "AUTÔNOMO",
    profissao: "",
    alocacao_pretendida_constituida: "SIM",
    franquia: "SIM",
    onus: "SIM",
    investimento_abertura: "SIM",
    motivo_locacao: "ABERTURA DE FILIAL",
    cpf_morador: "",
    vinculo_empregaticio_conjuge: undefined,
    profissao_conjuge: "",
    nome_empresa_trabalho_conjuge: "",
    data_emissao_conjuge: undefined,
    fone_conjuge: "",
    ramal_conjuge: "",
    salario_conjuge: undefined,
    outros_rendimentos_conjuge: undefined,
    total_rendimentos_mensais_conjuge: undefined,
    created: new Date(),
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (
      name === "fone_residencial" ||
      name === "fone_celular" ||
      name === "fone" ||
      name === "fone_conjuge" ||
      name === "telefone_contato" ||
      name === "telefone_pretendente"
    ) {
      formattedValue = formatTelefone(value);
    } else if (
      name === "cpf" ||
      name === "cpf_conjuge" ||
      name === "cpf_socio_1" ||
      name === "cpf_socio_2" ||
      name === "cpf_socio_3" ||
      name === "cpf_morador"
    ) {
      formattedValue = formatCPF(value);
    } else if (name === "rg" || name === "rg_conjuge") {
      formattedValue = formatRG(value);
    } else if (
      name === "cep" ||
      name === "cep_imovel_alugado" ||
      name === "cep_pessoa_fisica_nao_residencial"
    ) {
      formattedValue = formatCEP(value);

      const cepNumeros = formattedValue.replace(/\D/g, "");

      if (cepNumeros.length === 8) {
        try {
          setIsLoading(true);
          setErrorMessage("");

          const data: EnderecoViaCep = await buscaEnderecoPorCEP(cepNumeros);

          if (name === "cep") {
            setFormData((prevState) => ({
              ...prevState,
              endereco: data.logradouro || "",
              bairro: data.bairro || "",
              cidade: data.localidade || "",
              estado: data.uf || "",
              [name]: formattedValue,
            }));
          } else if (name === "cep_imovel_alugado") {
            setFormData((prevState) => ({
              ...prevState,
              endereco_imovel_alugado: data.logradouro || "",
              bairro_imovel_alugado: data.bairro || "",
              cidade_imovel_alugado: data.localidade || "",
              estado_imovel_alugado: data.uf || "",
              [name]: formattedValue,
            }));
          } else if (name === "cep_pessoa_fisica_nao_residencial") {
            setFormData((prevState) => ({
              ...prevState,
              endereco_pessoa_fisica_nao_residencial: data.logradouro || "",
              bairro_pessoa_fisica_nao_residencial: data.bairro || "",
              cidade_pessoa_fisica_nao_residencial: data.localidade || "",
              estado_pessoa_fisica_nao_residencial: data.uf || "",
              [name]: formattedValue,
            }));
          }
        } catch (error: unknown) {
          console.error("Erro ao buscar o CEP:", error);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Erro ao buscar o CEP. Tente novamente."
          );

          if (name === "cep") {
            setFormData((prevState) => ({
              ...prevState,
              endereco: "",
              bairro: "",
              cidade: "",
              estado: "",
              [name]: formattedValue,
            }));
          } else if (name === "cep_imovel_alugado") {
            setFormData((prevState) => ({
              ...prevState,
              endereco_imovel_alugado: "",
              bairro_imovel_alugado: "",
              cidade_imovel_alugado: "",
              estado_imovel_alugado: "",
              [name]: formattedValue,
            }));
          } else if (name === "cep_pessoa_fisica_nao_residencial") {
            setFormData((prevState) => ({
              ...prevState,
              endereco_pessoa_fisica_nao_residencial: "",
              bairro_pessoa_fisica_nao_residencial: "",
              cidade_pessoa_fisica_nao_residencial: "",
              estado_pessoa_fisica_nao_residencial: "",
              [name]: formattedValue,
            }));
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        if (name === "cep") {
          setFormData((prevState) => ({
            ...prevState,
            endereco: "",
            bairro: "",
            cidade: "",
            estado: "",
            [name]: formattedValue,
          }));
        } else if (name === "cep_imovel_alugado") {
          setFormData((prevState) => ({
            ...prevState,
            endereco_imovel_alugado: "",
            bairro_imovel_alugado: "",
            cidade_imovel_alugado: "",
            estado_imovel_alugado: "",
            [name]: formattedValue,
          }));
        } else if (name === "cep_pessoa_fisica_nao_residencial") {
          setFormData((prevState) => ({
            ...prevState,
            endereco_pessoa_fisica_nao_residencial: "",
            bairro_pessoa_fisica_nao_residencial: "",
            cidade_pessoa_fisica_nao_residencial: "",
            estado_pessoa_fisica_nao_residencial: "",
            [name]: formattedValue,
          }));
        }
      }
    } else if (name === "cnpj_pessoa_fisica_nao_residencial") {
      formattedValue = formatCNPJ(value);
    } else if (
      [
        "salario",
        "outros_rendimentos",
        "total_rendimentos_mensais",
        "salario_conjuge",
        "outros_rendimentos_conjuge",
        "total_rendimentos_mensais_conjuge",
        "valor_aluguel_atual",
        "compra_produto_cap_inicial",
        "obras_reformas_cap_inicial",
        "maquinas_cap_inicial",
        "despesas_legais_cap_inicial",
        "moveis_cap_inicial",
        "cursos_cap_inicial",
        "estoques_cap_inicial",
        "divulgacao_cap_inicial",
        "reposicao_material_cap_giro",
        "consumo_cap_giro",
        "reposicao_estoque_cap_giro",
        "folha_pagamento_cap_giro",
        "financiamento_vendas_cap_giro",
        "impostos_taxas_cap_giro",
        "aluguel_imovel_alugado",
        "desp_ordinarias_cond_imovel_alugado",
        "iptu_imovel_alugado",
        "agua_imovel_alugado",
        "luz_imovel_alugado",
        "gas_canalizado_imovel_alugado",
        "tipo_qtd_parcela_a_1",
        "tipo_qtd_parcela_a_2",
        "tipo_qtd_parcela_a_3",
        "valor_parcela_a_1",
        "valor_parcela_a_2",
        "valor_parcela_a_3",
        "tipo_qtd_parcela_b_1",
        "tipo_qtd_parcela_b_2",
        "tipo_qtd_parcela_b_3",
        "valor_parcela_b_1",
        "valor_parcela_b_2",
        "valor_parcela_b_3",
      ].includes(name)
    ) {
      // formattedValue = formatCurrency(value);
    } else if (
      [
        "data_expedicao_rg",
        "data_nascimento",
        "data_emissao",
        "data_expedicao_rg_conjuge",
        "data_nascimento_conjuge",
        "data_emissao_conjuge",
      ].includes(name)
    ) {
      formattedValue = value;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  const handleSelectChange = (
    name: keyof SeguroFiancaEmpresarialMenos2Anos,
    value: string | number | Date
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNext = () => {
    const tabs = [
      "dadosPretendente",
      "dadosConjuge",
      "endereco",
      "dadosProfissionais",
      "informacoesEmpresa",
      "informacoesFinanceiras",
      "dadosImovelAlugado",
    ];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const tabs = [
      "dadosPretendente",
      "dadosConjuge",
      "endereco",
      "dadosProfissionais",
      "informacoesEmpresa",
      "informacoesFinanceiras",
      "dadosImovelAlugado",
    ];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verifique se o handleSubmit está sendo acionado
    console.log("handleSubmit acionado com dados:", formData);

    // Função de validação
    const validateForm = () => {
      const errors: string[] = [];
      if (!formData.nome_imobiliaria) errors.push("Nome da Imobiliária");
      if (!formData.nome_pretendente) errors.push("Nome do Pretendente");
      if (!formData.sexo_pretendente) errors.push("Sexo do Pretendente");
      if (!formData.telefone_pretendente)
        errors.push("Telefone do Pretendente");
      if (!formData.cpf) errors.push("CPF");
      if (!formData.rg) errors.push("RG");
      if (!formData.data_expedicao_rg) errors.push("Data de Expedição do RG");
      if (!formData.data_nascimento) errors.push("Data de Nascimento");
      if (!formData.orgao_emissor_rg) errors.push("Órgão Emissor do RG");
      if (!formData.estado_civil_locatario)
        errors.push("Estado Civil do Locatário");
      if (!formData.email) errors.push("Email");
      if (!formData.tipo_residencia) errors.push("Tipo de Residência");
      if (!formData.condicao_imovel) errors.push("Condição do Imóvel");
      if (!formData.arca_com_aluguel) errors.push("Arca com Aluguel");
      if (!formData.vinculo_empregaticio) errors.push("Vínculo Empregatício");
      if (!formData.profissao) errors.push("Profissão");
      if (!formData.salario) errors.push("Salário / Rendimentos");
      if (!formData.alocacao_pretendida_constituida)
        errors.push("Alocação Pretendida Constituída");
      if (!formData.franquia) errors.push("Franquia");
      if (!formData.onus) errors.push("Ônus");
      if (!formData.investimento_abertura)
        errors.push("Investimento para Abertura");
      if (!formData.motivo_locacao) errors.push("Motivo da Locação");
      if (!formData.aluguel_imovel_alugado) errors.push("Valor do Aluguel");

      return errors;
    };

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessage(
        `Ocorreu um erro ao enviar o formulário. Verifique se você preencheu todos os campos obrigatórios e se digitou os campos. Campos obrigatórios que faltam: ${validationErrors.join(
          ", "
        )}`
      );
      return;
    }

    setIsLoading(true);
    try {
      await createSeguroFiancaEmpresarialMenos2Anos(formData); // Certifique-se de que está chamando a função correta
      console.log("Dados enviados para criação:", formData);

      // Reseta o formulário e abre o modal de sucesso
      formRef.current?.reset();
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      setErrorMessage(
        "Ocorreu um erro ao enviar o formulário. Verifique se você preencheu todos os campos obrigatórios e se digitou campos de email corretamente. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const RequiredAsterisk = () => <span className="text-red-500">*</span>;

  return (
    <div className="mb-40 flex justify-center">
      <Card className="w-full max-w-4xl md:mx-10 sm:mx-10">
        <CardHeader className="mb-5">
          <CardTitle>
            Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Menos de 2 Anos)
          </CardTitle>
          <CardDescription>
            Para concluir a análise do Seguro Fiança Pessoa Jurídica Comercial
            (CNPJ Menos de 2 Anos), solicitamos o preenchimento dos dados a
            seguir:
          </CardDescription>
          <h3 className="" style={{ marginTop: "1.5rem " }}>
            💡Os campos marcados com{" "}
            <strong>
              <RequiredAsterisk />
            </strong>{" "}
            são <strong>obrigatórios.</strong>
          </h3>
        </CardHeader>
        <form onSubmit={handleSubmit} ref={formRef}>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="bg-white grid w-full d-flex grid-cols-2 sm:grid-cols-4 gap-2 mb-14">
                <TabsTrigger
                  value="dadosPretendente"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "dadosPretendente" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "dadosPretendente" ? "#16a34a" : undefined,
                    color:
                      currentTab === "dadosPretendente" ? "white" : undefined,
                  }}
                >
                  Dados do Pretendente
                </TabsTrigger>
                <TabsTrigger
                  value="dadosConjuge"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "dadosConjuge" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "dadosConjuge" ? "#16a34a" : undefined,
                    color: currentTab === "dadosConjuge" ? "white" : undefined,
                  }}
                >
                  Dados do Cônjuge
                </TabsTrigger>
                <TabsTrigger
                  value="endereco"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "endereco" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "endereco" ? "#16a34a" : undefined,
                    color: currentTab === "endereco" ? "white" : undefined,
                  }}
                >
                  Endereço
                </TabsTrigger>
                <TabsTrigger
                  value="dadosProfissionais"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "dadosProfissionais" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "dadosProfissionais"
                        ? "#16a34a"
                        : undefined,
                    color:
                      currentTab === "dadosProfissionais" ? "white" : undefined,
                  }}
                >
                  Dados Profissionais
                </TabsTrigger>
                <TabsTrigger
                  value="informacoesEmpresa"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "informacoesEmpresa" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "informacoesEmpresa"
                        ? "#16a34a"
                        : undefined,
                    color:
                      currentTab === "informacoesEmpresa" ? "white" : undefined,
                  }}
                >
                  Informações da Empresa
                </TabsTrigger>
                <TabsTrigger
                  value="informacoesFinanceiras"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "informacoesFinanceiras" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "informacoesFinanceiras"
                        ? "#16a34a"
                        : undefined,
                    color:
                      currentTab === "informacoesFinanceiras"
                        ? "white"
                        : undefined,
                  }}
                >
                  Informações Financeiras
                </TabsTrigger>
                <TabsTrigger
                  value="dadosImovelAlugado"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "dadosImovelAlugado" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "dadosImovelAlugado"
                        ? "#16a34a"
                        : undefined,
                    color:
                      currentTab === "dadosImovelAlugado" ? "white" : undefined,
                  }}
                >
                  Dados do Imóvel Alugado
                </TabsTrigger>
              </TabsList>

              {/* Dados do Pretendente */}
              <TabsContent value="dadosPretendente">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome_imobiliaria">
                      Nome da Imobiliária <RequiredAsterisk />
                    </Label>
                    <Input
                      id="nome_imobiliaria"
                      name="nome_imobiliaria"
                      value={formData.nome_imobiliaria}
                      onChange={handleInputChange}
                      type="text"
                      required
                      placeholder="Digite o nome da imobiliária"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_pretendente">
                        Nome do Pretendente <RequiredAsterisk />
                      </Label>
                      <Input
                        id="nome_pretendente"
                        name="nome_pretendente"
                        value={formData.nome_pretendente}
                        onChange={handleInputChange}
                        type="text"
                        required
                        placeholder="Digite o nome do pretendente"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sexo_pretendente">
                        Sexo <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.sexo_pretendente}
                        onValueChange={(value) =>
                          handleSelectChange("sexo_pretendente", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MASCULINO">Masculino</SelectItem>
                          <SelectItem value="FEMININO">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">
                        CPF <RequiredAsterisk />
                      </Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o CPF"
                        maxLength={14}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rg">
                        RG <RequiredAsterisk />
                      </Label>
                      <Input
                        id="rg"
                        name="rg"
                        value={formData.rg}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o RG"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data_expedicao_rg">
                        Data de Expedição do RG <RequiredAsterisk />
                      </Label>
                      <Input
                        id="data_expedicao_rg"
                        name="data_expedicao_rg"
                        type="date"
                        value={
                          formData.data_expedicao_rg instanceof Date
                            ? formData.data_expedicao_rg
                                .toISOString()
                                .split("T")[0]
                            : formData.data_expedicao_rg
                        }
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgao_emissor_rg">
                        Órgão Emissor do RG <RequiredAsterisk />
                      </Label>
                      <Input
                        id="orgao_emissor_rg"
                        name="orgao_emissor_rg"
                        value={formData.orgao_emissor_rg}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o órgão emissor do RG"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data_nascimento">
                        Data de Nascimento <RequiredAsterisk />
                      </Label>
                      <Input
                        id="data_nascimento"
                        name="data_nascimento"
                        type="date"
                        value={
                          formData.data_nascimento instanceof Date
                            ? formData.data_nascimento
                                .toISOString()
                                .split("T")[0]
                            : formData.data_nascimento
                        }
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email do Pretendente <RequiredAsterisk />
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone_pretendente">
                        Telefone do Pretendente <RequiredAsterisk />
                      </Label>
                      <Input
                        id="telefone_pretendente"
                        name="telefone_pretendente"
                        type="text"
                        value={formData.telefone_pretendente}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o telefone do pretendente"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado_civil_locatario">
                        Estado Civil <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.estado_civil_locatario}
                        onValueChange={(value) =>
                          handleSelectChange("estado_civil_locatario", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOLTEIRO">Solteiro</SelectItem>
                          <SelectItem value="CASADO">Casado</SelectItem>
                          <SelectItem value="DIVORCIADO">Divorciado</SelectItem>
                          <SelectItem value="VIÚVO">Viúvo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.estado_civil_locatario === "CASADO" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="nome_conjuge">Nome do Cônjuge</Label>{" "}
                          <RequiredAsterisk />
                          <Input
                            id="nome_conjuge"
                            name="nome_conjuge"
                            value={formData.nome_conjuge || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o nome do cônjuge"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cpf_conjuge">CPF do Cônjuge</Label>{" "}
                          <RequiredAsterisk />
                          <Input
                            id="cpf_conjuge"
                            name="cpf_conjuge"
                            value={formData.cpf_conjuge || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o CPF do cônjuge"
                            maxLength={14}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Dados do Cônjuge */}
              <TabsContent value="dadosConjuge">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="composicao_renda_conjuge">
                        Cônjuge Vai Compor a Renda? <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.composicao_renda_conjuge || ""}
                        onValueChange={(value) =>
                          handleSelectChange("composicao_renda_conjuge", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Composição de Renda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">Sim</SelectItem>
                          <SelectItem value="NÃO">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.composicao_renda_conjuge === "SIM" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sexo_pretendente_conjuge">
                          Sexo do Cônjuge
                        </Label>
                        <Select
                          value={formData.sexo_pretendente_conjuge || ""}
                          onValueChange={(value) =>
                            handleSelectChange(
                              "sexo_pretendente_conjuge",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o sexo do cônjuge" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MASCULINO">Masculino</SelectItem>
                            <SelectItem value="FEMININO">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="data_expedicao_rg_conjuge">
                          Data de Expedição do RG
                        </Label>
                        <Input
                          id="data_expedicao_rg_conjuge"
                          name="data_expedicao_rg_conjuge"
                          type="date"
                          value={
                            formData.data_expedicao_rg_conjuge instanceof Date
                              ? formData.data_expedicao_rg_conjuge
                                  .toISOString()
                                  .split("T")[0]
                              : formData.data_expedicao_rg_conjuge
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="data_nascimento_conjuge">
                          Data de Nascimento
                        </Label>
                        <Input
                          id="data_nascimento_conjuge"
                          name="data_nascimento_conjuge"
                          type="date"
                          value={
                            formData.data_nascimento_conjuge instanceof Date
                              ? formData.data_nascimento_conjuge
                                  .toISOString()
                                  .split("T")[0]
                              : formData.data_nascimento_conjuge
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgao_emissor_conjuge">
                          Órgão Emissor do RG
                        </Label>
                        <Input
                          id="orgao_emissor_conjuge"
                          name="orgao_emissor_conjuge"
                          value={formData.orgao_emissor_conjuge || ""}
                          onChange={handleInputChange}
                          placeholder="Digite o órgão emissor do RG"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quadro_societario">
                          Quadro Societário
                        </Label>
                        <Select
                          value={formData.quadro_societario || ""}
                          onValueChange={(value) =>
                            handleSelectChange("quadro_societario", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Quadro Societário" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SIM">Sim</SelectItem>
                            <SelectItem value="NÃO">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vinculo_empregaticio_conjuge">
                          Vínculo Empregatício do Cônjuge
                        </Label>
                        <Select
                          value={formData.vinculo_empregaticio_conjuge || ""}
                          onValueChange={(value) =>
                            handleSelectChange(
                              "vinculo_empregaticio_conjuge",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Vínculo Empregatício" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AUTÔNOMO">Autônomo</SelectItem>
                            <SelectItem value="EMPRESÁRIO">
                              Empresário
                            </SelectItem>
                            <SelectItem value="ESTUDANTE">Estudante</SelectItem>
                            <SelectItem value="FUNCIONÁRIO PÚBLICO">
                              Funcionário Público
                            </SelectItem>
                            <SelectItem value="FUNCIONÁRIO COM REGISTRO CLT">
                              Funcionário com Registro CLT
                            </SelectItem>
                            <SelectItem value="PROFISSIONAL LIBERAL">
                              Profissional Liberal
                            </SelectItem>
                            <SelectItem value="APOSENTADO">
                              Aposentado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profissao_conjuge">
                          Profissão do Cônjuge
                        </Label>
                        <Input
                          id="profissao_conjuge"
                          name="profissao_conjuge"
                          value={formData.profissao_conjuge || ""}
                          onChange={handleInputChange}
                          placeholder="Digite a profissão do cônjuge"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nome_empresa_trabalho_conjuge">
                          Nome da Empresa do Cônjuge
                        </Label>
                        <Input
                          id="nome_empresa_trabalho_conjuge"
                          name="nome_empresa_trabalho_conjuge"
                          value={formData.nome_empresa_trabalho_conjuge || ""}
                          onChange={handleInputChange}
                          placeholder="Digite o nome da empresa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="data_emissao_conjuge">
                          Data de Emissão
                        </Label>
                        <Input
                          id="data_emissao_conjuge"
                          name="data_emissao_conjuge"
                          type="date"
                          value={
                            formData.data_emissao_conjuge instanceof Date
                              ? formData.data_emissao_conjuge
                                  .toISOString()
                                  .split("T")[0]
                              : formData.data_emissao_conjuge
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fone_conjuge">
                          Telefone do Cônjuge
                        </Label>
                        <Input
                          id="fone_conjuge"
                          name="fone_conjuge"
                          value={formData.fone_conjuge || ""}
                          onChange={handleInputChange}
                          placeholder="Digite o telefone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ramal_conjuge">Ramal do Cônjuge</Label>
                        <Input
                          id="ramal_conjuge"
                          name="ramal_conjuge"
                          value={formData.ramal_conjuge || ""}
                          onChange={handleInputChange}
                          placeholder="Digite o ramal"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salario_conjuge">
                          Salário do Cônjuge
                        </Label>
                        <Input
                          id="salario_conjuge"
                          name="salario_conjuge"
                          value={formData.salario_conjuge || ""}
                          onChange={handleInputChange}
                          placeholder="Digite o salário"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="outros_rendimentos_conjuge">
                          Outros Rendimentos do Cônjuge
                        </Label>
                        <Input
                          id="outros_rendimentos_conjuge"
                          name="outros_rendimentos_conjuge"
                          value={formData.outros_rendimentos_conjuge || ""}
                          onChange={handleInputChange}
                          placeholder="Digite outros rendimentos"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="total_rendimentos_mensais_conjuge">
                          Total de Rendimentos Mensais do Cônjuge
                        </Label>
                        <Input
                          id="total_rendimentos_mensais_conjuge"
                          name="total_rendimentos_mensais_conjuge"
                          value={
                            formData.total_rendimentos_mensais_conjuge || ""
                          }
                          onChange={handleInputChange}
                          placeholder="Digite o total de rendimentos mensais"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Endereço */}
              <TabsContent value="endereco">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fone_residencial">Fone Residencial</Label>
                      <Input
                        id="fone_residencial"
                        name="fone_residencial"
                        value={formData.fone_residencial || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o telefone residencial"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fone_celular">Fone Celular</Label>
                      <Input
                        id="fone_celular"
                        name="fone_celular"
                        value={formData.fone_celular || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o telefone celular"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">
                        CEP <RequiredAsterisk />
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="cep"
                          name="cep"
                          value={formData.cep || ""}
                          onChange={handleInputChange}
                          required
                          placeholder="Digite o CEP"
                        />
                        {isLoading && (
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="endereco">
                        Endereço <RequiredAsterisk />
                      </Label>
                      <Input
                        id="endereco"
                        name="endereco"
                        value={formData.endereco || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o endereço"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">
                        Número <RequiredAsterisk />
                      </Label>
                      <Input
                        id="numero"
                        name="numero"
                        value={formData.numero || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o número"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bairro">
                        Bairro <RequiredAsterisk />
                      </Label>
                      <Input
                        id="bairro"
                        name="bairro"
                        value={formData.bairro || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o bairro"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        name="complemento"
                        value={formData.complemento || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o complemento (opcional)"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade">
                        Cidade <RequiredAsterisk />
                      </Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={formData.cidade || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite a cidade"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">
                        Estado <RequiredAsterisk />
                      </Label>
                      <Input
                        id="estado"
                        name="estado"
                        value={formData.estado || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o estado"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo_residencia">
                        Tipo de Residência <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.tipo_residencia}
                        onValueChange={(value) =>
                          handleSelectChange("tipo_residencia", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de Residência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MENOS DE 1 ANO">
                            Menos de 1 ano
                          </SelectItem>
                          <SelectItem value="1 A 2 ANOS">1 a 2 anos</SelectItem>
                          <SelectItem value="3 A 4 ANOS">3 a 4 anos</SelectItem>
                          <SelectItem value="5 A 6 ANOS">5 a 6 anos</SelectItem>
                          <SelectItem value="7 A 9 ANOS">7 a 9 anos</SelectItem>
                          <SelectItem value="ACIMA DE 10 ANOS">
                            Acima de 10 anos
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condicao_imovel">
                        Condição do Imóvel <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.condicao_imovel}
                        onValueChange={(value) =>
                          handleSelectChange("condicao_imovel", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Condição do Imóvel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALUGADO (EM NOME DO PRETENDENTE)">
                            Alugado (em nome do pretendente)
                          </SelectItem>
                          <SelectItem value="ALUGADO (NOME DOS OUTROS)">
                            Alugado (nome dos outros)
                          </SelectItem>
                          <SelectItem value="PRÓPRIO">Próprio</SelectItem>
                          <SelectItem value="FINANCIADO (EM NOME PRÓPRIO)">
                            Financiado (em nome próprio)
                          </SelectItem>
                          <SelectItem value="FINANCIADO (NOME DE OUTROS)">
                            Financiado (nome de outros)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="arca_com_aluguel">
                        Arca com Aluguel? <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.arca_com_aluguel}
                        onValueChange={(value) =>
                          handleSelectChange("arca_com_aluguel", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Arca com Aluguel?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">Sim</SelectItem>
                          <SelectItem value="NÃO">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor_aluguel_atual">
                        Valor do Aluguel Atual
                      </Label>
                      <Input
                        id="valor_aluguel_atual"
                        name="valor_aluguel_atual"
                        value={formData.valor_aluguel_atual || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor do aluguel atual"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome_locator_proprietario_imobiliaria">
                        Nome do Locador/Proprietário/Imobiliária
                      </Label>
                      <Input
                        id="nome_locator_proprietario_imobiliaria"
                        name="nome_locator_proprietario_imobiliaria"
                        value={
                          formData.nome_locator_proprietario_imobiliaria || ""
                        }
                        onChange={handleInputChange}
                        placeholder="Digite o nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone_contato">
                        Telefone de Contato
                      </Label>
                      <Input
                        id="telefone_contato"
                        name="telefone_contato"
                        value={formData.telefone_contato || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o telefone de contato"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Dados Profissionais */}
              <TabsContent value="dadosProfissionais">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vinculo_empregaticio">
                        Vínculo Empregatício <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.vinculo_empregaticio}
                        onValueChange={(value) =>
                          handleSelectChange("vinculo_empregaticio", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Vínculo Empregatício" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AUTÔNOMO">Autônomo</SelectItem>
                          <SelectItem value="EMPRESÁRIO">Empresário</SelectItem>
                          <SelectItem value="ESTUDANTE">Estudante</SelectItem>
                          <SelectItem value="FUNCIONÁRIO PÚBLICO">
                            Funcionário Público
                          </SelectItem>
                          <SelectItem value="FUNCIONÁRIO COM REGISTRO CLT">
                            Funcionário com Registro CLT
                          </SelectItem>
                          <SelectItem value="PROFISSIONAL LIBERAL">
                            Profissional Liberal
                          </SelectItem>
                          <SelectItem value="APOSENTADO">Aposentado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profissao">
                        Profissão <RequiredAsterisk />
                      </Label>
                      <Input
                        id="profissao"
                        name="profissao"
                        value={formData.profissao}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite a profissão"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome_empresa_trabalho">
                        Nome da Empresa
                      </Label>
                      <Input
                        id="nome_empresa_trabalho"
                        name="nome_empresa_trabalho"
                        value={formData.nome_empresa_trabalho || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o nome da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data_emissao">Data de Emissão</Label>
                      <Input
                        id="data_emissao"
                        name="data_emissao"
                        type="date"
                        value={
                          formData.data_emissao instanceof Date
                            ? formData.data_emissao.toISOString().split("T")[0]
                            : formData.data_emissao
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fone">Telefone</Label>
                      <Input
                        id="fone"
                        name="fone"
                        value={formData.fone || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o telefone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ramal">Ramal</Label>
                      <Input
                        id="ramal"
                        name="ramal"
                        value={formData.ramal || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o ramal"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salario">
                        Salário / Rendimentos <RequiredAsterisk />
                      </Label>
                      <Input
                        id="salario"
                        name="salario"
                        type="number"
                        value={formData.salario || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o salário"
                        required
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Informações da Empresa */}
              <TabsContent value="informacoesEmpresa">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alocacao_pretendida_constituida">
                        A locação pretendida é para empresa já constituída?
                        <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.alocacao_pretendida_constituida}
                        onValueChange={(value) =>
                          handleSelectChange(
                            "alocacao_pretendida_constituida",
                            value
                          )
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">Sim</SelectItem>
                          <SelectItem value="NÃO">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.alocacao_pretendida_constituida === "SIM" && (
                      <div className="space-y-2">
                        <Label htmlFor="cnpj_pessoa_fisica_nao_residencial">
                          Informar CNPJ <RequiredAsterisk />
                        </Label>
                        <Input
                          id="cnpj_pessoa_fisica_nao_residencial"
                          name="cnpj_pessoa_fisica_nao_residencial"
                          value={
                            formData.cnpj_pessoa_fisica_nao_residencial || ""
                          }
                          onChange={handleInputChange}
                          placeholder="Digite o CNPJ"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="cnae_empresa">
                        Qual será a atividade da empresa (CNAE)?{" "}
                        <RequiredAsterisk />
                      </Label>
                      <Input
                        id="cnae_empresa"
                        name="cnae_empresa"
                        value={formData.cnae_empresa || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o CNAE"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="franquia">
                        Franquia? <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.franquia}
                        onValueChange={(value) =>
                          handleSelectChange("franquia", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">Sim</SelectItem>
                          <SelectItem value="NÃO">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.franquia === "SIM" && (
                      <div className="space-y-2">
                        <Label htmlFor="nome_franqueadora">
                          Nome da Franqueadora
                        </Label>
                        <Input
                          id="nome_franqueadora"
                          name="nome_franqueadora"
                          value={formData.nome_franqueadora || ""}
                          onChange={handleInputChange}
                          placeholder="Digite o nome da franqueadora"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="principais_produtos_servicos">
                        Quais serão os principais produtos/serviços fabricados,
                        revendidos ou prestados? <RequiredAsterisk />
                      </Label>
                      <Input
                        id="principais_produtos_servicos"
                        name="principais_produtos_servicos"
                        value={formData.principais_produtos_servicos || ""}
                        onChange={handleInputChange}
                        placeholder="Digite os principais produtos/serviços"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="xp_ramo_pretendido">
                        Qual a experiência no ramo pretendido?{" "}
                        <RequiredAsterisk />
                      </Label>
                      <Input
                        id="xp_ramo_pretendido"
                        name="xp_ramo_pretendido"
                        value={formData.xp_ramo_pretendido || ""}
                        onChange={handleInputChange}
                        placeholder="Descreva a experiência"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf_socio_1">CPF do Sócio 1</Label>
                      <Input
                        id="cpf_socio_1"
                        name="cpf_socio_1"
                        value={formData.cpf_socio_1 || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF do sócio 1"
                        maxLength={14}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf_socio_2">CPF do Sócio 2</Label>
                      <Input
                        id="cpf_socio_2"
                        name="cpf_socio_2"
                        value={formData.cpf_socio_2 || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF do sócio 2"
                        maxLength={14}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf_socio_3">CPF do Sócio 3</Label>
                      <Input
                        id="cpf_socio_3"
                        name="cpf_socio_3"
                        value={formData.cpf_socio_3 || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF do sócio 3"
                        maxLength={14}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Informações Financeiras */}
              <TabsContent value="informacoesFinanceiras">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="onus">
                      Possui financiamentos e ou empréstimos?{" "}
                      <RequiredAsterisk />
                    </Label>
                    <Select
                      value={formData.onus}
                      onValueChange={(value) =>
                        handleSelectChange("onus", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SIM">Sim</SelectItem>
                        <SelectItem value="NÃO">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.onus === "SIM" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="detalhamento_onus">
                          Detalhamento do financiamento/empréstimo
                        </Label>
                        <Input
                          id="detalhamento_onus"
                          name="detalhamento_onus"
                          value={formData.detalhamento_onus || ""}
                          onChange={handleInputChange}
                          placeholder="Detalhamento do financiamento/empréstimo"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tipo_qtd_parcela_a_1">
                            Tipo e Quantidade de Parcelas A1
                          </Label>
                          <Input
                            id="tipo_qtd_parcela_a_1"
                            name="tipo_qtd_parcela_a_1"
                            value={formData.tipo_qtd_parcela_a_1 || ""}
                            onChange={handleInputChange}
                            placeholder="Detalhamento do financiamento/empréstimo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="valor_parcela_a_1">
                            Valor da Parcela A1
                          </Label>
                          <Input
                            id="valor_parcela_a_1"
                            name="valor_parcela_a_1"
                            value={formData.valor_parcela_a_1 || ""}
                            onChange={handleInputChange}
                            placeholder="Detalhamento do financiamento/empréstimo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tipo_qtd_parcela_a_2">
                            Tipo e Quantidade de Parcelas A2
                          </Label>
                          <Input
                            id="tipo_qtd_parcela_a_2"
                            name="tipo_qtd_parcela_a_2"
                            value={formData.tipo_qtd_parcela_a_2 || ""}
                            onChange={handleInputChange}
                            placeholder="Detalhamento do financiamento/empréstimo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="valor_parcela_a_2">
                            Valor da Parcela A2
                          </Label>
                          <Input
                            id="valor_parcela_a_2"
                            name="valor_parcela_a_2"
                            value={formData.valor_parcela_a_2 || ""}
                            onChange={handleInputChange}
                            placeholder="Detalhamento do financiamento/empréstimo"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Investimento Abertura */}
                  <div className="space-y-2">
                    <Label htmlFor="investimento_abertura">
                      Investimento para Abertura? <RequiredAsterisk />
                    </Label>
                    <Select
                      value={formData.investimento_abertura}
                      onValueChange={(value) =>
                        handleSelectChange("investimento_abertura", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SIM">Sim</SelectItem>
                        <SelectItem value="NÃO">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.investimento_abertura === "SIM" && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="compra_produto_cap_inicial">
                            Compra Produto (Capital Inicial)
                          </Label>
                          <Input
                            id="compra_produto_cap_inicial"
                            name="compra_produto_cap_inicial"
                            value={formData.compra_produto_cap_inicial || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="obras_reformas_cap_inicial">
                            Obras/Reformas (Capital Inicial)
                          </Label>
                          <Input
                            id="obras_reformas_cap_inicial"
                            name="obras_reformas_cap_inicial"
                            value={formData.obras_reformas_cap_inicial || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maquinas_cap_inicial">
                            Máquinas (Capital Inicial)
                          </Label>
                          <Input
                            id="maquinas_cap_inicial"
                            name="maquinas_cap_inicial"
                            value={formData.maquinas_cap_inicial || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="despesas_legais_cap_inicial">
                            Despesas Legais (Capital Inicial)
                          </Label>
                          <Input
                            id="despesas_legais_cap_inicial"
                            name="despesas_legais_cap_inicial"
                            value={formData.despesas_legais_cap_inicial || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="moveis_cap_inicial">
                            Móveis (Capital Inicial)
                          </Label>
                          <Input
                            id="moveis_cap_inicial"
                            name="moveis_cap_inicial"
                            value={formData.moveis_cap_inicial || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cursos_cap_inicial">
                            Cursos (Capital Inicial)
                          </Label>
                          <Input
                            id="cursos_cap_inicial"
                            name="cursos_cap_inicial"
                            value={formData.cursos_cap_inicial || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="estoques_cap_inicial">
                            Estoques (Capital Inicial)
                          </Label>
                          <Input
                            id="estoques_cap_inicial"
                            name="estoques_cap_inicial"
                            value={formData.estoques_cap_inicial || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="divulgacao_cap_inicial">
                            Divulgação (Capital Inicial)
                          </Label>
                          <Input
                            id="divulgacao_cap_inicial"
                            name="divulgacao_cap_inicial"
                            value={formData.divulgacao_cap_inicial || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                      </div>

                      {/* Capital de Giro */}
                      <div className="mt-4">
                        <h3 className="text-lg font-medium">Capital de Giro</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reposicao_material_cap_giro">
                            Reposição Material
                          </Label>
                          <Input
                            id="reposicao_material_cap_giro"
                            name="reposicao_material_cap_giro"
                            value={formData.reposicao_material_cap_giro || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="consumo_cap_giro">Consumo</Label>
                          <Input
                            id="consumo_cap_giro"
                            name="consumo_cap_giro"
                            value={formData.consumo_cap_giro || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reposicao_estoque_cap_giro">
                            Reposição Estoque
                          </Label>
                          <Input
                            id="reposicao_estoque_cap_giro"
                            name="reposicao_estoque_cap_giro"
                            value={formData.reposicao_estoque_cap_giro || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="folha_pagamento_cap_giro">
                            Folha de Pagamento
                          </Label>
                          <Input
                            id="folha_pagamento_cap_giro"
                            name="folha_pagamento_cap_giro"
                            value={formData.folha_pagamento_cap_giro || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="financiamento_vendas_cap_giro">
                            Financiamento Vendas
                          </Label>
                          <Input
                            id="financiamento_vendas_cap_giro"
                            name="financiamento_vendas_cap_giro"
                            value={formData.financiamento_vendas_cap_giro || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="impostos_taxas_cap_giro">
                            Impostos/Taxas
                          </Label>
                          <Input
                            id="impostos_taxas_cap_giro"
                            name="impostos_taxas_cap_giro"
                            value={formData.impostos_taxas_cap_giro || ""}
                            onChange={handleInputChange}
                            placeholder="Digite o valor"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Dados do Imóvel Alugado */}
              <TabsContent value="dadosImovelAlugado">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep_imovel_alugado">
                        CEP <RequiredAsterisk />
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="cep_imovel_alugado"
                          name="cep_imovel_alugado"
                          value={formData.cep_imovel_alugado || ""}
                          onChange={handleInputChange}
                          required
                          placeholder="Digite o CEP"
                        />
                        {isLoading && (
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endereco_imovel_alugado">
                        Endereço <RequiredAsterisk />
                      </Label>
                      <Input
                        id="endereco_imovel_alugado"
                        name="endereco_imovel_alugado"
                        value={formData.endereco_imovel_alugado || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o endereço"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero_imovel_alugado">
                        Número <RequiredAsterisk />
                      </Label>
                      <Input
                        id="numero_imovel_alugado"
                        name="numero_imovel_alugado"
                        value={formData.numero_imovel_alugado || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o número"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complemento_imovel_alugado">
                        Complemento
                      </Label>
                      <Input
                        id="complemento_imovel_alugado"
                        name="complemento_imovel_alugado"
                        value={formData.complemento_imovel_alugado || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o complemento"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bairro_imovel_alugado">
                        Bairro <RequiredAsterisk />
                      </Label>
                      <Input
                        id="bairro_imovel_alugado"
                        name="bairro_imovel_alugado"
                        value={formData.bairro_imovel_alugado || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o bairro"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade_imovel_alugado">
                        Cidade <RequiredAsterisk />
                      </Label>
                      <Input
                        id="cidade_imovel_alugado"
                        name="cidade_imovel_alugado"
                        value={formData.cidade_imovel_alugado || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite a cidade"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado_imovel_alugado">
                        Estado <RequiredAsterisk />
                      </Label>
                      <Input
                        id="estado_imovel_alugado"
                        name="estado_imovel_alugado"
                        value={formData.estado_imovel_alugado || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o estado"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aluguel_imovel_alugado">
                        Valor do Aluguel <RequiredAsterisk />
                      </Label>
                      <Input
                        id="aluguel_imovel_alugado"
                        name="aluguel_imovel_alugado"
                        value={formData.aluguel_imovel_alugado || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor do aluguel"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desp_ordinarias_cond_imovel_alugado">
                        Valor do Condomínio
                      </Label>
                      <Input
                        id="desp_ordinarias_cond_imovel_alugado"
                        name="desp_ordinarias_cond_imovel_alugado"
                        value={
                          formData.desp_ordinarias_cond_imovel_alugado || ""
                        }
                        onChange={handleInputChange}
                        placeholder="Digite o valor das despesas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="iptu_imovel_alugado">
                        Valor do IPTU mensal
                      </Label>
                      <Input
                        id="iptu_imovel_alugado"
                        name="iptu_imovel_alugado"
                        value={formData.iptu_imovel_alugado || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor do IPTU"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agua_imovel_alugado">Valor da Água</Label>
                      <Input
                        id="agua_imovel_alugado"
                        name="agua_imovel_alugado"
                        value={formData.agua_imovel_alugado || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor da água"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="luz_imovel_alugado">Valor da Luz</Label>
                      <Input
                        id="luz_imovel_alugado"
                        name="luz_imovel_alugado"
                        value={formData.luz_imovel_alugado || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor da luz"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gas_canalizado_imovel_alugado">
                        Valor do Gás
                      </Label>
                      <Input
                        id="gas_canalizado_imovel_alugado"
                        name="gas_canalizado_imovel_alugado"
                        value={formData.gas_canalizado_imovel_alugado || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor do gás"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="motivo_locacao">
                        Motivo da Locação <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.motivo_locacao}
                        onValueChange={(value) =>
                          handleSelectChange("motivo_locacao", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o motivo da locação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ABERTURA DE FILIAL">
                            Abertura de Filial
                          </SelectItem>
                          <SelectItem value="ABERTURA DE MATRIZ">
                            Abertura de Matriz
                          </SelectItem>
                          <SelectItem value="TROCA LOCAL DE SEDE">
                            Troca Local de Sede
                          </SelectItem>
                          <SelectItem value="REDUÇÃO DE CUSTOS">
                            Redução de Custos
                          </SelectItem>
                          <SelectItem value="LOCAÇÃO PARA MORADIA">
                            Locação para Moradia
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.motivo_locacao === "LOCAÇÃO PARA MORADIA" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cpf">
                            CPF do Morador <RequiredAsterisk />
                          </Label>
                          <Input
                            id="cpf_morador"
                            name="cpf_morador"
                            value={formData.cpf_morador}
                            onChange={handleInputChange}
                            placeholder="Digite o CPF do morador"
                            maxLength={14}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid gap-4 py-4">
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) =>
                          setAgreedToTerms(checked === true)
                        }
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Declaro que as informações prestadas são a expressão da
                        verdade, pelas quais me responsabilizo.
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          {errorMessage && (
            <div className="text-red-500 text-center my-5 px-4">
              {errorMessage}
            </div>
          )}

          <CardFooter className="flex justify-between">
            {currentTab !== "dadosPretendente" && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
            )}
            {currentTab !== "dadosImovelAlugado" ? (
              <Button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-[#00612B] text-white shadow hover:bg-[#02693E] focus-visible:ring-[#02693E] hover:bg-green-500"
              >
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!agreedToTerms || isLoading}
                className="ml-auto bg-green-700 hover:bg-green-600"
              >
                {isLoading ? (
                  <>
                    Enviando...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Enviar <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {/* Dialog para o envio com sucesso */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              Formulário Enviado com Sucesso
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <div className="w-24 h-24 flex items-center justify-center my-5">
              <img src={pivaLogo} alt="Piva" className="w-24 h-24 " />
            </div>
          </div>
          <DialogDescription>
            Seus dados foram enviados com sucesso. Nossa equipe entrará em
            contato em breve.
          </DialogDescription>
          <Button
            onClick={() => {
              setIsSuccessModalOpen(false);
              navigate("/formulario");
            }}
            className="w-full mt-4 bg-green-700 hover:bg-green-600"
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
