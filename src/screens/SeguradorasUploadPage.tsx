import { useState } from "react";
import { Header } from "@/components/header";
import { SearchSection } from "@/components/search-section";
import { InsuranceGrid } from "@/components/insurance-grid";
import { FileList } from "@/components/file-list";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/types/insurance";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryDialog } from "@/components/summary-dialog";
import { UploadInstructions } from "@/components/upload-instructions";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { ErrorModal } from "@/components/error-modal"; // Importe o novo modal de erro
import { Imobiliaria } from "@/types/Imobiliarias";

import { Mail, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createEnvioDeBoletos } from "@/utils/api/EnvioDeBoletosService";

export default function SeguradorasUploadPage() {
  const [selectedImobiliaria, setSelectedRealEstate] =
    useState<Imobiliaria | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // Modal de sucesso
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Modal de erro
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRealEstateSelect = (company: Imobiliaria) => {
    setSelectedRealEstate(company);
    setFiles([]);
  };

  // Soma o total de boletos exigidos
  const getTotalRequiredFiles = (imobiliaria: Imobiliaria | null) => {
    if (!imobiliaria) return 0;

    return (
      (imobiliaria.qtd_boleto_porto || 0) +
      (imobiliaria.qtd_boleto_potencial || 0) +
      (imobiliaria.qtd_boleto_tokio || 0) +
      (imobiliaria.qtd_boleto_too || 0)
    );
  };

  const totalRequiredFiles = getTotalRequiredFiles(selectedImobiliaria);
  const allFilesUploaded = files.length === totalRequiredFiles;

  const handleFileUpload = (newFiles: File[], company: string) => {
    setFiles((prevFiles) => {
      const updated = [...prevFiles];

      newFiles.forEach((file) => {
        const alreadyExists = updated.some(
          (f) => f.name === file.name && f.insuranceCompany === company
        );
        if (!alreadyExists) {
          updated.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type.includes("pdf") ? "PDF" : "Excel",
            insuranceCompany: company,
            status: "success",
            content: "",
          });
        }
      });

      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSubmit = async () => {
    if (!selectedImobiliaria) return;

    try {
      // Preparar os arquivos como uma lista de File
      const arquivos = files.map((file) => {
        // Se já for instância de File, retorne diretamente
        if (file instanceof File) {
          return file;
        }
        // Caso contrário, cria uma nova instância de File a partir do conteúdo
        return new File([file.content || ""], file.name, { type: file.type });
      });

      // Dados regulares do envio
      const envioData = {
        imobiliaria: selectedImobiliaria.id,
        finalizado: true,
      };

      // Chamar o serviço de criação
      const response = await createEnvioDeBoletos(envioData, arquivos);
      console.log("Envio de boletos criado com sucesso:", response);

      // Fecha o sumário, abre o modal de sucesso
      setShowSummary(false);
      setShowConfirmation(true);

      // NÃO limpamos o estado aqui, para não sumir o selectedImobiliaria
      // Senão, o modal de sucesso não aparece (por causa do render condicional)
    } catch (error) {
      console.error("Erro ao criar o envio de boletos:", error);

      // Abre o modal de erro
      setErrorMessage(
        "Houve um erro ao criar o envio de boletos. Tente novamente."
      );
      setShowError(true);
    }
  };

  // Fecha modal de sucesso e, agora sim, limpa a imobiliária e arquivos
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setSelectedRealEstate(null);
    setFiles([]);
  };

  // Fecha modal de erro
  const handleErrorClose = () => {
    setShowError(false);
    setErrorMessage("");
  };

  // Conta quantos arquivos já foram enviados por seguradora
  const uploadedFilesCount = files.reduce((acc, file) => {
    acc[file.insuranceCompany] = (acc[file.insuranceCompany] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="flex flex-col justfy-center overflow-y-auto max-h-screen">
      <Header />
      <SearchSection onSelect={handleRealEstateSelect} />

      <div className="p-8">
        {/* Renderiza o card de dados da imobiliária */}
        {selectedImobiliaria && (
          <Card className="w-full max-w-3xl mx-auto mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {selectedImobiliaria?.nome ||
                        "Imobiliária não encontrada"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedImobiliaria?.email ||
                        "Imobiliária não encontrada"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedImobiliaria?.username ||
                        "Imobiliária não encontrada"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <AnimatePresence mode="wait">
          {selectedImobiliaria && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="container mx-auto py-8 space-y-8"
            >
              <UploadInstructions />

              <InsuranceGrid
                onFileUpload={handleFileUpload}
                uploadedFiles={uploadedFilesCount}
                imobiliaria={selectedImobiliaria}
              />

              <FileList files={files} onDelete={handleDelete} />

              <div className="flex justify-center mt-4">
                <Button
                  size="lg"
                  onClick={() => setShowSummary(true)}
                  disabled={!allFilesUploaded}
                  className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-shadow ${
                    !allFilesUploaded ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Enviar Boletos
                </Button>
              </div>

              {/* Modal de sumário antes do envio */}
              <SummaryDialog
                isOpen={showSummary}
                onClose={() => setShowSummary(false)}
                onConfirm={handleSubmit}
                files={files}
                realEstateName={selectedImobiliaria?.nome || ""}
              />

              {/* Modal de sucesso (fica no mesmo bloco, pois depende de selectedImobiliaria) */}
              <ConfirmationModal
                isOpen={showConfirmation}
                onClose={handleConfirmationClose}
                realEstateName={selectedImobiliaria?.nome || ""}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modais de Erro e Sucesso podem ficar fora do bloco condicional também,
            caso queira que fiquem sempre montados. Neste exemplo, o de erro fica fora,
            pois não depende de selectedImobiliaria. */}
        <ErrorModal
          isOpen={showError}
          onClose={handleErrorClose}
          errorMessage={errorMessage}
        />

        <Toaster />
      </div>
    </div>
  );
}
