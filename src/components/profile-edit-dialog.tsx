import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "./ui/use-toast"
import {
  updateImobiliariaEmail,
  updateImobiliariaName,
} from "@/utils/api/ImobiliariasService" // Importando as funções de serviço
import { Alert } from "./ui/alert"
import { AlertCircle } from "lucide-react"

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imobiliariaId: string // Adicionando o ID da imobiliária como prop
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  imobiliariaId,
}: ProfileEditDialogProps) {
  const [editType, setEditType] = useState<"email" | "companyName" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false) // Estado para gerenciar o carregamento
  const [error, setError] = useState<string | null>(null) // Estado para erros

  // Componente ProfileEditDialog atualizado

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (editType === "email") {
        // Chamada corrigida sem o ID
        await updateImobiliariaEmail(email, password)
        toast({
          title: "Confirmação necessária",
          description:
            "Enviamos um link de confirmação para o novo email. Verifique sua caixa postal.",
        })
      } else if (editType === "companyName") {
        await updateImobiliariaName(imobiliariaId, companyName)
        toast({
          title: "Perfil Atualizado",
          description: "O nome da sua imobiliária foi atualizado com sucesso.",
        })
      }

      onOpenChange(false)
      setEditType(null)
      setEmail("")
      setCompanyName("")
      setPassword("")
    } catch (err) {
      const errorMessage = (err as Error).message
      console.error("Erro ao atualizar:", errorMessage)
      setError(errorMessage)

      toast({
        title: "Erro",
        description: errorMessage.includes("senha")
          ? "Senha incorreta. Tente novamente."
          : "Falha ao atualizar. Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription className="text-md text-gray-700">
            Escolha o que você deseja alterar no seu perfil.
          </DialogDescription>
        </DialogHeader>
        {!editType ? (
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setEditType("email")} >Alterar Email</Button>
            <Button onClick={() => setEditType("companyName")}>
              Alterar Nome da Imobiliária
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {editType === "email" ? (
              <div className="space-y-2">
                <div className="bg-yellow-50 p-3 rounded-lg mt-2 mb-6 border border-yellow-400">
                  <div className="flex items-center text-sm text-gray-600">
                    <AlertCircle className="text-yellow-600 mr-2" />
                    <p>
                      Após clicar em "Salvar Alterações", confira sua caixa de entrada para confirmar a alteração.
                      Se não encontrar o email, verifique a caixa de spam.
                    </p>
                  </div>
                </div>

                <Label htmlFor="email">Novo Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ marginBottom: "15px" }}
                />
                <Label htmlFor="password" className="">
                  Senha Atual
                </Label>
                <Input
                  className=""
                  id="password"
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="companyName">Novo Nome da Imobiliária</Label>
                <Input
                  id="companyName"
                  placeholder="Nome da sua imobiliária"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditType(null)}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-700 hover:bg-green-800">
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
