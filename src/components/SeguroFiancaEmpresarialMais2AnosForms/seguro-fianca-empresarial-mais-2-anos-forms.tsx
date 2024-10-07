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
import { SeguroFiancaEmpresarialMais2Anos } from "@/types/SeguroFiancaEmpresarialMais2Anos";
import { formatCPF } from "@/utils/regex/regexCPF";
import { formatCNPJ } from "@/utils/regex/regexCNPJ";
import { formatCEP } from "@/utils/regex/regexCEP";
import { formatTelefone } from "@/utils/regex/regexTelefone";
import { createSeguroFiancaEmpresarialMais2Anos } from "@/utils/api/SeguroFiancaEmpresarialMais2AnosService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import pivaLogo from "@/assets/logo.png";
import { buscaEnderecoPorCEP, EnderecoViaCep } from "@/utils/api/Cep";
// Importações adicionais que possam estar no seu código original

export function SeguroFiancaEmpresarialMais2AnosForms() {
  const [currentTab, setCurrentTab] = useState("personal");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<SeguroFiancaEmpresarialMais2Anos>({
    id: "",
    id_numero: 0,
    acao: "PENDENTE",
    opcao_tributaria: "LUCRO REAL",
    nome_empresa: "",
    cnpj: "",
    telefone_empresa: "",
    email_empresa: "",
    atividade_economica: "",
    cep: "",
    endereco: "",
    bairro: "",
    numero_endereco: 0,
    cidade: "",
    estado: "",
    motivo_locacao: "ABERTURA DE FILIAL",
    tipo_imovel: "PRÓPRIO",
    valor_aluguel: 0,
    nome_locador_imobiliaria: "",
    telefone: "",
    created: new Date(),
    updated: new Date(),
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "telefone" || name === "telefone_empresa") {
      formattedValue = formatTelefone(value);
    } else if (name === "cpf_socio_1" || name === "cpf_socio_2") {
      formattedValue = formatCPF(value);
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
            [name]: formattedValue,
          }));
        } finally {
          setIsLoading(false);
        }
      } else {
        // Se o CEP tiver menos de 8 dígitos, limpa os campos de endereço
        setFormData((prevState) => ({
          ...prevState,
          endereco: "",
          bairro: "",
          cidade: "",
          estado: "",
          [name]: formattedValue,
        }));
      }
    } else if (name === "cnpj") {
      formattedValue = formatCNPJ(value);
      // Aqui você pode adicionar lógica específica para o CNPJ, se necessário
    } else if (
      ["capital_social", "faturamento_mensal", "valor_aluguel"].includes(name)
    ) {
      // Se você tiver funções de formatação para valores monetários, pode usá-las aqui
      // formattedValue = formatValor(value);
    } else if (name === "data_nascimento") {
      // Manter o valor da data sem formatação adicional
      formattedValue = value;
    }

    // Atualiza o estado geral do formulário
    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  const handleSelectChange = (
    name: keyof SeguroFiancaEmpresarialMais2Anos,
    value: string | number | Date
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNext = () => {
    const tabs = ["personal", "address", "payment"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const tabs = ["personal", "address", "payment"];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Enviando formulário:", formData);
    setIsLoading(true); // Inicia o carregamento
    try {
      await createSeguroFiancaEmpresarialMais2Anos(formData);
      formRef.current?.reset();
      setIsSuccessModalOpen(true); // Mostra o modal ao enviar com sucesso
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      setErrorMessage(
        "Ocorreu um erro ao enviar o formulário. Tente novamente."
      );
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  const RequiredAsterisk = () => <span className="text-red-500">*</span>;

  return (
    <div className="mb-40 flex justify-center">
      <Card className="w-full max-w-4xl md:mx-10 sm:mx-10">
        <CardHeader className="mb-5">
          <CardTitle>
            Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Acima de 2 Anos)
          </CardTitle>
          <CardDescription>
            Para concluir a análise do Seguro Fiança Pessoa Jurídica Comercial
            (CNPJ Acima de 2 Anos), solicitamos o preenchimento dos dados a
            seguir:
          </CardDescription>
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
                  Dados da Empresa
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
                  Endereço da Empresa
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
                  Locação
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="danos_imovel">
                        Opção Tributária <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.opcao_tributaria}
                        onValueChange={(value) =>
                          handleSelectChange("opcao_tributaria", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Opção Tributária" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LUCRO REAL">LUCRO REAL</SelectItem>
                          <SelectItem value="LUCRO">LUCRO</SelectItem>
                          <SelectItem value="PRESUMIDO">PRESUMIDO</SelectItem>
                          <SelectItem value="SIMPLES NACIONAL">
                            SIMPLES NACIONAL
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome_empresa">
                        Nome da Empresa <RequiredAsterisk />
                      </Label>
                      <Input
                        id="nome_empresa"
                        name="nome_empresa"
                        value={formData.nome_empresa}
                        onChange={handleInputChange}
                        type="text"
                        required
                        placeholder="Digite o nome da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email_empresa">
                        Email <RequiredAsterisk />
                      </Label>
                      <Input
                        id="email_empresa"
                        name="email_empresa"
                        type="email"
                        value={formData.email_empresa}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o email da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone_empresa">
                        Telefone <RequiredAsterisk />
                      </Label>
                      <Input
                        id="telefone_empresa"
                        name="telefone_empresa"
                        type="tel"
                        value={formData.telefone_empresa}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o telefone da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">
                        CNPJ <RequiredAsterisk />
                      </Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o CNPJ da empresa"
                        maxLength={18}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="atividade_economica">
                        Atividade Econômica <RequiredAsterisk />
                      </Label>
                      <Input
                        id="atividade_economica"
                        name="atividade_economica"
                        value={formData.atividade_economica}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite a atividade econômica da empresa"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capital_social">
                        Capital Social <RequiredAsterisk />
                      </Label>
                      <Input
                        id="capital_social"
                        name="capital_social"
                        value={formData.capital_social || ""}
                        onChange={handleInputChange}
                        required
                        type="number"
                        placeholder="Digite o capital social"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="faturamento_mensal">
                        Faturamento Mensal <RequiredAsterisk />
                      </Label>
                      <Input
                        id="faturamento_mensal"
                        name="faturamento_mensal"
                        value={formData.faturamento_mensal || ""}
                        onChange={handleInputChange}
                        required
                        type="number"
                        placeholder="Digite o faturamento mensal da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome_socio_1">Nome do Sócio (1)</Label>
                      <Input
                        id="nome_socio_1"
                        name="nome_socio_1"
                        value={formData.nome_socio_1}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Digite o nome de um sócio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf_socio_1">CPF do Sócio (1)</Label>
                      <Input
                        id="cpf_socio_1"
                        name="cpf_socio_1"
                        value={formData.cpf_socio_1}
                        onChange={handleInputChange}
                        placeholder="Digite o CPF de um sócio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome_socio_2">Nome do Sócio (2)</Label>
                      <Input
                        id="nome_socio_2"
                        name="nome_socio_2"
                        value={formData.nome_socio_2}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Digite o nome do outro sócio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf_socio_2">CPF do Sócio (2)</Label>
                      <Input
                        id="cpf_socio_2"
                        name="cpf_socio_2"
                        value={formData.cpf_socio_2}
                        onChange={handleInputChange}
                        placeholder="Digite CPF do outro sócio"
                      />
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
                </div>
              </TabsContent>

              <TabsContent value="payment">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="danos_imovel">
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
                          <SelectValue placeholder="Motivo da Locação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ABERTURA DE FILIAL">
                            ABERTURA DE FILIAL
                          </SelectItem>
                          <SelectItem value="TROCA DO LOCAL">
                            TROCA DO LOCAL
                          </SelectItem>
                          <SelectItem value="DE SEDE">DE SEDE</SelectItem>
                          <SelectItem value="LOCAÇÃO PARA MORADIA">
                            LOCAÇÃO PARA MORADIA
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo do Imóvel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRÓPRIO">PRÓPRIO</SelectItem>
                          <SelectItem value="ALUGADO">ALUGADO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor_aluguel">
                        Valor do Aluguel <RequiredAsterisk />
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
                      <Label htmlFor="nome_locador_imobiliaria">
                        Nome do Locador ou Imobiliária <RequiredAsterisk />
                      </Label>
                      <Input
                        id="nome_locador_imobiliaria"
                        name="nome_locador_imobiliaria"
                        type="text"
                        value={formData.nome_locador_imobiliaria || ""}
                        onChange={handleInputChange}
                        placeholder="Digite o nome do locador ou imobiliária"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">
                        Telefone do Locador ou da Imobiliária{" "}
                        <RequiredAsterisk />
                      </Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o telefone do locador ou imobiliária"
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