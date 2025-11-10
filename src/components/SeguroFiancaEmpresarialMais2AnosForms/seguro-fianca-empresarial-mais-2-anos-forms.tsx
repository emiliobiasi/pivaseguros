import { SeguroFiancaEmpresarialMais2Anos } from '@/types/SeguroFiancaEmpresarialMais2Anos'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, ArrowRight, CheckCircle, Send, Loader2 } from 'lucide-react'
import { formatCPF } from '@/utils/regex/regexCPF'
import { formatCNPJ } from '@/utils/regex/regexCNPJ'
import { formatCEP } from '@/utils/regex/regexCEP'
import { formatTelefone } from '@/utils/regex/regexTelefone'
import { createSeguroFiancaEmpresarialMais2Anos } from '@/utils/api/SeguroFiancaEmpresarialMais2AnosService'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { buscaEnderecoPorCEP, EnderecoViaCep } from '@/utils/api/Cep'
// Importações adicionais que possam estar no seu código original

export function SeguroFiancaEmpresarialMais2AnosForms() {
  const [currentTab, setCurrentTab] = useState('personal')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState<SeguroFiancaEmpresarialMais2Anos>({
    id: '',
    id_numero: 0,
    status: 'EM ANÁLISE',
    acao: 'PENDENTE',
    tipo_empresa: 'LTDA',
    opcao_tributaria: 'LUCRO REAL',
    nome_empresa: '',
    cnpj: '',
    telefone_empresa: '',
    email_empresa: '',
    atividade_economica: '',
    cep: '',
    endereco: '',
    bairro: '',
    numero_endereco: 0,
    cidade: '',
    estado: '',
    motivo_locacao: 'ABERTURA DE FILIAL',
    aluguel: 0,
    danos_imovel: 'SIM',
    multa_rescisao: 'SIM',
    pintura_interna: 'SIM',
    pintura_externa: 'SIM',
    nome_imobiliaria: '',
    created: new Date(),
    updated: new Date(),
  })

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'telefone' || name === 'telefone_empresa') {
      formattedValue = formatTelefone(value)
    } else if (name === 'cpf_socio_1' || name === 'cpf_socio_2') {
      formattedValue = formatCPF(value)
    } else if (name === 'cep' || name === 'cep_empresa') {
      formattedValue = formatCEP(value)

      const cepNumeros = formattedValue.replace(/\D/g, '')

      if (cepNumeros.length === 8) {
        try {
          setIsLoading(true)
          setErrorMessage('') // Limpa mensagens de erro anteriores

          // Chama a função importada para buscar o endereço
          const data: EnderecoViaCep = await buscaEnderecoPorCEP(cepNumeros)

          // Atualiza os campos de endereço com os dados retornados
          if (name === 'cep') {
            setFormData((prevState) => ({
              ...prevState,
              endereco: data.logradouro || '',
              bairro: data.bairro || '',
              cidade: data.localidade || '',
              estado: data.uf || '',
              [name]: formattedValue, // Atualiza o campo CEP também
            }))
          }
        } catch (error: unknown) {
          console.error('Erro ao buscar o CEP:', error)
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Erro ao buscar o CEP. Tente novamente.'
          )

          // Limpa os campos de endereço em caso de erro
          if (name === 'cep') {
            setFormData((prevState) => ({
              ...prevState,
              endereco: '',
              bairro: '',
              cidade: '',
              estado: '',
              [name]: formattedValue,
            }))
          }
        } finally {
          setIsLoading(false)
        }
      } else {
        // Se o CEP tiver menos de 8 dígitos, limpa os campos de endereço
        if (name === 'cep') {
          setFormData((prevState) => ({
            ...prevState,
            endereco: '',
            bairro: '',
            cidade: '',
            estado: '',
            [name]: formattedValue,
          }))
        } else if (name === 'cep_empresa') {
          setFormData((prevState) => ({
            ...prevState,
            endereco_empresa: '',
            bairro_empresa: '',
            cidade_empresa: '',
            estado_empresa: '',
            [name]: formattedValue,
          }))
        }
      }
    } else if (name === 'cnpj') {
      formattedValue = formatCNPJ(value)
      // Aqui você pode adicionar lógica específica para o CNPJ, se necessário
    } else if (
      ['capital_social', 'faturamento_mensal', 'valor_aluguel'].includes(name)
    ) {
      // Se você tiver funções de formatação para valores monetários, pode usá-las aqui
      // formattedValue = formatValor(value);
    } else if (name === 'data_nascimento') {
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
    name: keyof SeguroFiancaEmpresarialMais2Anos,
    value: string | number | Date
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleNext = () => {
    const tabs = ['personal', 'payment', 'coberturas']
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const tabs = ['personal', 'payment', 'coberturas']
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Verifique se o handleSubmit está sendo acionado
    // console.log("handleSubmit acionado com dados:", formData)

    // Função de validação
    const validateForm = () => {
      const errors: string[] = []
      if (!formData.nome_imobiliaria) errors.push('Nome da Imobiliária')
      if (!formData.opcao_tributaria) errors.push('Opção Tributária')
      if (!formData.nome_empresa) errors.push('Nome da Empresa')
      if (!formData.cnpj) errors.push('CNPJ')
      if (!formData.telefone_empresa) errors.push('Telefone')
      if (!formData.email_empresa) errors.push('Email')
      if (!formData.atividade_economica) errors.push('Atividade Econômica')
      if (!formData.cep) errors.push('CEP')
      if (!formData.endereco) errors.push('Endereço')
      if (!formData.bairro) errors.push('Bairro')
      if (!formData.numero_endereco) errors.push('Número')
      if (!formData.cidade) errors.push('Cidade')
      if (!formData.estado) errors.push('Estado')
      if (!formData.motivo_locacao) errors.push('Motivo da Locação')
      if (!formData.prazo_contrato) errors.push('Prazo do Contrato')

      if (!formData.aluguel) errors.push('Aluguel')

      return errors
    }

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrorMessage(
        `Ocorreu um erro ao enviar o formulário. Verifique se você preencheu todos os campos obrigatórios e se digitou os campos. Campos obrigatórios que faltam: ${validationErrors.join(
          ', '
        )}`
      )
      return
    }

    setIsLoading(true)
    try {
      await createSeguroFiancaEmpresarialMais2Anos(formData) // Certifique-se de que está chamando a função correta
      // console.log("Dados enviados para criação:", formData)

      // Reseta o formulário e abre o modal de sucesso
      formRef.current?.reset()
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error)
      setErrorMessage(
        'Ocorreu um erro ao enviar o formulário. Verifique se você preencheu todos os campos obrigatórios e se digitou campos de email corretamente. Tente novamente.'
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
          <CardTitle>
            Seguro Fiança: Pessoa Jurídica Comercial (CNPJ Acima de 2 Anos)
          </CardTitle>
          <CardDescription>
            Para concluir a análise do Seguro Fiança Pessoa Jurídica Comercial
            (CNPJ Acima de 2 Anos), solicitamos o preenchimento dos dados a
            seguir:
          </CardDescription>

          <h3 className="" style={{ marginTop: '1.5rem ' }}>
            💡Os campos marcados com{' '}
            <strong>
              <RequiredAsterisk />
            </strong>{' '}
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
                    currentTab === 'personal' ? '' : 'bg-gray-200'
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === 'personal' ? '#16a34a' : undefined,
                    color: currentTab === 'personal' ? 'white' : undefined,
                  }}
                >
                  Dados do Pretendente
                </TabsTrigger>

                <TabsTrigger
                  value="payment"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === 'payment' ? '' : 'bg-gray-200'
                  }`}
                  style={{
                    width: '100%',
                    // marginLeft: "10%",
                    // marginRight: "10px",
                    backgroundColor:
                      currentTab === 'payment' ? '#16a34a' : undefined,
                    color: currentTab === 'payment' ? 'white' : undefined,
                  }}
                >
                  Dados da Locação Pretendida
                </TabsTrigger>
                <TabsTrigger
                  value="coberturas"
                  className={`text-xs sm:text-sm p-2 rounded-lg focus:bg-white focus:outline-none ${
                    currentTab === 'coberturas' ? '' : 'bg-gray-200'
                  }`}
                  style={{
                    backgroundColor:
                      currentTab === 'coberturas' ? '#16a34a' : undefined,
                    color: currentTab === 'coberturas' ? 'white' : undefined,
                  }}
                >
                  Coberturas
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
                        type="text"
                        required
                        placeholder="Digite o nome da imobiliária"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo_empresa">
                        Tipo de Empresa <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.tipo_empresa}
                        onValueChange={(value) =>
                          handleSelectChange('tipo_empresa', value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de Empresa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LTDA">LTDA</SelectItem>
                          <SelectItem value="INDIVIDUAL/ME">
                            INDIVIDUAL/ME
                          </SelectItem>
                          <SelectItem value="S.A. CAPITAL ABERTO">
                            S.A. CAPITAL ABERTO
                          </SelectItem>
                          <SelectItem value="S.A. CAPITAL FECHADO">
                            S.A. CAPITAL FECHADO
                          </SelectItem>
                          <SelectItem value="SEM FINS LUCRATIVOS">
                            SEM FINS LUCRATIVOS
                          </SelectItem>
                          <SelectItem value="PÚBLICO">PÚBLICO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="opcao_tributaria">
                        Opção Tributária <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.opcao_tributaria}
                        onValueChange={(value) =>
                          handleSelectChange('opcao_tributaria', value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Opção Tributária" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LUCRO REAL">LUCRO REAL</SelectItem>
                          <SelectItem value="LUCRO PRESUMIDO">
                            LUCRO PRESUMIDO
                          </SelectItem>
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
                        value={formData.capital_social || ''}
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
                        value={formData.faturamento_mensal || ''}
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

              <TabsContent value="payment">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="danos_imovel">
                      Motivo da Locação <RequiredAsterisk />
                    </Label>
                    <Select
                      value={formData.motivo_locacao}
                      onValueChange={(value) =>
                        handleSelectChange('motivo_locacao', value)
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

                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prazo_contrato">
                        Prazo do Contrato <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.prazo_contrato}
                        onValueChange={(value) =>
                          handleSelectChange('prazo_contrato', value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o prazo do contrato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12 MESES">12 MESES</SelectItem>
                          <SelectItem value="24 MESES">24 MESES</SelectItem>
                          <SelectItem value="30 MESES">30 MESES</SelectItem>
                          <SelectItem value="36 MESES">36 MESES</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                        value={formData.numero_endereco || ''}
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
                        value={formData.complemento || ''}
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

              <TabsContent value="coberturas">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aluguel">
                        Aluguel <RequiredAsterisk />
                      </Label>
                      <Input
                        id="aluguel"
                        name="aluguel"
                        type="number"
                        value={formData.aluguel || ''}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o valor do alguel"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="energia">Energia</Label>
                      <Input
                        id="energia"
                        name="energia"
                        type="number"
                        value={formData.energia || ''}
                        onChange={handleInputChange}
                        placeholder="Digite o valor da conta de energia"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agua">Água</Label>
                      <Input
                        id="agua"
                        name="agua"
                        type="number"
                        value={formData.agua || ''}
                        onChange={handleInputChange}
                        placeholder="Digite o valor da conta de água"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gas">Gás</Label>
                      <Input
                        id="gas"
                        name="gas"
                        type="number"
                        value={formData.gas || ''}
                        onChange={handleInputChange}
                        placeholder="Digite o valor da conta de gás"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condominio">Condomínio</Label>
                      <Input
                        id="condominio"
                        name="condominio"
                        type="number"
                        value={formData.condominio || ''}
                        onChange={handleInputChange}
                        placeholder="Digite o valor do condomínio"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="iptu">IPTU </Label>
                      <Input
                        id="iptu"
                        name="iptu"
                        type="number"
                        value={formData.iptu || ''}
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
                          handleSelectChange('danos_imovel', value)
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
                      <Label htmlFor="multa_rescisao">
                        Multa por Recisão <RequiredAsterisk />
                      </Label>
                      <Select
                        value={formData.multa_rescisao}
                        onValueChange={(value) =>
                          handleSelectChange('multa_rescisao', value)
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
                          handleSelectChange('pintura_interna', value)
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
                          handleSelectChange('pintura_externa', value)
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
                      {' '}
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
                      value={formData.observacao || ''}
                      onChange={handleInputChange}
                      placeholder="Digite sua observação"
                      disabled={isLoading}
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
            {currentTab !== 'personal' && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
            )}
            {currentTab !== 'coberturas' ? (
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
              navigate('/imobiliaria/formulario')
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
