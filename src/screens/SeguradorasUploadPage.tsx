// src/app/SeguradorasUploadPage.tsx (ou pages/SeguradorasUploadPage.tsx)
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
import { Imobiliaria } from "@/types/Imobiliarias";

import { Mail, User, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SeguradorasUploadPage() {
  const [selectedImobiliaria, setSelectedRealEstate] =
    useState<Imobiliaria | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRealEstateSelect = (company: Imobiliaria) => {
    setSelectedRealEstate(company);
    setFiles([]);
  };

  console.log("files: ", files);
  console.log("selectedImobiliaria: ", selectedImobiliaria);

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

  // Verifica se o número de arquivos enviados é suficiente
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
          });
        }
      });

      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSubmit = () => {
    console.log("Submitting files:", files);
    setShowSummary(false);
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setSelectedRealEstate(null);
    setFiles([]);
  };

  const uploadedFilesCount = files.reduce((acc, file) => {
    acc[file.insuranceCompany] = (acc[file.insuranceCompany] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="flex flex-col justfy-center overflow-y-auto max-h-screen">
      <Header />

      <SearchSection onSelect={handleRealEstateSelect} />

      <div className="p-8">
        {selectedImobiliaria && (
          <>
            <Card className="w-full max-w-3xl mx-auto">
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
          </>
        )}

        <div className="">
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
                    disabled={!allFilesUploaded} // Botão desabilitado se os arquivos enviados não forem suficientes
                    className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-shadow ${
                      !allFilesUploaded ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Enviar Boletos
                  </Button>
                </div>

                <SummaryDialog
                  isOpen={showSummary}
                  onClose={() => setShowSummary(false)}
                  onConfirm={handleSubmit}
                  files={files}
                  realEstateName={selectedImobiliaria.nome}
                />

                <ConfirmationModal
                  isOpen={showConfirmation}
                  onClose={handleConfirmationClose}
                  realEstateName={selectedImobiliaria?.nome || ""}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Toaster />
        </div>
      </div>
    </div>
  );
}
