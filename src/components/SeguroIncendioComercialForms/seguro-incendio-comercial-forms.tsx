import { SeguroIncendioComercial } from "@/types/SeguroIncendioComercial";
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
import { formatCEP } from "@/utils/regex/regexCEP";
import { createSeguroIncendioComercial } from "@/utils/api/SeguroIncendioComercialService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import pivaLogo from "@/assets/logo.png";
import { buscaEnderecoPorCEP, EnderecoViaCep } from "@/utils/api/Cep";

export function SeguroIncendioComercialForms() {
  const [currentTab, setCurrentTab] = useState("personal");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<SeguroIncendioComercial>({
    id: "",
    id_numero: 0,
    acao: "PENDENTE",
    nome_imobiliaria: "",
    email_imobiliaria: "",
    nome_locatario: "",
    cpf_locatario: "",
    data_nascimento_locatario: new Date(),
    estado_civil: "SOLTEIRO",
    sexo_locatario: "MASCULINO",
    cep: "",
    endereco: "",
    bairro: "",
    numero_endereco: 0,
    complemento: "",
    cidade: "",
    estado: "",
    // tipo_imovel: "CASA",
    atividade: "",
    plano_escolhido: "PLANO PADRÃO GRATUITO",
    valor_seguro: 0,
    forma_pagamento: "1X FATURA MENSAL - SEM ENTRADA",
    inclusao_clausula_beneficiaria: "SIM",
    created: new Date(),
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf_locatario" || name === "cpf_locador_opcional") {
      formattedValue = formatCPF(value);
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else if (name === "cep") {
      formattedValue = formatCEP(value);

      const cepNumeros = formattedValue.replace(/\D/g, "");

      if (cepNumeros.length === 8) {
        try {
          setIsLoading(true);
          setErrorMessage("");

          const data: EnderecoViaCep = await buscaEnderecoPorCEP(cepNumeros);

          setFormData((prevState) => ({
            ...prevState,
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
            complemento: data.complemento || "",
            [name]: formattedValue,
          }));
        } catch (error: unknown) {
          console.error("Erro ao buscar o CEP:", error);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Erro ao buscar o CEP. Tente novamente."
          );

          setFormData((prevState) => ({
            ...prevState,
            endereco: "",
            bairro: "",
            cidade: "",
            estado: "",
            complemento: "",
            [name]: formattedValue,
          }));
        } finally {
          setIsLoading(false);
        }
      } else {
        setFormData((prevState) => ({
          ...prevState,
          endereco: "",
          bairro: "",
          cidade: "",
          estado: "",
          complemento: "",
          [name]: formattedValue,
        }));
      }
    } else if (
      [
        "incendio",
        "vendaval",
        "danos_eletricos",
        "impacto_veiculos",
        "perda_aluguel",
        "responsabilidade_civil",
        "valor_seguro",
      ].includes(name)
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    }
  };

  const handleSelectChange = (
    name: keyof SeguroIncendioComercial,
    value: string | number | Date
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNext = () => {
    const tabs = ["personal", "address", "property", "payment"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const tabs = ["personal", "address", "property", "payment"];
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
      if (!formData.acao) errors.push("Ação");
      if (!formData.nome_imobiliaria) errors.push("Nome da Imobiliária");
      if (!formData.email_imobiliaria) errors.push("Email da Imobiliária");
      if (!formData.nome_locatario) errors.push("Nome do Locatário");
      if (!formData.cpf_locatario) errors.push("CPF do Locatário");
      if (!formData.data_nascimento_locatario)
        errors.push("Data de Nascimento");
      if (!formData.estado_civil) errors.push("Estado Civil");
      if (!formData.sexo_locatario) errors.push("Sexo do Locatário");
      if (!formData.cep) errors.push("CEP");
      if (!formData.endereco) errors.push("Endereço");
      if (!formData.bairro) errors.push("Bairro");
      if (!formData.numero_endereco) errors.push("Número do Endereço");
      if (!formData.cidade) errors.push("Cidade");
      if (!formData.estado) errors.push("Estado");
      // if (!formData.tipo_imovel) errors.push("Tipo do Imóvel");
      if (!formData.atividade) errors.push("Atividade da Empresa");
      if (!formData.plano_escolhido) errors.push("Plano Escolhido");
      if (!formData.valor_seguro) errors.push("Valor do Seguro");
      if (!formData.forma_pagamento) errors.push("Forma de Pagamento");
      if (!formData.inclusao_clausula_beneficiaria)
        errors.push("Inclusão de Cláusula Beneficiária");

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
      await createSeguroIncendioComercial(formData); // Certifique-se de que está chamando a função correta
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
          <CardTitle>Seguro Incêndio Comercial</CardTitle>
          <CardDescription>
            Para concluir a efetivação do Seguro Incêndio Comercial, solicitamos
            o preenchimento dos dados a seguir:
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
              <TabsList className="bg-white grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-14">
                <TabsTrigger
                  value="personal"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "personal" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "personal" ? "#16a34a" : undefined,
                    color: currentTab === "personal" ? "white" : undefined,
                  }}
                >
                  Dados do Locatário
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "address" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "address" ? "#16a34a" : undefined,
                    color: currentTab === "address" ? "white" : undefined,
                  }}
                >
                  Dados da Locação
                </TabsTrigger>
                <TabsTrigger
                  value="property"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "property" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "property" ? "#16a34a" : undefined,
                    color: currentTab === "property" ? "white" : undefined,
                  }}
                >
                  Coberturas
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "payment" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "payment" ? "#16a34a" : undefined,
                    color: currentTab === "payment" ? "white" : undefined,
                  }}
                >
                  Forma de Pagamento
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_imobiliaria">
                        Nome da Imobiliária <RequiredAsterisk />
                      </Label>
                      <Input
                        id="nome_imobiliaria"
                        name="nome_imobiliaria"
                        value={formData.nome_imobiliaria}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o nome da imobiliária"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email_imobiliaria">
                        Email da Imobiliária <RequiredAsterisk />
                      </Label>
                      <Input
                        id="email_imobiliaria"
                        name="email_imobiliaria"
                        type="email"
                        value={formData.email_imobiliaria}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o email da imobiliária"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_locatario">
                        Nome do Locatário <RequiredAsterisk />
                      </Label>
                      <Input
                        id="nome_locatario"
                        name="nome_locatario"
                        value={formData.nome_locatario}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o nome do locatário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf_locatario">
                        CPF do Locatário <RequiredAsterisk />
                      </Label>
                      <Input
                        id="cpf_locatario"
                        name="cpf_locatario"
                        value={formData.cpf_locatario}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o CPF do locatário"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data_nascimento_locatario">
                        Data de Nascimento <RequiredAsterisk />
                      </Label>
                      <Input
                        id="data_nascimento_locatario"
                        name="data_nascimento_locatario"
                        type="date"
                        value={
                          formData.data_nascimento_locatario instanceof Date
                            ? formData.data_nascimento_locatario
                                .toISOString()
                                .split("T")[0]
                            : formData.data_nascimento_locatario
                        }
                        onChange={handleInputChange}
                        required
                        placeholder="Selecione a data de nascimento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado_civil">
                        Estado Civil <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.estado_civil}
                        onValueChange={(value) =>
                          handleSelectChange("estado_civil", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOLTEIRO">Solteiro</SelectItem>
                          <SelectItem value="CASADO">Casado</SelectItem>
                          <SelectItem value="VIÚVO">Viúvo</SelectItem>
                          <SelectItem value="DIVORCIADO">Divorciado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sexo_locatario">
                        Sexo <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.sexo_locatario}
                        onValueChange={(value) =>
                          handleSelectChange("sexo_locatario", value)
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
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">
                        CEP <RequiredAsterisk />
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleInputChange}
                          required
                          placeholder="Digite o CEP"
                        />
                        {isLoading && (
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="endereco">
                        Endereço <RequiredAsterisk />
                      </Label>
                      <Input
                        id="endereco"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o endereço"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero_endereco">
                        Número <RequiredAsterisk />
                      </Label>
                      <Input
                        id="numero_endereco"
                        name="numero_endereco"
                        type="text"
                        value={formData.numero_endereco || ""}
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
                        value={formData.bairro}
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
                        value={formData.cidade}
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
                        value={formData.estado}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o estado"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="property">
                <div className="grid gap-4 py-4">
                  {/* <div className="space-y-2">
                    <Label htmlFor="tipo_imovel">
                      Tipo do Imóvel <RequiredAsterisk />
                    </Label>
                    <Select
                      value={formData.tipo_imovel}
                      onValueChange={(value) =>
                        handleSelectChange("tipo_imovel", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo do imóvel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASA">Casa</SelectItem>
                        <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                  {/* Campos adicionais do imóvel */}

                  <div className="space-y-2">
                    <Label htmlFor="atividade">
                      Atividade da Empresa <RequiredAsterisk />
                    </Label>
                    <Input
                      id="atividade"
                      name="atividade"
                      type="text"
                      value={formData.atividade || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="Digite a atividade da empresa"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incendio">Incêndio</Label>
                      <Input
                        id="incendio"
                        name="incendio"
                        type="number"
                        value={formData.incendio || ""}
                        onChange={handleInputChange}
                        placeholder="Valor de Incêndio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendaval">Vendaval</Label>
                      <Input
                        id="vendaval"
                        name="vendaval"
                        type="number"
                        value={formData.vendaval || ""}
                        onChange={handleInputChange}
                        placeholder="Valor de Vendaval"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="danos_eletricos">Danos Elétricos</Label>
                      <Input
                        id="danos_eletricos"
                        name="danos_eletricos"
                        type="number"
                        value={formData.danos_eletricos || ""}
                        onChange={handleInputChange}
                        placeholder="Valor de Danos Elétricos"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="impacto_veiculos">
                        Impacto de Veículos
                      </Label>
                      <Input
                        id="impacto_veiculos"
                        name="impacto_veiculos"
                        type="number"
                        value={formData.impacto_veiculos || ""}
                        onChange={handleInputChange}
                        placeholder="Valor de Impacto de Veículos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perda_aluguel">Perda de Aluguel</Label>
                      <Input
                        id="perda_aluguel"
                        name="perda_aluguel"
                        type="number"
                        value={formData.perda_aluguel || ""}
                        onChange={handleInputChange}
                        placeholder="Valor de Perda de Aluguel"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsabilidade_civil">
                        Responsabilidade Civil
                      </Label>
                      <Input
                        id="responsabilidade_civil"
                        name="responsabilidade_civil"
                        type="number"
                        value={formData.responsabilidade_civil || ""}
                        onChange={handleInputChange}
                        placeholder="Valor de Responsabilidade Civil"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="plano_escolhido">
                      ASSISTÊNCIA <RequiredAsterisk />
                    </Label>
                    <Select
                      value={formData.plano_escolhido}
                      onValueChange={(value) =>
                        handleSelectChange("plano_escolhido", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLANO PADRÃO GRATUITO">
                          Plano Padrão Gratuito
                        </SelectItem>
                        <SelectItem value="PLANO INTERMEDIÁRIO ">
                          Plano Intermediário
                        </SelectItem>
                        <SelectItem value="PLANO DE REDE REFERENCIADA">
                          Plano de Rede Referenciada
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="forma_pagamento">
                        Forma de Pagamento <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.forma_pagamento}
                        onValueChange={(value) =>
                          handleSelectChange("forma_pagamento", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Opções de forma de pagamento */}
                          <SelectItem value="1X FATURA MENSAL - SEM ENTRADA">
                            1X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="2X FATURA MENSAL - SEM ENTRADA">
                            2X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="3X FATURA MENSAL - SEM ENTRADA">
                            3X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="4X FATURA MENSAL - SEM ENTRADA">
                            4X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="5X FATURA MENSAL - SEM ENTRADA">
                            5X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="6X FATURA MENSAL - SEM ENTRADA">
                            6X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="7X FATURA MENSAL - SEM ENTRADA">
                            7X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="8X FATURA MENSAL - SEM ENTRADA">
                            8X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="9X FATURA MENSAL - SEM ENTRADA">
                            9X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="10X FATURA MENSAL - SEM ENTRADA">
                            10X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          <SelectItem value="11X FATURA MENSAL - SEM ENTRADA">
                            11X FATURA MENSAL - SEM ENTRADA
                          </SelectItem>
                          {/* Adicione as demais opções aqui */}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valor_seguro">
                        Valor da Parcela do Seguro <RequiredAsterisk />
                      </Label>
                      <Input
                        id="valor_seguro"
                        name="valor_seguro"
                        type="number"
                        value={formData.valor_seguro || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o valor da parcela do seguro"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inclusao_clausula_beneficiaria">
                      Inclusão de Cláusula Beneficiária <RequiredAsterisk />
                    </Label>
                    <Select
                      value={formData.inclusao_clausula_beneficiaria}
                      onValueChange={(value) =>
                        handleSelectChange(
                          "inclusao_clausula_beneficiaria",
                          value
                        )
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SIM">Sim</SelectItem>
                        <SelectItem value="NÃO">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf_locador_opcional">
                        CPF do Locador (Opcional)
                      </Label>
                      <Input
                        id="cpf_locador_opcional"
                        name="cpf_locador_opcional"
                        value={formData.cpf_locador_opcional || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF do locador (opcional)"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome_locador">
                        Nome do Locador (Opcional)
                      </Label>
                      <Input
                        id="nome_locador"
                        name="nome_locador"
                        value={formData.nome_locador || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o nome do locador"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
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
              </TabsContent>
            </Tabs>
          </CardContent>

          {errorMessage && (
            <div className="text-red-500 text-center my-5 px-4">
              {errorMessage}
            </div>
          )}

          <CardFooter className="flex justify-between">
            {currentTab !== "personal" && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
            )}
            {currentTab !== "payment" ? (
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
