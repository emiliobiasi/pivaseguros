// src/app/SeguradorasUploadPage.tsx (ou pages/SeguradorasUploadPage.tsx)
import { useState } from "react";
import { Header } from "@/components/header";
import { SearchSection } from "@/components/search-section";
import { InsuranceGrid } from "@/components/insurance-grid";
import { FileList } from "@/components/file-list";
import { Button } from "@/components/ui/button";
import { UploadedFile, RealEstate } from "@/types/Insurance";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryDialog } from "@/components/summary-dialog";
import { UploadInstructions } from "@/components/upload-instructions";
import { ConfirmationModal } from "@/components/confirmation-modal";
// Se você tiver o tipo Imobiliaria:
import { Imobiliaria } from "@/types/Imobiliarias";

export default function SeguradorasUploadPage() {
  const [selectedRealEstate, setSelectedRealEstate] =
    useState<RealEstate | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRealEstateSelect = (company: RealEstate) => {
    // Aqui você pode fazer uma busca adicional no banco
    // ex: fetchImobiliariaById(company.id).then(setSelectedRealEstateFull);
    setSelectedRealEstate(company);
    setFiles([]);
  };

  // const handleFileUpload = (newFiles: File[], company: string) => {
  //   const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
  //     id: Math.random().toString(36).substr(2, 9),
  //     name: file.name,
  //     type: file.type.includes("pdf") ? "PDF" : "Excel",
  //     insuranceCompany: company,
  //     status: "success",
  //   }));
  //   setFiles((prev) => [...prev, ...uploadedFiles]);
  // };

  const handleFileUpload = (newFiles: File[], company: string) => {
    setFiles((prevFiles) => {
      const updated = [...prevFiles]
  
      newFiles.forEach((file) => {
        const alreadyExists = updated.some(
          (f) => f.name === file.name && f.insuranceCompany === company
        )
        if (!alreadyExists) {
          updated.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type.includes("pdf") ? "PDF" : "Excel",
            insuranceCompany: company,
            status: "success",
          })
        }
      })
  
      console.log("Updated files:", updated)

      return updated
    })
  }

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
    // <div className="min-h-screen bg-white">
    <div className="flex flex-col p-4 overflow-y-auto max-h-screen">
      <Header />

      <SearchSection onSelect={handleRealEstateSelect} />

      <div className="">
        <AnimatePresence mode="wait">
          {selectedRealEstate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="container mx-auto py-8 space-y-8"
            >
              <UploadInstructions />

              {/* 
              Aqui passamos a imobiliaria. 
              Forçando o cast se RealEstate != Imobiliaria. 
              O ideal seria:  imobiliaria={selectedRealEstate} 
              caso selectedRealEstate seja do tipo Imobiliaria
            */}
              <InsuranceGrid
                onFileUpload={handleFileUpload}
                uploadedFiles={uploadedFilesCount}
                imobiliaria={selectedRealEstate as unknown as Imobiliaria}
              />

              <FileList files={files} onDelete={handleDelete} />

              {files.length > 0 && (
                <div className="flex justify-end mt-4">
                  <Button
                    size="lg"
                    onClick={() => setShowSummary(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Enviar Boletos
                  </Button>
                </div>
              )}

              <SummaryDialog
                isOpen={showSummary}
                onClose={() => setShowSummary(false)}
                onConfirm={handleSubmit}
                files={files}
                realEstateName={selectedRealEstate.name}
              />

              <ConfirmationModal
                isOpen={showConfirmation}
                onClose={handleConfirmationClose}
                realEstateName={selectedRealEstate?.name || ""}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </div>
    </div>
  );
}
