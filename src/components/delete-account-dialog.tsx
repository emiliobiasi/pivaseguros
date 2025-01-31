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


interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");
  const { toast } = useToast();

  const handleDeleteAccount = () => {
    // Lógica para deletar a conta
    toast({
      title: "Conta apagada",
      description: "Sua conta foi apagada permanentemente.",
      variant: "destructive",
    });
    onOpenChange(false);
    setStep(1);
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
              Por favor, digite "APAGAR MINHA CONTA" para confirmar a exclusão.
            </DialogDescription>
            <div className="space-y-2">
              <Label htmlFor="confirmText">Confirmação</Label>
              <Input
                id="confirmText"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="APAGAR MINHA CONTA"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={confirmText !== "APAGAR MINHA CONTA"}
              >
                Apagar Conta Permanentemente
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
