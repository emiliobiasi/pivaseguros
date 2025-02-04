import { useState, useContext } from "react";
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
import { AuthImobiliariaContext } from "@/contexts/auth/imobiliarias/AuthContextImobiliarias"; // Importe o contexto
import { formatTelefone } from "../../utils/regex/regexTelefone";

const CadastrarImobiliarias = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <CadastrarImobiliariasFormCard />
    </div>
  );
};

export default CadastrarImobiliarias;

function CadastrarImobiliariasFormCard() {
  const authContext = useContext(AuthImobiliariaContext); // Acesse o contexto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(["As senhas não coincidem."]);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Dados para cadastro
      const data = {
        username,
        email,
        password,
        passwordConfirm: confirmPassword,
        nome: companyName,
        contato: phone,
      };

      // Chamada ao método registerWithEmail
      await authContext?.registerWithEmail(data);

      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      const typedError = error as {
        response?: {
          data?: {
            email?: { code: string };
            password?: { code: string };
            username?: { code: string };
            nome?: { code: string };
          };
        };
      };
      if (typedError.response && typedError.response.data) {
        const { email, password, username, nome } = typedError.response.data;
        const errorMessages = [];
        if (email && email.code === "validation_invalid_email") {
          errorMessages.push(
            "Este email já está cadastrado ou é inválido. Por favor, use outro email."
          );
        }
        if (password && password.code === "validation_length_out_of_range") {
          errorMessages.push("A senha deve ter entre 8 e 72 caracteres.");
        }
        if (username && username.code === "validation_invalid_username") {
          errorMessages.push(
            "O Nome Único da Imobiliária é inválido ou já está em uso."
          );
        }
        if (nome && nome.code === "validation_not_unique") {
          errorMessages.push(
            "O Nome da Imobiliária é inválido ou já está em uso."
          );
        }
        setError(errorMessages);
      } else {
        console.error("Erro no cadastro:", error);
        setError(["Falha ao cadastrar. Por favor, tente novamente."]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-8xl shadow-lg p-6 flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:space-x-10 bg-white overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center lg:justify-start">
        <img
          className="w-40 sm:w-56 lg:w-72 h-auto"
          src={pivaLogo}
          alt="Logo Piva"
        />
      </div>

      {/* Formulário */}
      <div className="flex-1">
        <CardHeader className="space-y-4 text-center lg:text-left">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Crie sua conta
          </CardTitle>
          <CardDescription>
            Preencha as informações abaixo para criar a conta da sua
            imobiliária.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Grid para Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
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
                  className="w-full"
                />
              </div>

              {/* Celular */}
              <div className="space-y-2">
                <Label htmlFor="phone">Celular (Contato)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(formatTelefone(e.target.value))}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Nome Único da Imobiliária (ID) */}
              <div className="space-y-2">
                <Label htmlFor="username">Nome Único da Imobiliária (ID)</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="nome_único_da_imobiliária"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Nome da Imobiliária */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Imobiliária</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Nome da imobiliária"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>

          {/* Error Message */}
          {/* {error && <p className="text-red-600 text-sm mt-4">{error}</p>} */}

          {error && (
            <div className="text-red-600 text-sm mt-4">
              {error.map((errMsg, index) => (
                <p key={index}>{errMsg}</p>
              ))}
            </div>
          )}

          {/* Botão */}
          <CardFooter className="flex flex-col items-center lg:items-end mt-6 space-y-4">
            <Button
              type="submit"
              className="w-full lg:w-auto text-white py-2 px-4 rounded flex items-center justify-center"
              variant="piva"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Cadastrar"
              )}
            </Button>

            {/* Link para Login */}
            <p className="text-sm text-gray-600">
              Já possui uma conta?{" "}
              <a
                href="/imobiliaria/entrar"
                className="text-blue-600 hover:underline font-medium"
              >
                Entre aqui.
              </a>
            </p>
          </CardFooter>
        </form>
      </div>
    </Card>
  );
}
