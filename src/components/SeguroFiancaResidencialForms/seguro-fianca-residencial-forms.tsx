import { SeguroFiancaResidencial } from "@/types/SeguroFiancaResidencial"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { formatCPF } from "@/utils/regex/regexCPF"
import { formatCEP } from "@/utils/regex/regexCEP"
import { formatTelefone } from "@/utils/regex/regexTelefone"
import { createSeguroFiancaResidencial } from "@/utils/api/SeguroFiancaResidencialService"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { buscaEnderecoPorCEP, EnderecoViaCep } from "@/utils/api/Cep"
// Importações adicionais que possam estar no seu código original

export function SeguroFiancaResidencialForms() {
  const [currentTab, setCurrentTab] = useState("personal")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState<SeguroFiancaResidencial>({
    id: "",
    id_numero: 0,
    status: "EM ANÁLISE",
    acao: "PENDENTE",
    nome_imobiliaria_corretor: "",
    cpf_residente: "",
    cpf_conjuge: "",
    nome_residente: "",
    telefone: "",
    email: "",
    profissao: "",
    data_nascimento: new Date(),
    residir_imovel: "SIM",
    responder_financeiramente: "SIM",
    estado_civil_residente: "SOLTEIRO",
    renda_composta_conjuge: "NÃO",
    cep_locacao: "",
    endereco_locacao: "",
    bairro_locacao: "",
    cidade_locacao: "",
    estado_locacao: "",
    numero_locacao: "",
    tipo_imovel: "CASA",
    valor_aluguel: 0,
    danos_imovel: "SIM",
    multa_recisao: "SIM",
    pintura_interna: "SIM",
    pintura_externa: "SIM",
    incluir_pretendente: "NÃO",
    data_nascimento_residente_nao: new Date(),
    created: new Date(),
  })

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (
      name === "telefone" ||
      name === "telefone_conjuge" ||
      name === "telefone_residente_nao" ||
      name === "telefone_2" ||
      name === "telefone_conjuge_2" ||
      name === "telefone_residente_nao_2"
    ) {
      formattedValue = formatTelefone(value)
    } else if (
      name === "cpf_residente" ||
      name === "cpf_conjuge" ||
      name === "cpf_residente_nao" ||
      name === "cpf_residente_2" ||
      name === "cpf_conjuge_2" ||
      name === "cpf_residente_nao_2"
    ) {
      formattedValue = formatCPF(value)
    } else if (name === "cep_locacao") {
      formattedValue = formatCEP(value)

      const cepNumeros = formattedValue.replace(/\D/g, "")

      if (cepNumeros.length === 8) {
        try {
          setIsLoading(true)
          setErrorMessage("") // Limpa mensagens de erro anteriores

          // Chama a função importada para buscar o endereço
          const data: EnderecoViaCep = await buscaEnderecoPorCEP(cepNumeros)

          // Atualiza os campos de endereço com os dados retornados
          setFormData((prevState) => ({
            ...prevState,
            endereco_locacao: data.logradouro || "",
            bairro_locacao: data.bairro || "",
            cidade_locacao: data.localidade || "",
            estado_locacao: data.uf || "",
            [name]: formattedValue, // Atualiza o campo CEP também
          }))
        } catch (error: unknown) {
          console.error("Erro ao buscar o CEP:", error)
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Erro ao buscar o CEP. Tente novamente."
          )

          // Limpa os campos de endereço em caso de erro
          setFormData((prevState) => ({
            ...prevState,
            endereco_locacao: "",
            bairro_locacao: "",
            cidade_locacao: "",
            estado_locacao: "",
            [name]: formattedValue,
          }))
        } finally {
          setIsLoading(false)
        }
      } else {
        // Se o CEP tiver menos de 8 dígitos, limpa os campos de endereço
        setFormData((prevState) => ({
          ...prevState,
          endereco_locacao: "",
          bairro_locacao: "",
          cidade_locacao: "",
          estado_locacao: "",
          [name]: formattedValue,
        }))
      }
    } else if (
      [
        "renda_mensal",
        "valor_conta_agua",
        "valor_conta_energia",
        "valor_conta_gas",
        "valor_condominio",
        "valor_iptu",
      ].includes(name)
    ) {
      // Se você tiver funções de formatação para valores monetários, pode usá-las aqui
      // formattedValue = formatValor(value);
    } else if (name === "data_nascimento") {
      // Manter o valor da data sem formatação adicional
      formattedValue = value
    }

    // Atualiza o estado geral do formulário
    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }))
  }

  const handleSelectChange = (
    name: keyof SeguroFiancaResidencial,
    value: string | number | Date
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleNext = () => {
    const tabs = ["personal", "address", "payment"]
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const tabs = ["personal", "address", "payment"]
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // console.log("handleSubmit acionado com dados:", formData)

    // Função de validação
    const validateForm = () => {
      const errors: string[] = []
      if (!formData.nome_imobiliaria_corretor)
        errors.push("Nome da Imobiliária/Corretor")
      if (!formData.cpf_residente) errors.push("CPF do Residente")
      if (!formData.nome_residente) errors.push("Nome do Residente")
      if (!formData.telefone) errors.push("Telefone")
      if (!formData.email) errors.push("Email")
      if (!formData.profissao) errors.push("Profissão")
      if (!formData.data_nascimento) errors.push("Data de Nascimento")
      if (!formData.residir_imovel) errors.push("Reside no Imóvel")
      if (!formData.renda_mensal) errors.push("Renda Mensal do Pretendente")
      if (!formData.responder_financeiramente)
        errors.push("Responde Financeiramente")
      if (!formData.estado_civil_residente)
        errors.push("Estado Civil do Residente")
      if (!formData.renda_composta_conjuge)
        errors.push("Renda Composta do Cônjuge")
      if (!formData.incluir_pretendente)
        errors.push("Incluir um 2º Pretendente")
      if (!formData.cep_locacao) errors.push("CEP")
      if (!formData.endereco_locacao) errors.push("Endereço")
      if (!formData.bairro_locacao) errors.push("Bairro")
      if (!formData.cidade_locacao) errors.push("Cidade")
      if (!formData.estado_locacao) errors.push("Estado")
      if (!formData.numero_locacao) errors.push("Número")
      if (!formData.valor_aluguel) errors.push("Valor do Aluguel")
      if (!formData.danos_imovel) errors.push("Danos ao Imóvel")
      if (!formData.multa_recisao) errors.push("Multa por Recisão")
      if (!formData.pintura_interna) errors.push("Pintura Interna")
      if (!formData.pintura_externa) errors.push("Pintura Externa")
      if (!formData.data_nascimento_residente_nao)
        errors.push("Data de Nascimento do Residente Não")

      return errors
    }

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrorMessage(
        `Ocorreu um erro ao enviar o formulário. Verifique se você preencheu todos os campos obrigatórios e se digitou os campos. Campos obrigatórios que faltam: ${validationErrors.join(
          ", "
        )}`
      )
      return
    }

    setIsLoading(true)
    try {
      await createSeguroFiancaResidencial(formData) // Certifique-se de que está chamando a função correta
      // console.log("Dados enviados para criação:", formData)

      // Reseta o formulário e abre o modal de sucesso
      formRef.current?.reset()
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error)
      setErrorMessage(
        "Ocorreu um erro ao enviar o formulário. Verifique se você preencheu todos os campos obrigatórios e se digitou campos de email corretamente. Tente novamente."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const RequiredAsterisk = () => <span className="text-red-500">*</span>

  return (
    <div className="mb-40 flex justify-center">
      <Card className="w-full max-w-4xl md:mx-10 sm:mx-10">
        <CardHeader className="mb-5">
          <CardTitle>Seguro Fiança: Finalidade Residencial</CardTitle>
          <CardDescription>
            Para concluir a análise do Seguro Fiança Residencial, solicitamos o
            preenchimento dos dados a seguir:
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
                  Dados do Pretendente
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
                  disabled={
                    (formData.estado_civil_residente === "CASADO" &&
                      (formData.nome_conjuge === "" ||
                        formData.cpf_conjuge === "")) ||
                    (formData.incluir_pretendente === "SIM" &&
                      formData.estado_civil_residente_2 === "CASADO" &&
                      (formData.nome_conjuge_2 === "" ||
                        formData.cpf_conjuge_2 === "")) ||
                    (formData.renda_composta_conjuge === "SIM" &&
                      (formData.profissao_conjuge_opcional === "" ||
                        formData.renda_mensal_conjuge_opcional === "" ||
                        formData.telefone_conjuge === "" ||
                        formData.email_conjuge === ""))
                  }
                >
                  Dados da Locação Pretendida
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
                  disabled={
                    (formData.estado_civil_residente === "CASADO" &&
                      (formData.nome_conjuge === "" ||
                        formData.cpf_conjuge === "")) ||
                    (formData.incluir_pretendente === "SIM" &&
                      formData.estado_civil_residente_2 === "CASADO" &&
                      (formData.nome_conjuge_2 === "" ||
                        formData.cpf_conjuge_2 === "")) ||
                    (formData.renda_composta_conjuge === "SIM" &&
                      (formData.profissao_conjuge_opcional === "" ||
                        formData.renda_mensal_conjuge_opcional === "" ||
                        formData.telefone_conjuge === "" ||
                        formData.email_conjuge === ""))
                  }
                >
                  Coberturas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <div className="grid gap-4 py-4">
                  {/* PRIMEIRO PRETENDENTRE */}
                  <>
                    {formData.incluir_pretendente === "SIM" && (
                      <>
                        <h1 style={{ fontWeight: "bold", fontSize: "1.5em" }}>
                          Dados do 1º Pretendente
                        </h1>
                      </>
                    )}

                    {/* Informações da Imobiliária/Corretor */}
                    <div className="space-y-2">
                      <Label htmlFor="nome_imobiliaria">
                        Nome da Imobiliária/Corretor <RequiredAsterisk />
                      </Label>
                      <Input
                        id="nome_imobiliaria_corretor"
                        name="nome_imobiliaria_corretor"
                        value={formData.nome_imobiliaria_corretor}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o nome da imobiliária ou corretor"
                      />
                    </div>

                    {/* Informações Pessoais do Pretendente */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome_residente">
                          Nome do Pretendente <RequiredAsterisk />
                        </Label>
                        <Input
                          id="nome_residente"
                          name="nome_residente"
                          value={formData.nome_residente}
                          onChange={handleInputChange}
                          required
                          placeholder="Digite o nome do pretendente"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf_residente">
                          CPF do Pretendente <RequiredAsterisk />
                        </Label>
                        <Input
                          id="cpf_residente"
                          name="cpf_residente"
                          value={formData.cpf_residente}
                          onChange={handleInputChange}
                          required
                          placeholder="Digite o CPF do pretendente"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email_imobiliaria">
                          Email do Pretendente
                          <RequiredAsterisk />
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Digite o email do pretendente"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">
                          Telefone do Pretendente
                          <RequiredAsterisk />
                        </Label>
                        <Input
                          id="telefone"
                          name="telefone"
                          type="telefone"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          required
                          placeholder="Digite o telefone do pretendente"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="data_nascimento">
                          Data de Nascimento do Pretendente <RequiredAsterisk />
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
                          placeholder="Selecione a data de nascimento"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado_civil">
                          Estado Civil do Pretendente <RequiredAsterisk />
                        </Label>
                        <Select
                          value={formData.estado_civil_residente}
                          onValueChange={(value) =>
                            handleSelectChange("estado_civil_residente", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado civil do pretendente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SOLTEIRO">Solteiro</SelectItem>
                            <SelectItem value="CASADO">Casado</SelectItem>
                            <SelectItem value="VIÚVO">Viúvo</SelectItem>
                            <SelectItem value="DIVORCIADO">
                              Divorciado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profissao">
                          Profissão do Pretendente
                          <RequiredAsterisk />
                        </Label>
                        <Input
                          id="profissao"
                          name="profissao"
                          value={formData.profissao}
                          onChange={handleInputChange}
                          required
                          placeholder="Digite a profissão do pretendente"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="renda_mensal">
                          Renda Mensal do Pretendente <RequiredAsterisk />
                        </Label>
                        <Input
                          id="renda_mensal"
                          name="renda_mensal"
                          type="number"
                          value={formData.renda_mensal}
                          onChange={handleInputChange}
                          placeholder="Digite a renda mensal do pretendente"
                          required
                        />
                      </div>
                    </div>

                    {/* Outras Informações */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="residir_imovel">
                          Reside no Imóvel? <RequiredAsterisk />
                        </Label>
                        <Select
                          value={formData.residir_imovel}
                          onValueChange={(value) =>
                            handleSelectChange("residir_imovel", value)
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Reside no imóvel?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SIM">SIM</SelectItem>
                            <SelectItem value="NÃO">NÃO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responder_financeiramente">
                          Responde Financeiramente? <RequiredAsterisk />
                        </Label>
                        <Select
                          value={formData.responder_financeiramente}
                          onValueChange={(value) =>
                            handleSelectChange(
                              "responder_financeiramente",
                              value
                            )
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Responde Financeiramente?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SIM">SIM</SelectItem>
                            <SelectItem value="NÃO">NÃO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Informações Pessoais do Residente */}
                    {formData.residir_imovel === "NÃO" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome_residente_nao">
                            Nome do Residente <RequiredAsterisk />
                          </Label>
                          <Input
                            id="nome_residente_nao"
                            name="nome_residente_nao"
                            value={formData.nome_residente_nao}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite o nome do residente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cpf_residente_nao">
                            CPF do Residente <RequiredAsterisk />
                          </Label>
                          <Input
                            id="cpf_residente_nao"
                            name="cpf_residente_nao"
                            value={formData.cpf_residente_nao}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite o CPF do residente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="data_nascimento_residente_nao">
                            Data de Nascimento do Residente <RequiredAsterisk />
                          </Label>
                          <Input
                            id="data_nascimento_residente_nao"
                            name="data_nascimento_residente_nao"
                            type="date"
                            value={
                              formData.data_nascimento_residente_nao instanceof
                              Date
                                ? formData.data_nascimento_residente_nao
                                    .toISOString()
                                    .split("T")[0]
                                : formData.data_nascimento_residente_nao
                            }
                            onChange={handleInputChange}
                            required
                            placeholder="Selecione a data de nascimento"
                          />
                        </div>
                        {/* <div className="space-y-2">
                      <Label htmlFor="estado_civil">
                        Estado Civil do Residente <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.estado_civil_residente}
                        onValueChange={(value) =>
                          handleSelectChange("estado_civil_residente", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado civil do residente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOLTEIRO">Solteiro</SelectItem>
                          <SelectItem value="CASADO">Casado</SelectItem>
                          <SelectItem value="VIÚVO">Viúvo</SelectItem>
                          <SelectItem value="DIVORCIADO">Divorciado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                        <div className="space-y-2">
                          <Label htmlFor="profissao_residente_nao">
                            Profissão do Residente <RequiredAsterisk />
                          </Label>
                          <Input
                            id="profissao_residente_nao"
                            name="profissao_residente_nao"
                            value={formData.profissao_residente_nao}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite a profissão do residente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="renda_mensal_residente_nao">
                            Renda Mensal do Residente <RequiredAsterisk />
                          </Label>
                          <Input
                            id="renda_mensal_residente_nao"
                            name="renda_mensal_residente_nao"
                            type="number"
                            value={formData.renda_mensal_residente_nao}
                            onChange={handleInputChange}
                            placeholder="Digite a renda mensal do residente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email_residente_nao">
                            Email do Residente <RequiredAsterisk />
                          </Label>
                          <Input
                            id="email_residente_nao"
                            name="email_residente_nao"
                            type="email"
                            value={formData.email_residente_nao}
                            onChange={handleInputChange}
                            placeholder="Digite o email do residente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone_residente_nao">
                            Telefone do Residente <RequiredAsterisk />
                          </Label>
                          <Input
                            id="telefone_residente_nao"
                            name="telefone_residente_nao"
                            type="text"
                            value={formData.telefone_residente_nao}
                            onChange={handleInputChange}
                            placeholder="Digite o telefone do residente"
                          />
                        </div>
                      </div>
                    )}

                    {/* Informações do Cônjuge */}
                    {formData.estado_civil_residente === "CASADO" && (
                      <>
                        <h3 className="mt-4">
                          {" "}
                          <strong>
                            Preencha os campos obrigatórios <RequiredAsterisk />
                            abaixo:{" "}
                          </strong>{" "}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="renda_composta_conjuge">
                              Cônjuge vai compor a renda? <RequiredAsterisk />
                            </Label>
                            <Select
                              value={formData.renda_composta_conjuge}
                              onValueChange={(value) =>
                                handleSelectChange(
                                  "renda_composta_conjuge",
                                  value
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Renda Composta do Cônjuge?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SIM">SIM</SelectItem>
                                <SelectItem value="NÃO">NÃO</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nome_conjuge">
                              Nome do Cônjuge <RequiredAsterisk />
                            </Label>
                            <Input
                              id="nome_conjuge"
                              name="nome_conjuge"
                              value={formData.nome_conjuge}
                              onChange={handleInputChange}
                              placeholder="Digite o nome do conjuge"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cpf_conjuge">
                              CPF do Cônjuge <RequiredAsterisk />
                            </Label>
                            <Input
                              id="cpf_conjuge"
                              name="cpf_conjuge"
                              value={formData.cpf_conjuge}
                              onChange={handleInputChange}
                              placeholder="Digite o CPF do conjuge"
                            />
                          </div>

                          {formData.renda_composta_conjuge === "SIM" && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="profissao_conjuge_opcional">
                                  Profissão do Cônjuge <RequiredAsterisk />
                                </Label>
                                <Input
                                  id="profissao_conjuge_opcional"
                                  name="profissao_conjuge_opcional"
                                  value={formData.profissao_conjuge_opcional}
                                  onChange={handleInputChange}
                                  placeholder="Digite a profissão do cônjuge"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="renda_mensal_conjuge_opcional">
                                  Renda Mensal do Cônjuge <RequiredAsterisk />
                                </Label>
                                <Input
                                  id="renda_mensal_conjuge_opcional"
                                  name="renda_mensal_conjuge_opcional"
                                  value={formData.renda_mensal_conjuge_opcional}
                                  onChange={handleInputChange}
                                  placeholder="Digite a renda mensal do cônjuge"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="telefone_conjuge">
                                  Telefone do Cônjuge
                                  <RequiredAsterisk />
                                </Label>
                                <Input
                                  id="telefone_conjuge"
                                  name="telefone_conjuge"
                                  type="telefone_conjuge"
                                  value={formData.telefone_conjuge}
                                  onChange={handleInputChange}
                                  // required
                                  placeholder="Digite o telefone"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email_conjuge">
                                  Email do Cônjuge
                                  <RequiredAsterisk />
                                </Label>
                                <Input
                                  id="email_conjuge"
                                  name="email_conjuge"
                                  type="email"
                                  value={formData.email_conjuge}
                                  onChange={handleInputChange}
                                  // required
                                  placeholder="Digite o email do cônjuge"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </>

                  <div className="space-y-2">
                    <div className="space-y-2">
                      <Label htmlFor="incluir_pretendente">
                        Deseja Incluir um 2º Pretendente? <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.incluir_pretendente}
                        onValueChange={(value) =>
                          handleSelectChange("incluir_pretendente", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Incluir um 2º Pretendente?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NÃO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* SEGUNDO PRETENDENTE */}
                  {formData.incluir_pretendente === "SIM" && (
                    <>
                      <>
                        <h1
                          className="mt-4"
                          style={{ fontWeight: "bold", fontSize: "1.5em" }}
                        >
                          Dados do 2º Pretendente
                        </h1>
                      </>

                      {/* <div className="space-y-2">
                        <Label htmlFor="nome_imobiliaria_corretor_2">
                          Nome da Imobiliária/Corretor <RequiredAsterisk />
                        </Label>
                        <Input
                          id="nome_imobiliaria_corretor_2"
                          name="nome_imobiliaria_corretor_2"
                          value={formData.nome_imobiliaria_corretor_2}
                          onChange={handleInputChange}
                          placeholder="Digite o nome da imobiliária ou corretor"
                        />
                      </div> */}

                      {/* Informações Pessoais do Pretendente */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome_residente_2">
                            Nome do Pretendente 2 <RequiredAsterisk />
                          </Label>
                          <Input
                            id="nome_residente_2"
                            name="nome_residente_2"
                            value={formData.nome_residente_2}
                            onChange={handleInputChange}
                            placeholder="Digite o nome do pretendente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cpf_residente_2">
                            CPF do Pretendente 2 <RequiredAsterisk />
                          </Label>
                          <Input
                            id="cpf_residente_2"
                            name="cpf_residente_2"
                            value={formData.cpf_residente_2}
                            onChange={handleInputChange}
                            placeholder="Digite o CPF do pretendente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email_2">
                            Email do Pretendente 2 <RequiredAsterisk />
                          </Label>
                          <Input
                            id="email_2"
                            name="email_2"
                            type="email"
                            value={formData.email_2}
                            onChange={handleInputChange}
                            placeholder="Digite o email do pretendente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone_2">
                            Telefone do Pretendente 2 <RequiredAsterisk />
                          </Label>
                          <Input
                            id="telefone_2"
                            name="telefone_2"
                            type="text"
                            value={formData.telefone_2}
                            onChange={handleInputChange}
                            placeholder="Digite o telefone do pretendente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="data_nascimento_2">
                            Data de Nascimento do Pretendente 2{" "}
                            <RequiredAsterisk />
                          </Label>
                          <Input
                            id="data_nascimento_2"
                            name="data_nascimento_2"
                            type="date"
                            value={
                              formData.data_nascimento_2 instanceof Date
                                ? formData.data_nascimento_2
                                    .toISOString()
                                    .split("T")[0]
                                : formData.data_nascimento_2
                            }
                            onChange={handleInputChange}
                            placeholder="Selecione a data de nascimento"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estado_civil_residente_2">
                            Estado Civil do Pretendente 2 <RequiredAsterisk />
                          </Label>
                          <Select
                            value={formData.estado_civil_residente_2}
                            onValueChange={(value) =>
                              handleSelectChange(
                                "estado_civil_residente_2",
                                value
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado civil do pretendente" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SOLTEIRO">Solteiro</SelectItem>
                              <SelectItem value="CASADO">Casado</SelectItem>
                              <SelectItem value="VIÚVO">Viúvo</SelectItem>
                              <SelectItem value="DIVORCIADO">
                                Divorciado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profissao_2">
                            Profissão do Pretendente 2 <RequiredAsterisk />
                          </Label>
                          <Input
                            id="profissao_2"
                            name="profissao_2"
                            value={formData.profissao_2}
                            onChange={handleInputChange}
                            placeholder="Digite a profissão do pretendente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="renda_mensal_2">
                            Renda Mensal do Pretendente 2 <RequiredAsterisk />
                          </Label>
                          <Input
                            id="renda_mensal_2"
                            name="renda_mensal_2"
                            type="number"
                            value={formData.renda_mensal_2}
                            onChange={handleInputChange}
                            placeholder="Digite a renda mensal do pretendente"
                          />
                        </div>
                      </div>

                      {/* Outras Informações */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="residir_imovel_2">
                            Reside no Imóvel? <RequiredAsterisk />
                          </Label>
                          <Select
                            value={formData.residir_imovel_2}
                            onValueChange={(value) =>
                              handleSelectChange("residir_imovel_2", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Reside no imóvel?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SIM">SIM</SelectItem>
                              <SelectItem value="NÃO">NÃO</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="responder_financeiramente_2">
                            Responde Financeiramente? <RequiredAsterisk />
                          </Label>
                          <Select
                            value={formData.responder_financeiramente_2}
                            onValueChange={(value) =>
                              handleSelectChange(
                                "responder_financeiramente_2",
                                value
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Responde Financeiramente?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SIM">SIM</SelectItem>
                              <SelectItem value="NÃO">NÃO</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Informações Pessoais do Residente */}
                      {formData.residir_imovel_2 === "NÃO" && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nome_residente_nao_2">
                              Nome do Residente <RequiredAsterisk />
                            </Label>
                            <Input
                              id="nome_residente_nao_2"
                              name="nome_residente_nao_2"
                              value={formData.nome_residente_nao_2}
                              onChange={handleInputChange}
                              placeholder="Digite o nome do residente"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cpf_residente_nao_2">
                              CPF do Residente <RequiredAsterisk />
                            </Label>
                            <Input
                              id="cpf_residente_nao_2"
                              name="cpf_residente_nao_2"
                              value={formData.cpf_residente_nao_2}
                              onChange={handleInputChange}
                              placeholder="Digite o CPF do residente"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="data_nascimento_residente_nao_2">
                              Data de Nascimento do Residente{" "}
                              <RequiredAsterisk />
                            </Label>
                            <Input
                              id="data_nascimento_residente_nao_2"
                              name="data_nascimento_residente_nao_2"
                              type="date"
                              value={
                                formData.data_nascimento_residente_nao_2 instanceof
                                Date
                                  ? formData.data_nascimento_residente_nao_2
                                      .toISOString()
                                      .split("T")[0]
                                  : formData.data_nascimento_residente_nao_2
                              }
                              onChange={handleInputChange}
                              placeholder="Selecione a data de nascimento"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profissao_residente_nao_2">
                              Profissão do Residente <RequiredAsterisk />
                            </Label>
                            <Input
                              id="profissao_residente_nao_2"
                              name="profissao_residente_nao_2"
                              value={formData.profissao_residente_nao_2}
                              onChange={handleInputChange}
                              placeholder="Digite a profissão do residente"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="renda_mensal_residente_nao_2">
                              Renda Mensal do Residente <RequiredAsterisk />
                            </Label>
                            <Input
                              id="renda_mensal_residente_nao_2"
                              name="renda_mensal_residente_nao_2"
                              type="number"
                              value={formData.renda_mensal_residente_nao_2}
                              onChange={handleInputChange}
                              placeholder="Digite a renda mensal do residente"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email_residente_nao_2">
                              Email do Residente <RequiredAsterisk />
                            </Label>
                            <Input
                              id="email_residente_nao_2"
                              name="email_residente_nao_2"
                              type="email"
                              value={formData.email_residente_nao_2}
                              onChange={handleInputChange}
                              placeholder="Digite o email do residente"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telefone_residente_nao_2">
                              Telefone do Residente <RequiredAsterisk />
                            </Label>
                            <Input
                              id="telefone_residente_nao_2"
                              name="telefone_residente_nao_2"
                              type="text"
                              value={formData.telefone_residente_nao_2}
                              onChange={handleInputChange}
                              placeholder="Digite o telefone do residente"
                            />
                          </div>
                        </div>
                      )}

                      {/* Informações do Cônjuge */}
                      {formData.estado_civil_residente_2 === "CASADO" && (
                        <>
                          <h3 className="mt-4">
                            {" "}
                            Preencha os campos obrigatórios{" "}
                            <strong>
                              <RequiredAsterisk />
                            </strong>{" "}
                            abaixo:{" "}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="renda_composta_conjuge_2">
                                Cônjuge vai compor a renda? <RequiredAsterisk />
                              </Label>
                              <Select
                                value={formData.renda_composta_conjuge_2}
                                onValueChange={(value) =>
                                  handleSelectChange(
                                    "renda_composta_conjuge_2",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Renda Composta do Cônjuge?" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SIM">SIM</SelectItem>
                                  <SelectItem value="NÃO">NÃO</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="nome_conjuge_2">
                                Nome do Cônjuge <RequiredAsterisk />
                              </Label>
                              <Input
                                id="nome_conjuge_2"
                                name="nome_conjuge_2"
                                value={formData.nome_conjuge_2}
                                onChange={handleInputChange}
                                placeholder="Digite o nome do conjuge"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="cpf_conjuge_2">
                                CPF do Cônjuge <RequiredAsterisk />
                              </Label>
                              <Input
                                id="cpf_conjuge_2"
                                name="cpf_conjuge_2"
                                value={formData.cpf_conjuge_2}
                                onChange={handleInputChange}
                                placeholder="Digite o CPF do conjuge"
                              />
                            </div>

                            {formData.renda_composta_conjuge_2 === "SIM" && (
                              <>
                                <div className="space-y-2">
                                  <Label htmlFor="profissao_conjuge_opcional_2">
                                    Profissão do Cônjuge <RequiredAsterisk />
                                  </Label>
                                  <Input
                                    id="profissao_conjuge_opcional_2"
                                    name="profissao_conjuge_opcional_2"
                                    value={
                                      formData.profissao_conjuge_opcional_2
                                    }
                                    onChange={handleInputChange}
                                    placeholder="Digite a profissão do cônjuge"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="renda_mensal_conjuge_opcional_2">
                                    Renda Mensal do Cônjuge <RequiredAsterisk />
                                  </Label>
                                  <Input
                                    id="renda_mensal_conjuge_opcional_2"
                                    name="renda_mensal_conjuge_opcional_2"
                                    value={
                                      formData.renda_mensal_conjuge_opcional_2
                                    }
                                    onChange={handleInputChange}
                                    placeholder="Digite a renda mensal do cônjuge"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="telefone_conjuge_2">
                                    Telefone do Cônjuge
                                    <RequiredAsterisk />
                                  </Label>
                                  <Input
                                    id="telefone_conjuge_2"
                                    name="telefone_conjuge_2"
                                    type="text"
                                    value={formData.telefone_conjuge_2}
                                    onChange={handleInputChange}
                                    // required
                                    placeholder="Digite o telefone"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email_conjuge_2">
                                    Email do Cônjuge
                                    <RequiredAsterisk />
                                  </Label>
                                  <Input
                                    id="email_conjuge_2"
                                    name="email_conjuge_2"
                                    type="email"
                                    value={formData.email_conjuge_2}
                                    onChange={handleInputChange}
                                    // required
                                    placeholder="Digite o email do cônjuge"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="address">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep_locacao">
                        CEP <RequiredAsterisk />
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="cep_locacao"
                          name="cep_locacao"
                          value={formData.cep_locacao}
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
                      <Label htmlFor="endereco_locacao">
                        Endereço <RequiredAsterisk />
                      </Label>
                      <Input
                        id="endereco_locacao"
                        name="endereco_locacao"
                        value={formData.endereco_locacao}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o endereço"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero_locacao">
                        Número <RequiredAsterisk />
                      </Label>
                      <Input
                        id="numero_locacao"
                        name="numero_locacao"
                        type="text"
                        value={formData.numero_locacao || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o número"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro_locacao">
                        Bairro <RequiredAsterisk />
                      </Label>
                      <Input
                        id="bairro_locacao"
                        name="bairro_locacao"
                        value={formData.bairro_locacao}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o bairro"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo_imovel">
                        Tipo do Imóvel <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.tipo_imovel}
                        onValueChange={(value) =>
                          handleSelectChange("tipo_imovel", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo do Imóvel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASA">CASA</SelectItem>
                          <SelectItem value="APTO">APTO</SelectItem>
                          <SelectItem value="CASA CONDOMÍNIO">
                            CASA CONDOMÍNIO
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complemento_locacao">Complemento</Label>
                      <Input
                        id="complemento_locacao"
                        name="complemento_locacao"
                        value={formData.complemento_locacao || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o complemento"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade_locacao">
                        Cidade <RequiredAsterisk />
                      </Label>
                      <Input
                        id="cidade_locacao"
                        name="cidade_locacao"
                        value={formData.cidade_locacao}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite a cidade"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado_locacao">
                        Estado <RequiredAsterisk />
                      </Label>
                      <Input
                        id="estado_locacao"
                        name="estado_locacao"
                        value={formData.estado_locacao}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o estado"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor_aluguel">
                        Aluguel <RequiredAsterisk />
                      </Label>
                      <Input
                        id="valor_aluguel"
                        name="valor_aluguel"
                        type="number"
                        value={formData.valor_aluguel || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o valor do alguel"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor_conta_energia">Energia</Label>
                      <Input
                        id="valor_conta_energia"
                        name="valor_conta_energia"
                        type="number"
                        value={formData.valor_conta_energia || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor da conta de energia"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor_conta_agua">Água</Label>
                      <Input
                        id="valor_conta_agua"
                        name="valor_conta_agua"
                        type="number"
                        value={formData.valor_conta_agua || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor da conta de água"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor_conta_gas">Gás</Label>
                      <Input
                        id="valor_conta_gas"
                        name="valor_conta_gas"
                        type="number"
                        value={formData.valor_conta_gas || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor da conta de gás"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valor_condominio">Condomínio</Label>
                      <Input
                        id="valor_condominio"
                        name="valor_condominio"
                        type="number"
                        value={formData.valor_condominio || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor do condomínio"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="valor_iptu">IPTU </Label>
                      <Input
                        id="valor_iptu"
                        name="valor_iptu"
                        type="number"
                        value={formData.valor_iptu || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o valor do IPTU"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="danos_imovel">
                        Danos ao imóvel <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.danos_imovel}
                        onValueChange={(value) =>
                          handleSelectChange("danos_imovel", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Danos ao imóvel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NÃO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="multa_recisao">
                        Multa por Rescisão <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.multa_recisao}
                        onValueChange={(value) =>
                          handleSelectChange("multa_recisao", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Multa por Recisão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NÃO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          <SelectValue placeholder="Pintura Interna" />
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
                          <SelectValue placeholder="Pintura Externa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SIM">SIM</SelectItem>
                          <SelectItem value="NÃO">NÃO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4 mt-1">
                    <h2>
                      {" "}
                      <RequiredAsterisk /> A Pintura somente será indenizada se
                      o Laudo de Vistoria Inicial informar especificamente que o
                      imóvel foi entregue com Pintura NOVA.
                    </h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacao">Observação </Label>
                    <Input
                      id="observacao"
                      name="observacao"
                      type="text"
                      value={formData.observacao || ""}
                      onChange={handleInputChange}
                      placeholder="Digite sua observação"
                      disabled={isLoading}
                    />
                  </div>

                  {/* CHECKBOX */}
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

            {/* {currentTab === "personal" && (
              <>
                {formData.estado_civil_residente === "CASADO" &&
                (formData.nome_conjuge === "" ||
                  formData.cpf_conjuge === "") ? (
                  <Button
                    type="button"
                    disabled
                    className="ml-auto bg-gray-400 text-white shadow"
                  >
                    Próximo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto bg-[#00612B] text-white shadow hover:bg-[#02693E] focus-visible:ring-[#02693E] hover:bg-green-500"
                  >
                    Próximo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </>
            )} */}

            {currentTab === "personal" && (
              <>
                {(formData.estado_civil_residente === "CASADO" &&
                  (formData.nome_conjuge === "" ||
                    formData.cpf_conjuge === "")) ||
                (formData.incluir_pretendente === "SIM" &&
                  formData.estado_civil_residente_2 === "CASADO" &&
                  (formData.nome_conjuge_2 === "" ||
                    formData.cpf_conjuge_2 === "")) ||
                (formData.renda_composta_conjuge === "SIM" &&
                  (formData.profissao_conjuge_opcional === "" ||
                    formData.renda_mensal_conjuge_opcional === "" ||
                    formData.telefone_conjuge === "" ||
                    formData.email_conjuge === "")) ? (
                  <Button
                    type="button"
                    disabled
                    className="ml-auto bg-gray-400 text-white shadow"
                  >
                    Próximo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto bg-[#00612B] text-white shadow hover:bg-[#02693E] focus-visible:ring-[#02693E] hover:bg-green-500"
                  >
                    Próximo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </>
            )}

            {currentTab !== "payment" && currentTab !== "personal" && (
              <Button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-[#00612B] text-white shadow hover:bg-[#02693E] focus-visible:ring-[#02693E] hover:bg-green-500"
              >
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {currentTab === "payment" && (
              <Button
                type="submit"
                disabled={!agreedToTerms || isLoading}
                className="ml-auto bg-green-700 hover:bg-green-600"
              >
                {isLoading ? "Carregando..." : "Finalizar"}
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
          {/* <div className="flex justify-center my-4">
            <div className="w-24 h-24 flex items-center justify-center my-5">
              <img src={pivaLogo} alt="Piva" className="w-24 h-24 " />
            </div>
          </div> */}
          <DialogDescription>
            Seus dados foram enviados com sucesso. Nossa equipe entrará em
            contato em breve.
          </DialogDescription>
          <Button
            onClick={() => {
              setIsSuccessModalOpen(false)
              navigate("/imobiliaria/formulario")
            }}
            className="w-full mt-4 bg-green-700 hover:bg-green-600"
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
