import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "./ui/use-toast"
import { changeImobiliariaPassword } from "@/utils/api/ImobiliariasService"
import { Loader2 } from "lucide-react"

interface PasswordFormProps {
  onCancel: () => void
}

export function PasswordForm({ onCancel }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("As novas senhas não coincidem.")
      }

      await changeImobiliariaPassword(
        currentPassword,
        newPassword,
        confirmPassword
      )

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      })

      alert("Senha alterada com sucesso.")
      onCancel()
    } catch (error) {
      const err = error as Error

      if (err.message === "Failed to authenticate.") {
        setError("Senha atual incorreta.")
      } else {
        console.error("Erro na alteração de senha:", err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Senha Atual</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nova Senha</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-green-700 hover:bg-green-800"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            "Alterar Senha"
          )}
        </Button>
      </div>
    </form>
  )
}
