import { CancelamentoSeguros } from "@/types/CancelamentoSeguros"
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
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Send,
  Loader2,
  FileText,
  Upload,
  Trash2,
  Ban,
} from "lucide-react"
import { formatCPF } from "@/utils/regex/regexCPF"
import { formatCEP } from "@/utils/regex/regexCEP"
import { createCancelamentoSeguros } from "@/utils/api/CancelamentoSeguros"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileX } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { buscaEnderecoPorCEP, EnderecoViaCep } from "@/utils/api/Cep"

export function CancelamentoSegurosForms() {
  const [currentTab, setCurrentTab] = useState("locatario")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string>("")
  const [showProtocolsBanner, setShowProtocolsBanner] = useState(
    () => !localStorage.getItem("protocolosBannerDismissed")
  )

  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState<CancelamentoSeguros>({
    id: "",
    id_numero: 0,
    acao: "PENDENTE",
    nome_imobiliaria: "",
    nome_inquilino: "",
    cpf_inquilino: "",
    nome_proprietario: "",
    cpf_proprietario: "",

    cep: "",
    endereco: "",
    bairro: "",
    numero_endereco: 0,
    cidade: "",
    estado: "",

    tipo_seguro: "SEGURO FIANÇA",
    pdf_field: [],
    created: new Date(),
  })

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cpf_inquilino" || name === "cpf_proprietario") {
      formattedValue = formatCPF(value)
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }))
    } else if (name === "cep") {
      formattedValue = formatCEP(value)

      const cepNumeros = formattedValue.replace(/\D/g, "")

      if (cepNumeros.length === 8) {
        try {
          setIsLoading(true)
          setErrorMessage("")

          const data: EnderecoViaCep = await buscaEnderecoPorCEP(cepNumeros)

          setFormData((prevState) => ({
            ...prevState,
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
            complemento: data.complemento || "",
            [name]: formattedValue,
          }))
        } catch (error: unknown) {
          console.error("Erro ao buscar o CEP:", error)
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Erro ao buscar o CEP. Tente novamente."
          )

          setFormData((prevState) => ({
            ...prevState,
            endereco: "",
            bairro: "",
            cidade: "",
            estado: "",
            complemento: "",
            [name]: formattedValue,
          }))
        } finally {
          setIsLoading(false)
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
        }))
      }
    } else if (["numero_endereco", "id_numero"].includes(name)) {
      const numericValue = Number(value)
      setFormData((prevState) => ({
        ...prevState,
        [name]: numericValue,
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }))
    }
  }

  const handleSelectChange = (
    name: keyof CancelamentoSeguros,
    value: string | number | Date
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleNext = () => {
    const tabs = ["locatario", "locacao", "proprietario"]
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const tabs = ["locatario", "locacao", "proprietario"]
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Verifique se o handleSubmit está sendo acionado
    // console.log("handleSubmit acionado com dados:", formData);

    // Função de validação
    const validateForm = () => {
      const errors: string[] = []

      // Validação baseada no tipo CancelamentoSeguros (excluindo created, acao, id, id_numero)
      if (!formData.nome_imobiliaria) errors.push("Nome da Imobiliária")
      if (!formData.nome_inquilino) errors.push("Nome do Inquilino")
      if (!formData.cpf_inquilino) errors.push("CPF do Inquilino")
      if (!formData.nome_proprietario) errors.push("Nome do Proprietário")
      if (!formData.cpf_proprietario) errors.push("CPF do Proprietário")
      if (!formData.cep) errors.push("CEP")
      if (!formData.endereco) errors.push("Endereço")
      if (!formData.bairro) errors.push("Bairro")
      if (!formData.numero_endereco) errors.push("Número")
      if (!formData.cidade) errors.push("Cidade")
      if (!formData.estado) errors.push("Estado")
      if (!formData.tipo_seguro) errors.push("Tipo de Seguro")

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

    // Validação: é obrigatório anexar pelo menos 1 PDF
    if (selectedFiles.length < 1) {
      setFileError("Anexe pelo menos 1 PDF para enviar.")
      setCurrentTab("proprietario")
      return
    }

    setIsLoading(true)
    try {
      await createCancelamentoSeguros(formData, selectedFiles) // Envia dados com PDFs
      // console.log("Dados enviados para criação:", formData);

      // Reseta o formulário e abre o modal de sucesso
      formRef.current?.reset()
      setSelectedFiles([])
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

  // Dropzone config for up to 3 PDFs with dedup by name+size
  const onDrop = (accepted: File[]) => {
    setFileError("")
    const onlyPDF = accepted.filter((f) => f.type === "application/pdf")
    const deduped = onlyPDF.filter(
      (f) => !selectedFiles.some((s) => s.name === f.name && s.size === f.size)
    )
    const combined = [...selectedFiles, ...deduped]
    if (combined.length > 3) {
      setFileError("Você pode anexar no máximo 3 PDFs.")
      setSelectedFiles(combined.slice(0, 3))
    } else {
      setSelectedFiles(combined)
    }
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    disabled: selectedFiles.length >= 3,
  })

  return (
    <div className="mb-40 flex justify-center">
      <Card className="w-full max-w-4xl md:mx-10 sm:mx-10">
        <CardHeader className="mb-5">
          <CardTitle>Cancelamento de Seguros</CardTitle>
          <CardDescription>
            Para concluir o cancelamento de seguros, solicitamos o preenchimento
            dos dados a seguir:
          </CardDescription>
          {showProtocolsBanner && (
            <div className="mt-4 relative">
              <Alert className="border-green-700/30 bg-green-50 pr-8">
                <FileX className="h-4 w-4" />
                <AlertTitle className="text-green-900">
                  Novidade: acompanhe seus protocolos
                </AlertTitle>
                <AlertDescription className="text-green-900/90">
                  Agora você pode visualizar seus Protocolos de Cancelamento de
                  Seguros no menu lateral. Clique em{" "}
                  <span className="font-medium">
                    Protocolos de Cancelamento
                  </span>{" "}
                  para ver a lista.
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="piva"
                      onClick={() =>
                        navigate("/imobiliaria/protocolo-cancelamento")
                      }
                    >
                      Ir para Protocolos
                    </Button>
                  </div>
                </AlertDescription>
                <button
                  type="button"
                  aria-label="Fechar aviso"
                  className="absolute right-2 top-2 rounded p-1 text-green-900/70 hover:bg-green-100 hover:text-green-900"
                  onClick={() => {
                    localStorage.setItem("protocolosBannerDismissed", "1")
                    setShowProtocolsBanner(false)
                  }}
                >
                  ×
                </button>
              </Alert>
            </div>
          )}
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
              <TabsList className="bg-white grid w-full grid-cols-2 sm:grid-cols-3 gap-2 mb-14">
                <TabsTrigger
                  value="locatario"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "locatario" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "locatario" ? "#16a34a" : undefined,
                    color: currentTab === "locatario" ? "white" : undefined,
                  }}
                >
                  Identificação e Seguro
                </TabsTrigger>
                <TabsTrigger
                  value="locacao"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "locacao" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "locacao" ? "#16a34a" : undefined,
                    color: currentTab === "locacao" ? "white" : undefined,
                  }}
                >
                  Dados da Locação
                </TabsTrigger>
                <TabsTrigger
                  value="proprietario"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === "proprietario" ? "" : "bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === "proprietario" ? "#16a34a" : undefined,
                    color: currentTab === "proprietario" ? "white" : undefined,
                  }}
                >
                  Confirmação
                </TabsTrigger>
              </TabsList>

              {/* Dados do Locatário */}
              <TabsContent value="locatario">
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
                      required
                      placeholder="Digite o nome da imobiliária"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf_inquilino">
                        CPF do Inquilino <RequiredAsterisk />
                      </Label>
                      <Input
                        id="cpf_inquilino"
                        name="cpf_inquilino"
                        value={formData.cpf_inquilino || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o CPF"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome_inquilino">
                        Nome do Inquilino <RequiredAsterisk />
                      </Label>
                      <Input
                        id="nome_inquilino"
                        name="nome_inquilino"
                        value={formData.nome_inquilino}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o nome do inquilino"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf_proprietario">
                        CPF do Proprietário <RequiredAsterisk />
                      </Label>
                      <Input
                        id="cpf_proprietario"
                        name="cpf_proprietario"
                        value={formData.cpf_proprietario || ""}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o CPF"
                      />
                    </div>
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
                  </div>
                </div>
              </TabsContent>

              {/* Dados da Locação */}
              <TabsContent value="locacao">
                <div className="grid gap-4 py-4">
                  {/* Nome da Imobiliária e Tipo de Seguro movidos para a primeira aba */}
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
                        type="number"
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
                  {/* Campos de valores removidos para alinhar ao tipo */}
                </div>
              </TabsContent>

              {/* Dados do Proprietário */}
              <TabsContent value="proprietario">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo_seguro">
                      Tipo de Seguro <RequiredAsterisk />
                    </Label>
                    <Select
                      value={formData.tipo_seguro}
                      onValueChange={(value) =>
                        handleSelectChange("tipo_seguro", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de seguro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEGURO FIANÇA">
                          SEGURO FIANÇA
                        </SelectItem>
                        <SelectItem value="SEGURO INCÊNDIO">
                          SEGURO INCÊNDIO
                        </SelectItem>
                        <SelectItem value="RESGATE DE TÍTULO">
                          RESGATE DE TÍTULO
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Upload de PDF (dropzone com estado de limite) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label>
                          Anexos PDF <span className="text-red-500">*</span>
                        </Label>
                      </div>
                      <span
                        className={`text-xs ${
                          selectedFiles.length === 0
                            ? "text-amber-700 font-medium"
                            : "text-gray-500"
                        }`}
                        title={
                          selectedFiles.length === 0
                            ? "Anexe pelo menos 1 PDF"
                            : undefined
                        }
                      >
                        {selectedFiles.length} arquivo(s)
                      </span>
                    </div>
                    {selectedFiles.length < 3 ? (
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                          isDragActive
                            ? "border-green-600 bg-green-50"
                            : "border-gray-300"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Upload className="w-8 h-8 text-gray-500" />
                          <p className="text-sm text-gray-700">
                            {isDragActive
                              ? "Solte os arquivos aqui"
                              : "Arraste e solte seus PDFs aqui"}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={open}
                            className="mt-2"
                          >
                            Selecionar arquivos
                          </Button>
                          <p className="text-xs text-gray-500">
                            Apenas PDF • Mín. 1 arquivo
                          </p>
                          <p className="text-xs text-gray-500">
                            Anexe pelo menos 1 PDF para enviar.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-amber-500 bg-amber-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Ban className="w-6 h-6 text-amber-600" />
                            <div>
                              <p className="text-sm font-medium text-amber-800">
                                Limite de anexos atingido
                              </p>
                              <p className="text-xs text-amber-700">
                                Remova um arquivo para adicionar outro.
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-amber-700 hover:text-amber-800"
                            onClick={() => setSelectedFiles([])}
                          >
                            Remover todos
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-amber-700">
                          Você já anexou o máximo permitido. Mínimo exigido: 1
                          PDF.
                        </p>
                      </div>
                    )}
                    {fileError && (
                      <p className="text-sm text-red-600">{fileError}</p>
                    )}
                    {selectedFiles.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-700">
                            {selectedFiles.length} arquivo(s) selecionado(s)
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setSelectedFiles([])}
                          >
                            Remover todos
                          </Button>
                        </div>
                        <ul className="space-y-2">
                          {selectedFiles.map((file, idx) => (
                            <li
                              key={`${file.name}-${file.size}-${idx}`}
                              className="flex items-center justify-between rounded-md border p-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-5 h-5 text-green-700 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() =>
                                  setSelectedFiles((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
            {currentTab !== "locatario" && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
            )}
            {currentTab !== "proprietario" ? (
              <Button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-[#00612B] text-white shadow hover:bg-[#02693E] focus-visible:ring-[#02693E]"
              >
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  !agreedToTerms || isLoading || selectedFiles.length < 1
                }
                title={
                  selectedFiles.length < 1
                    ? "Anexe pelo menos 1 PDF para enviar"
                    : undefined
                }
                className="ml-auto bg-green-700 hover:bg-green-600 disabled:opacity-60"
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
          {/* <div className="flex justify-center my-4">
            <div className="w-24 h-24 flex items-center justify-center my-5">
              <img src={pivaLogo} alt="Piva" className="w-24 h-24 " />
            </div>
          </div> */}
          <DialogDescription>
            Seus dados foram enviados com sucesso. Nossa equipe entrará em
            contato em breve.
          </DialogDescription>
          {/* Aviso simples para acessar a página de protocolos */}
          <div className="mt-4">
            <Alert className="border-green-700/30 bg-green-50">
              <FileX className="h-4 w-4" />
              <AlertTitle className="text-green-900">
                Visualize o protocolo deste envio
              </AlertTitle>
              <AlertDescription className="text-green-900/90">
                Acompanhe este envio na página de
                <span className="font-medium"> Protocolos de Cancelamento</span>
                .
                <div className="mt-3">
                  <Button
                    type="button"
                    className="bg-green-700 hover:bg-green-600 text-white"
                    onClick={() => {
                      setIsSuccessModalOpen(false)
                      navigate("/imobiliaria/protocolo-cancelamento")
                    }}
                  >
                    Ir para Protocolos
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
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
