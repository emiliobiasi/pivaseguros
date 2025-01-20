// src/components/InsuranceUploadCard/isurance-upload-card.tsx
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useCallback } from "react";
import { toast } from "sonner";

const insuranceColors = {
  PORTO: {
    bg: "bg-[#01a0fb]",
    border: "border-[#01a0fb]",
    text: "text-[#01a0fb]",
    hover: "hover:bg-[#01a0fb]/10",
  },
  POTENCIAL: {
    bg: "bg-[#FD6414]",
    border: "border-[#FD6414]",
    text: "text-[#FD6414]",
    hover: "hover:bg-[#FD6414]/10",
  },
  TOKIO: {
    bg: "bg-[#01745B]",
    border: "border-[#01745B]",
    text: "text-[#01745B]",
    hover: "hover:bg-[#01745B]/10",
  },
  TOO: {
    bg: "bg-[#6AB5B9]",
    border: "border-[#6AB5B9]",
    text: "text-[#6AB5B9]",
    hover: "hover:bg-[#6AB5B9]/10",
  },
} as const;

interface InsuranceUploadCardProps {
  company: string;
  uploadedCount: number;
  totalExpectedDocs: number;
  onUpload: (files: File[]) => void;
}

export function InsuranceUploadCard({
  company,
  uploadedCount,
  totalExpectedDocs,
  onUpload,
}: InsuranceUploadCardProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Se a seguradora não estiver no mapeamento, use cores genéricas
  const colors = insuranceColors[company as keyof typeof insuranceColors] || {
    bg: "bg-gray-200",
    border: "border-gray-300",
    text: "text-gray-700",
    hover: "hover:bg-gray-100",
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Se já atingiu o limite, não faz nada.
      if (uploadedCount >= totalExpectedDocs) {
        toast.error("Limite de boletos para esta seguradora já foi atingido!");
        return;
      }

      if (acceptedFiles.length === 0) return;

      setUploading(true);
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
            setUploading(false);
            onUpload(acceptedFiles);
            toast.success(
              `${acceptedFiles.length} arquivo(s) enviado(s) com sucesso para ${company}!`
            );
            return 0;
          }
          return oldProgress + 10;
        });
      }, 200);
    },
    [uploadedCount, totalExpectedDocs, company, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  return (
    <Card className={`overflow-hidden ${colors.border}`}>
      <CardHeader className={`bg-opacity-10 ${colors.bg}`}>
        <CardTitle
          className={`flex items-center justify-between ${colors.text}`}
        >
          <span>{company}</span>
          <Badge
            variant="secondary"
            className={`${colors.bg} text-white font-bold px-3 py-1`}
          >
            {uploadedCount} / {totalExpectedDocs} boletos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
          ${
            isDragActive
              ? `${colors.bg}/10`
              : `${colors.border} ${colors.hover}`
          }
        `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 min-h-[120px]">
            {!uploading && (
              <>
                <Upload className={`h-8 w-8 ${colors.text}`} />
                <div className="text-center space-y-1">
                  <p className={`font-medium ${colors.text}`}>
                    Arraste arquivos aqui
                  </p>
                  <p className={`text-sm ${colors.text} opacity-75`}>
                    ou clique para selecionar
                  </p>
                </div>
              </>
            )}
            {uploading && (
              <div className="w-full space-y-2">
                <p className={`text-sm ${colors.text} text-center`}>
                  Enviando arquivo...
                </p>
                {/* 
                  Para customizar a cor da barra, usamos o seletor de filho do Tailwind: 
                  [&>div]:bg-[color]
                */}
                <Progress
                  value={progress}
                  className={`w-full [&>div]:${colors.bg.replace(
                    "bg-",
                    "bg-"
                  )}`}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
