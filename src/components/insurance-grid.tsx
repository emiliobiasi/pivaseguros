// src/components/insurance-grid.tsx
import { InsuranceUploadCard } from "@/components/InsuranceUploadCard/isurance-upload-card";
import { Imobiliaria } from "@/types/Imobiliarias";
import { insuranceCompanies } from "@/utils/constants/insuranceCompanies";

interface InsuranceGridProps {
  onFileUpload: (files: File[], company: string) => void;
  uploadedFiles: { [key: string]: number };
  imobiliaria: Imobiliaria; // precisa dos campos qtd_boleto_*
}

export function InsuranceGrid({
  onFileUpload,
  uploadedFiles,
  imobiliaria,
}: InsuranceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto">
      {insuranceCompanies.map((insurance) => {
        // Lê o valor do campo correspondente (ex: qtd_boleto_porto)
        const totalAllowed = Number(imobiliaria[insurance.field]) || 0;

        // Quantos já foram enviados
        const uploadedCount = uploadedFiles[insurance.label] || 0;

        return (
          <InsuranceUploadCard
            key={insurance.label}
            company={insurance.label}
            totalExpectedDocs={totalAllowed}
            uploadedCount={uploadedCount}
            onUpload={(files) => onFileUpload(files, insurance.label)}
          />
        );
      })}
    </div>
  );
}
