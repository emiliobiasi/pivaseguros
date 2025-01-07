import { useState } from "react";
import { useAuth } from "@/contexts/auth/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import pivaLogo from "@/assets/logo.png";
import { Loader2 } from "lucide-react";

export function LoginImobiliariaFormCard() {
  const { loginWithEmail } = useAuth(); // Hook de autenticação
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Estado de loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true); // Inicia o loading
      await loginWithEmail(email, password);
    } catch (error) {
      console.error("Erro de login", error);
      setError("Falha ao logar. Por favor, verifique suas credenciais.");
    } finally {
      setLoading(false); // Encerra o loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg sm:max-w-md shadow-lg lg:px-10">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center items-center">
            <img
              className="w-32 sm:w-48 lg:w-64 h-auto my-4 sm:my-8"
              src={pivaLogo}
              alt="Logo Piva"
            />
          </div>

          <CardTitle className="text-xl sm:text-2xl font-bold">
            Acesso Imobiliárias
          </CardTitle>
          <CardDescription>
            Insira seu email e senha para acessar a plataforma exclusiva das imobiliárias parceiras.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email da Imobiliária</Label>
              <div className="relative pb-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="email@imobiliaria.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading} // Desabilita durante o loading
                />
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading} // Desabilita durante o loading
                />
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="w-full text-white mt-4 py-2 px-3 rounded flex items-center justify-center"
              variant="piva"
              disabled={loading} // Desabilita o botão durante o loading
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" /> // Ícone de loading
              ) : (
                "Entrar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
