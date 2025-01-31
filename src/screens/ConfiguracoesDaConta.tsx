import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Pencil } from "lucide-react";
import { ProfileEditDialog } from "@/components/profile-edit-dialog";
import { PasswordForm } from "@/components/password-form";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import pb from "@/utils/backend/pb";

export default function ConfiguracoesDaConta() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const currentUser = pb.authStore.model;
  const currentUserId = currentUser?.id;
  const currentUserEmail = currentUser?.email;
  const currentUserName = currentUser?.nome;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="mb-6 text-center">Configurações da Conta</h1>

      {/* ALTERAR EMAIL OU NOME */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Usuário</CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais e da imobiliária
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p>
                <strong>Email:</strong> {currentUserEmail}
              </p>
              <p>
                <strong>Nome da Imobiliária:</strong> {currentUserName}
              </p>
            </div>
            <Button onClick={() => setIsEditingProfile(true)} variant="outline">
              <Pencil className="mr-2 h-4 w-4" /> Editar Perfil
            </Button>
          </div>
          <ProfileEditDialog
            open={isEditingProfile}
            onOpenChange={setIsEditingProfile}
            imobiliariaId={currentUserId} // Exemplo
          />
        </CardContent>
      </Card>

      {/* ALTERAR SENHA */}
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>
            Atualize sua senha para manter sua conta segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditingPassword ? (
            <PasswordForm onCancel={() => setIsEditingPassword(false)} />
          ) : (
            <Button
              onClick={() => setIsEditingPassword(true)}
              variant="outline"
            >
              <Pencil className="mr-2 h-4 w-4" /> Alterar Senha
            </Button>
          )}
        </CardContent>
      </Card>

      {/* APAGAR CONTA */}
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            <AlertCircle className="h-5 w-4" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis para sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Apagar sua conta é uma ação permanente e não pode ser desfeita.
            Todos os seus dados serão perdidos.
          </p>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Apagar Minha Conta
          </Button>
          <DeleteAccountDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
}
