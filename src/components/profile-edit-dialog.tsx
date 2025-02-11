import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "./ui/use-toast";
import {
  updateImobiliariaEmailAsAdmin,
  updateImobiliariaName,
} from "@/utils/api/ImobiliariasService";
import { AlertCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imobiliariaId: string; // ID da imobiliária
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  imobiliariaId,
}: ProfileEditDialogProps) {
  const [editType, setEditType] = useState<"email" | "companyName" | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [nameErrors, setNameErrors] = useState<string[]>([]);
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailErrors([]);
    setNameErrors([]);

    try {
      if (editType === "email") {
        // Chamada corrigida com ID da imobiliária
        await updateImobiliariaEmailAsAdmin(imobiliariaId, email);

        toast({
          title: "Email atualizado com sucesso!",
          description: "O email da imobiliária foi alterado.",
        });

        // navigate("/imobiliaria/entrar");
        // navigate("/painel-adm-imobiliarias");
      } else if (editType === "companyName") {
        await updateImobiliariaName(imobiliariaId, companyName);
        toast({
          title: "Perfil Atualizado",
          description: "O nome da imobiliária foi atualizado com sucesso.",
        });
      }

      // Resetando estados
      onOpenChange(false);
      setEditType(null);
      setEmail("");
      setCompanyName("");
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error("Erro ao atualizar:", errorMessage);

      if (editType === "email") {
        const newErrors = [];

        if (errorMessage.includes("Something went wrong")) {
          newErrors.push("Este email já está cadastrado ou é inválido.");
        } else {
          newErrors.push("Falha ao atualizar o email.");
        }

        setEmailErrors(newErrors);

        // Exibir erro no toast
        toast({
          title: "Erro ao atualizar email",
          description: newErrors.join(" "),
          variant: "destructive",
        });
      } else if (editType === "companyName") {
        const newErrors = ["Erro ao atualizar o nome da imobiliária."];
        setNameErrors(newErrors);
        toast({
          title: "Erro ao atualizar nome",
          description: newErrors.join(" "),
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription className="text-md text-gray-700">
            Escolha o que deseja alterar no perfil da imobiliária.
          </DialogDescription>
        </DialogHeader>

        {!editType ? (
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setEditType("email")}>Alterar Email</Button>
            <Button onClick={() => setEditType("companyName")}>
              Alterar Nome da Imobiliária
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {editType === "email" ? (
              <div className="space-y-2">
                <Label htmlFor="email">Novo Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="bg-yellow-50 p-3 rounded-lg mt-6 mb-6 border border-yellow-400">
                  <div className="flex items-center text-sm text-gray-600">
                    <AlertCircle className="text-yellow-600 mr-2" />
                    <p>
                      Após clicar em "<strong>Salvar Alterações</strong>", o
                      email será alterado. Caso tenha problemas para acessar a
                      conta com o novo email, entre em contato com o suporte.
                    </p>
                  </div>
                </div>

                {emailErrors.length > 0 && (
                  <div className="text-red-500 text-sm py-3">
                    {emailErrors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="companyName">Novo Nome da Imobiliária</Label>
                <Input
                  id="companyName"
                  placeholder="Nome da imobiliária"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />

                {nameErrors.length > 0 && (
                  <div className="text-red-500 text-sm py-3">
                    {nameErrors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditType(null)}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-700 hover:bg-green-800"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
