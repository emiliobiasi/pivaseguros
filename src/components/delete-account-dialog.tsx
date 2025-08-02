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
import { deleteImobiliaria } from "@/utils/api/ImobiliariasService";
import pb from "@/utils/backend/pb";

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Obtém o usuário logado
  const currentUser = pb.authStore.model;
  const imobiliariaId = currentUser?.id; // Pega o ID do usuário autenticado
  // console.log("ID da imobiliária:", imobiliariaId);

  const handleDeleteAccount = async () => {
    if (!imobiliariaId) {
      toast({
        title: "Erro",
        description: "ID da conta não encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await deleteImobiliaria(imobiliariaId); // Chama a função para deletar a imobiliária

      toast({
        title: "Conta apagada",
        description: "Sua conta foi apagada permanentemente.",
        variant: "destructive",
      });

      pb.authStore.clear(); // Faz logout do usuário após a exclusão da conta

      onOpenChange(false);
      setStep(1);
    } catch (error) {
      console.error("Erro ao deletar a conta:", error);
      toast({
        title: "Erro",
        description: "Falha ao apagar a conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogDescription>
              Tem certeza que deseja apagar sua conta? Esta ação é irreversível.
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => setStep(2)}>
                Continuar
              </Button>
            </DialogFooter>
          </>
        );
      case 2:
        return (
          <>
            <DialogDescription>
              Por favor, digite <strong>"APAGAR MINHA CONTA"</strong> para
              confirmar a exclusão.
            </DialogDescription>
            <div className="space-y-2">
              <Label htmlFor="confirmText">Confirmação</Label>
              <Input
                id="confirmText"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="APAGAR MINHA CONTA"
                disabled={loading}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={confirmText !== "APAGAR MINHA CONTA" || loading}
              >
                {loading ? "Apagando..." : "Apagar Conta Permanentemente"}
              </Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apagar Conta</DialogTitle>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
