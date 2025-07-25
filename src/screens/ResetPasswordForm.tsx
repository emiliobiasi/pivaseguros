import { useState, useContext } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { AuthImobiliariaContext } from "@/contexts/auth/imobiliarias/AuthContextImobiliarias"

const ResetPasswordForm = () => {
  const authContext = useContext(AuthImobiliariaContext) // Acesse o contexto
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      setLoading(true)
      await authContext?.requestPasswordReset(email)
      setSuccessMessage(
        "Instruções para redefinir sua senha foram enviadas para o email informado."
      )
    } catch (err) {
      console.error("Erro ao solicitar redefinição de senha:", err)
      setErrorMessage(
        "Não foi possível enviar o email de redefinição de senha."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 p-4">
      <Card className="w-full max-w-md shadow-lg p-6 bg-white">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-xl font-bold">Redefinir Senha</CardTitle>
          <CardDescription>
            Informe seu email para receber as instruções de redefinição de
            senha.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@imobiliaria.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {successMessage && (
              <p className="text-green-600 text-sm">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-600 text-sm">{errorMessage}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button
              type="submit"
              className="w-full text-white py-2 px-3 rounded flex items-center justify-center"
              variant="piva"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Enviar Instruções"
              )}
            </Button>

            <div className="text-sm font-semibold text-center text-gray-700 underline cursor-pointer">
              <a href="/imobiliaria/entrar" className="hover:text-blue-700">
                Após ter redefinido a senha, clique aqui para fazer o login da
                sua conta.
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default ResetPasswordForm
