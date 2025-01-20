"use client";

import { Upload, X, FileIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { InsuranceRule } from "../types/Insurance";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface FileUploadProps {
  rules: InsuranceRule;
  onFilesChange: (files: File[]) => void;
}

export function FileUpload({ rules, onFilesChange }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploading(true);
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            setUploading(false);
            onFilesChange(acceptedFiles);
            toast.success("Arquivo enviado com sucesso!");
            return 0;
          }
          return oldProgress + 10;
        });
      }, 200);
    },
    [onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      maxFiles: 1,
    });

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
      >
        <input {...getInputProps()} />
        <AnimatePresence>
          {acceptedFiles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "Solte o arquivo aqui..."
                  : "Arraste e solte um arquivo aqui, ou clique para selecionar"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center space-x-2"
            >
              <FileIcon className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium">
                {acceptedFiles[0].name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {uploading && <Progress value={progress} className="w-full mt-4" />}
      </div>
    </div>
  );
}
