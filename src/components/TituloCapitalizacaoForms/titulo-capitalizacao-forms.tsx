import { TituloCapitalizacao } from "@/types/TituloCapitalizacao";
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
import { formatTelefone } from "@/utils/regex/regexTelefone";
import { formatCEP } from "@/utils/regex/regexCEP";
import { createTituloCapitalizacao } from "@/utils/api/TituloCapitalizacaoService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import pivaLogo from "@/assets/logo.png";
import { buscaEnderecoPorCEP, EnderecoViaCep } from "@/utils/api/Cep";

export function TituloCapitalizacaoForms() {
  const [currentTab, setCurrentTab] = useState("locatario");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<TituloCapitalizacao>({
    id: "",
    id_numero: 0,
    acao: "PENDENTE",
    nome: "",
    email: "",
    telefone: "",
    profissao: "",
    valor_remuneracao: 0,
    tipo_imovel: "RESIDENCIAL",
    cep: "",
    endereco: "",
    bairro: "",
    numero_endereco: 0,
    cidade: "",
    estado: "",
    valor_aluguel_mensal: 0,
    valor_total_titulos: 0,
    nome_proprietario: "",
    email_proprietario: "",
    telefone_proprietario: "",
    imobiliaria: "",
    created: new Date(),
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf" || name === "cpf_proprietario") {
      formattedValue = formatCPF(value);
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else if (name === "cnpj" || name === "cnpj_proprietario") {
      formattedValue = formatCNPJ(value);
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    } else if (name === "telefone" || name === "telefone_proprietario") {
      formattedValue = formatTelefone(value);
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
        "valor_remuneracao",
        "valor_aluguel_mensal",
        "valor_total_titulos",
        "numero_endereco",
        "id_numero",
      ].includes(name)
    ) {
      const numericValue = Number(value);
      setFormData((prevState) => ({
        ...prevState,
        [name]: numericValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: formattedValue,
      }));
    }
  };

  const handleSelectChange = (
    name: keyof TituloCapitalizacao,
    value: string | number | Date
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNext = () => {
    const tabs = ["locatario", "locacao", "proprietario"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const tabs = ["locatario", "locacao", "proprietario"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Enviando formulário:", formData);
    setIsLoading(true);
    try {
      await createTituloCapitalizacao(formData);
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
          <CardTitle>Efetivação de Título de Capitalização</CardTitle>
          <CardDescription>
            Para concluir a efetivação de Título de Capitalização, solicitamos o
            preenchimento dos dados a seguir:
          </CardDescription>
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
                  Dados do Locatário
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
                  Dados do Proprietário
                </TabsTrigger>
              </TabsList>

              {/* Dados do Locatário */}
              <TabsContent value="locatario">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">
                      Nome <RequiredAsterisk />
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      placeholder="Digite o nome do locatário"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF (opcional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        value={formData.cnpj || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o CNPJ (opcional)"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <RequiredAsterisk />
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
                      <Label htmlFor="telefone">
                        Telefone <RequiredAsterisk />
                      </Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o telefone"
                      />
                    </div>
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
                    <Label htmlFor="valor_remuneracao">
                      Valor da Remuneração <RequiredAsterisk />
                    </Label>
                    <Input
                      id="valor_remuneracao"
                      name="valor_remuneracao"
                      type="number"
                      value={formData.valor_remuneracao || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="Digite o valor da remuneração"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Dados da Locação */}
              <TabsContent value="locacao">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="imobiliaria">
                      Nome da Imobiliária <RequiredAsterisk />
                    </Label>
                    <Input
                      id="imobiliaria"
                      name="imobiliaria"
                      value={formData.imobiliaria}
                      onChange={handleInputChange}
                      required
                      placeholder="Digite o nome da imobiliária"
                    />
                  </div>
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
                        <SelectValue placeholder="Selecione o tipo do imóvel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RESIDENCIAL">Residencial</SelectItem>
                        <SelectItem value="COMERCIAL">Comercial</SelectItem>
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
                  <div className="space-y-2">
                    <Label htmlFor="valor_aluguel_mensal">
                      Valor do Aluguel Mensal <RequiredAsterisk />
                    </Label>
                    <Input
                      id="valor_aluguel_mensal"
                      name="valor_aluguel_mensal"
                      type="number"
                      value={formData.valor_aluguel_mensal || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="Digite o valor do aluguel mensal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor_total_titulos">
                      Valor Total dos Títulos <RequiredAsterisk />
                    </Label>
                    <Input
                      id="valor_total_titulos"
                      name="valor_total_titulos"
                      type="number"
                      value={formData.valor_total_titulos || ""}
                      onChange={handleInputChange}
                      required
                      placeholder="Digite o valor total dos títulos"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Dados do Proprietário */}
              <TabsContent value="proprietario">
                <div className="grid gap-4 py-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf_proprietario">CPF do Proprietário</Label>
                      <Input
                        id="cpf_proprietario"
                        name="cpf_proprietario"
                        value={formData.cpf_proprietario || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF (opcional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj_proprietario">
                        CNPJ do Proprietário
                      </Label>
                      <Input
                        id="cnpj_proprietario"
                        name="cnpj_proprietario"
                        value={formData.cnpj_proprietario || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o CNPJ (opcional)"
                      />
                    </div>
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
                      placeholder="Digite o telefone do proprietário"
                    />
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
