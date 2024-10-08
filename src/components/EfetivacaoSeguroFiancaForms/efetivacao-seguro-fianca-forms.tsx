import { EfetivacaoSeguroFianca } from "@/types/EfetivacaoSeguroFianca";
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
import { formatRG } from "@/utils/regex/regexRG";
import { formatTelefone } from "@/utils/regex/regexTelefone";
import { formatCEP } from "@/utils/regex/regexCEP";
import { createEfetivacaoSeguroFianca } from "../../utils/api/EfetivacaoSeguroFiancaService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import pivaLogo from "@/assets/logo.png";
import { buscaEnderecoPorCEP, EnderecoViaCep } from "@/utils/api/Cep";

export function EfetivacaoSeguroFiancaForms() {
  const [currentTab, setCurrentTab] = useState("personal");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<EfetivacaoSeguroFianca>({
    id: "",
    id_numero: 0,
    acao: "PENDENTE",
    nome_imobiliaria: "",
    telefone_imobiliaria: "",
    nome_proprietario: "",
    profissao_proprietario: "",
    data_nascimento_proprietario: new Date(),
    rg_proprietario: "",
    estado_civil_proprietario: "SOLTEIRO",
    reside_brasil: "SIM",
    email_proprietario: "",
    finalidade: "RESIDENCIAL",
    cep: "",
    endereco: "",
    numero: 0,
    bairro: "",
    cidade: "",
    estado: "",
    tipo_residencia: "CASA",
    inicio_contrato: new Date(),
    termino_contrato: new Date(),
    pintura_interna: "SIM",
    pintura_externa: "SIM",
    danos_imovel: "SIM",
    multa_rescisao: "SIM",
    fatura_mensal: 0,
    valor_parcela: 0,
    seguradora: "",
    indice_reajuste: "",
    created: new Date(),
    updated: new Date(),
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (
      name === "cpf_inquilino_1" ||
      name === "cpf_inquilino_2" ||
      name === "cpf_proprietario"
    ) {
      formattedValue = formatCPF(value);
    } else if (name === "cnpj_proprietario") {
      formattedValue = formatCNPJ(value);
    } else if (name === "rg_proprietario") {
      formattedValue = formatRG(value);
    } else if (
      name === "telefone_inquilino_1" ||
      name === "telefone_inquilino_2" ||
      name === "telefone_proprietario" ||
      name === "telefone_imobiliaria"
    ) {
      formattedValue = formatTelefone(value);
    } else if (name === "cep") {
      formattedValue = formatCEP(value);

      const cepNumeros = formattedValue.replace(/\D/g, "");

      if (cepNumeros.length === 8) {
        try {
          setIsLoading(true);
          setErrorMessage(""); // Limpa mensagens de erro anteriores

          // Chama a função importada para buscar o endereço
          const data: EnderecoViaCep = await buscaEnderecoPorCEP(cepNumeros);

          // Atualiza os campos de endereço com os dados retornados
          setFormData((prevState) => ({
            ...prevState,
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
            complemento: data.complemento || "",
            [name]: formattedValue, // Atualiza o campo CEP também
          }));
        } catch (error: unknown) {
          console.error("Erro ao buscar o CEP:", error);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Erro ao buscar o CEP. Tente novamente."
          );

          // Limpa os campos de endereço em caso de erro
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
        return; // Saia da função após lidar com o CEP
      } else {
        // Se o CEP tiver menos de 8 dígitos, limpa os campos de endereço
        setFormData((prevState) => ({
          ...prevState,
          endereco: "",
          bairro: "",
          cidade: "",
          estado: "",
          complemento: "",
          [name]: formattedValue,
        }));
        return; // Saia da função
      }
    }

    // Atualiza o estado geral do formulário para os demais campos
    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  const handleSelectChange = (
    name: keyof EfetivacaoSeguroFianca,
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

    setIsLoading(true);
    try {
      await createEfetivacaoSeguroFianca(formData); // Certifique-se de que está chamando a função correta
      console.log("Dados enviados para a criação:", formData);

      // Reseta o formulário e abre o modal de sucesso
      formRef.current?.reset();
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      setErrorMessage(
        "Ocorreu um erro ao enviar o formulário. Tente novamente."
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
          <CardTitle>Seguro Fiança</CardTitle>
          <CardDescription>
            Para concluir a efetivação do Seguro Fiança, solicitamos o
            preenchimento dos dados a seguir:
          </CardDescription>
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
                  Dados
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
                  Endereço
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
                  Imóvel
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
                  Plano
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
                      <Label htmlFor="telefone_imobiliaria">
                        Telefone da Imobiliária <RequiredAsterisk />
                      </Label>
                      <Input
                        id="telefone_imobiliaria"
                        name="telefone_imobiliaria"
                        value={formData.telefone_imobiliaria}
                        onChange={handleInputChange}
                        required
                        type="text"
                        placeholder="Digite o telefone da imobiliária"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_inquilino_1">
                        Nome do Inquilino (1)
                      </Label>
                      <Input
                        id="nome_inquilino_1"
                        name="nome_inquilino_1"
                        value={formData.nome_inquilino_1}
                        onChange={handleInputChange}
                        placeholder="Digite o nome de um inquilino"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf_inquilino_1">
                        CPF do Inquilino (1)
                      </Label>
                      <Input
                        id="cpf_inquilino_1"
                        name="cpf_inquilino_1"
                        value={formData.cpf_inquilino_1}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF do inquilino"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone_inquilino_1">
                        Telefone do Inquilino (1)
                      </Label>
                      <Input
                        id="telefone_inquilino_1"
                        name="telefone_inquilino_1"
                        value={formData.telefone_inquilino_1}
                        onChange={handleInputChange}
                        type="tel"
                        placeholder="Digite o telefone do Inquilino (1)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email_inquilino_1">
                        Email do inquilino (1) <RequiredAsterisk />
                      </Label>
                      <Input
                        id="email_inquilino_1"
                        name="email_inquilino_1"
                        type="email"
                        value={formData.email_inquilino_1}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o email do outro inquilino"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_inquilino_2">
                        Nome do Inquilino (2)
                      </Label>
                      <Input
                        id="nome_inquilino_2"
                        name="nome_inquilino_2"
                        value={formData.nome_inquilino_2}
                        onChange={handleInputChange}
                        placeholder="Digite o nome do outro inquilino"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf_inquilino_2">
                        CPF do Inquilino (2)
                      </Label>
                      <Input
                        id="cpf_inquilino_2"
                        name="cpf_inquilino_2"
                        value={formData.cpf_inquilino_2}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF do outro inquilino"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone_inquilino_2">
                        Telefone do Inquilino (2)
                      </Label>
                      <Input
                        id="telefone_inquilino_2"
                        name="telefone_inquilino_2"
                        value={formData.telefone_inquilino_2}
                        onChange={handleInputChange}
                        type="tel"
                        placeholder="Digite o telefone do Inquilino (2)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email_inquilino_2">
                        Email do inquilino (2)
                      </Label>
                      <Input
                        id="email_inquilino_2"
                        name="email_inquilino_2"
                        type="email"
                        value={formData.email_inquilino_2}
                        onChange={handleInputChange}
                        placeholder="Digite o email do outro inquilino"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_proprietario">
                        Nome do Proprietário <RequiredAsterisk />
                      </Label>
                      <Input
                        id="nome_proprietario"
                        name="nome_proprietario"
                        value={formData.nome_proprietario}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o nome do proprietário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profissao_proprietario">
                        Profissão do Proprietário <RequiredAsterisk />
                      </Label>
                      <Input
                        id="profissao_proprietario"
                        name="profissao_proprietario"
                        value={formData.profissao_proprietario}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite a profissão do proprietário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf_proprietario">
                        CPF do Proprietário
                      </Label>
                      <Input
                        id="cpf_proprietario"
                        name="cpf_proprietario"
                        value={formData.cpf_proprietario}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF do proprietário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj_proprietario">
                        CNPJ do Proprietário
                      </Label>
                      <Input
                        id="cnpj_proprietario"
                        name="cnpj_proprietario"
                        value={formData.cnpj_proprietario}
                        onChange={handleInputChange}
                        placeholder="Digite o CNPJ do proprietário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rg_proprietario">
                        RG do Proprietário <RequiredAsterisk />
                      </Label>
                      <Input
                        id="rg_proprietario"
                        name="rg_proprietario"
                        value={formData.rg_proprietario}
                        onChange={handleInputChange}
                        placeholder="Digite o RG do proprietário"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone_proprietario">
                        Telefone do Proprietário <RequiredAsterisk />
                      </Label>
                      <Input
                        id="telefone_proprietario"
                        name="telefone_proprietario"
                        value={formData.telefone_proprietario}
                        onChange={handleInputChange}
                        required
                        type="tel"
                        placeholder="Digite o telefone do proprietário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email_proprietario">
                        Email do Proprietário <RequiredAsterisk />
                      </Label>
                      <Input
                        id="email_proprietario"
                        name="email_proprietario"
                        type="email"
                        value={formData.email_proprietario}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o email do proprietário"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data_nascimento_proprietario">
                        Data de Nascimento do Proprietário <RequiredAsterisk />
                      </Label>
                      <Input
                        id="data_nascimento_proprietario"
                        name="data_nascimento_proprietario"
                        type="date"
                        value={
                          formData.data_nascimento_proprietario instanceof Date
                            ? formData.data_nascimento_proprietario
                                .toISOString()
                                .split("T")[0]
                            : formData.data_nascimento_proprietario
                        }
                        onChange={handleInputChange}
                        required
                        placeholder="Selecione a data de nascimento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado_civil_proprietario">
                        Estado Civil do Proprietário <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.estado_civil_proprietario}
                        onValueChange={(value) =>
                          handleSelectChange("estado_civil_proprietario", value)
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
                      <Label htmlFor="reside_brasil">
                        Residi no Brasil? <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.reside_brasil}
                        onValueChange={(value) =>
                          handleSelectChange("reside_brasil", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Residi no Brasil?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NÃO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="finalidade">
                      Finalidade <RequiredAsterisk />
                    </Label>
                    <Select
                      value={formData.finalidade}
                      onValueChange={(value) =>
                        handleSelectChange("finalidade", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Finalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RESIDENCIAL">RESIDENCIAL</SelectItem>
                        <SelectItem value="COMERCIAL EMPREENDEDOR">
                          COMERCIAL EMPREENDEDOR
                        </SelectItem>
                        <SelectItem value="COMERCIAL PESSOA JURÍDICA">
                          COMERCIAL PESSOA JURÍDICA
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                      <Label htmlFor="numero">
                        Número <RequiredAsterisk />
                      </Label>
                      <Input
                        id="numero"
                        name="numero"
                        type="text"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo_residencia">
                        Tipo de Residencia <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.tipo_residencia}
                        onValueChange={(value) =>
                          handleSelectChange("tipo_residencia", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo do imóvel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASA">CASA</SelectItem>
                          <SelectItem value="APTO">APARTAMENTO</SelectItem>
                          <SelectItem value="COND. FECHADO">
                            CONDOMÍNIO FECHADO
                          </SelectItem>
                          <SelectItem value="OUTROS">OUTROS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo_residencia_outros">
                        Caso a opcão acima seja OUTROS:
                      </Label>
                      <Input
                        id="tipo_residencia_outros"
                        name="tipo_residencia_outros"
                        type="text"
                        value={formData.tipo_residencia_outros || ""}
                        onChange={handleInputChange}
                        placeholder="Outro tipo de residência"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inicio_contrato">
                        Início do Contrato <RequiredAsterisk />
                      </Label>
                      <Input
                        id="inicio_contrato"
                        name="inicio_contrato"
                        type="date"
                        value={
                          formData.inicio_contrato instanceof Date
                            ? formData.inicio_contrato
                                .toISOString()
                                .split("T")[0]
                            : formData.inicio_contrato
                        }
                        onChange={handleInputChange}
                        required
                        placeholder="Selecione o início do contrato"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="termino_contrato">
                        Término do Contrato <RequiredAsterisk />
                      </Label>
                      <Input
                        id="termino_contrato"
                        name="termino_contrato"
                        type="date"
                        value={
                          formData.termino_contrato instanceof Date
                            ? formData.termino_contrato
                                .toISOString()
                                .split("T")[0]
                            : formData.termino_contrato
                        }
                        onChange={handleInputChange}
                        required
                        placeholder="Selecione o início do contrato"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="">Alguel</Label>
                      <Input
                        id="aluguel"
                        name="aluguel"
                        type="number"
                        value={formData.aluguel || ""}
                        onChange={handleInputChange}
                        placeholder="Valor do Aluguel"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condominio">Condomínio</Label>
                      <Input
                        id="condominio"
                        name="condominio"
                        type="number"
                        value={formData.condominio || ""}
                        onChange={handleInputChange}
                        placeholder="Valor do condominio"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="iptu">IPTU</Label>
                      <Input
                        id="iptu"
                        name="iptu"
                        type="number"
                        value={formData.iptu || ""}
                        onChange={handleInputChange}
                        placeholder="Valor do IPTU"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agua">Água</Label>
                      <Input
                        id="agua"
                        name="agua"
                        type="number"
                        value={formData.agua || ""}
                        onChange={handleInputChange}
                        placeholder="Valor da água"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="luz">Luz</Label>
                      <Input
                        id="luz"
                        name="luz"
                        type="number"
                        value={formData.luz || ""}
                        onChange={handleInputChange}
                        placeholder="Valor de Luz"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gas">Gás</Label>
                      <Input
                        id="gas"
                        name="gas"
                        type="number"
                        value={formData.gas || ""}
                        onChange={handleInputChange}
                        placeholder="Valor do gás"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pintura_interna">
                        Pintura Interna <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.pintura_interna}
                        onValueChange={(value) =>
                          handleSelectChange("pintura_interna", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NÃO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pintura_externa">
                        Pintura Externa <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.pintura_externa}
                        onValueChange={(value) =>
                          handleSelectChange("pintura_externa", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NÃO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="danos_imovel">
                        Danos ao Imóvel <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.danos_imovel}
                        onValueChange={(value) =>
                          handleSelectChange("danos_imovel", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NÃO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="multa_rescisao">
                        Multa por Rescisão <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.multa_rescisao}
                        onValueChange={(value) =>
                          handleSelectChange("multa_rescisao", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NÃO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fatura_mensal">
                        Fatura Mensal <RequiredAsterisk />
                      </Label>
                      <Input
                        id="fatura_mensal"
                        name="fatura_mensal"
                        type="number"
                        value={formData.fatura_mensal || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o valor da fatura mensal"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor_parcela">
                        Valor da Parcela <RequiredAsterisk />
                      </Label>
                      <Input
                        id="valor_parcela"
                        name="valor_parcela"
                        type="number"
                        value={formData.valor_parcela || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o valor da parcela"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seguradora">
                        Seguradora <RequiredAsterisk />
                      </Label>
                      <Input
                        id="seguradora"
                        name="seguradora"
                        type="text"
                        value={formData.seguradora || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o nome da seguradora"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="indice_reajuste">
                        Índice de Reajuste <RequiredAsterisk />
                      </Label>
                      <Input
                        id="indice_reajuste"
                        name="indice_reajuste"
                        value={formData.indice_reajuste || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o índice de reajuste"
                        disabled={isLoading}
                        required
                        type="text"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vencimento_aluguel">
                        Vencimento do Aluguel
                      </Label>
                      <Input
                        id="vencimento_aluguel"
                        name="vencimento_aluguel"
                        type="date"
                        value={
                          formData.vencimento_aluguel instanceof Date
                            ? formData.vencimento_aluguel
                                .toISOString()
                                .split("T")[0]
                            : formData.vencimento_aluguel
                        }
                        onChange={handleInputChange}
                        placeholder="Selecione o início do contrato"
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
