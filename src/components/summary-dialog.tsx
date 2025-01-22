import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, CheckCircle } from "lucide-react";
import { UploadedFile } from "@/types/insurance";

interface SummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  files: UploadedFile[];
  realEstateName: string;
}

export function SummaryDialog({
  isOpen,
  onClose,
  onConfirm,
  files,
  realEstateName,
}: SummaryDialogProps) {
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.insuranceCompany]) {
      acc[file.insuranceCompany] = [];
    }
    acc[file.insuranceCompany].push(file);
    return acc;
  }, {} as Record<string, UploadedFile[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-green-800">Resumo do Envio</DialogTitle>
          <DialogDescription className="">
            Confira os arquivos que serão enviados para {realEstateName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="space-y-6 pr-4">
            {Object.entries(groupedFiles).map(([company, companyFiles]) => (
              <div key={company} className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-green-700">
                  {company}
                  <span className="text-sm text-green-600 font-normal">
                    ({companyFiles.length} arquivos)
                  </span>
                </h3>
                <div className="space-y-2">
                  {companyFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 bg-white-50 rounded-lg"
                    >
                      <FileIcon className="h-4 w-4 text-green-600" />
                      <span className="flex-1 text-sm ">{file.name}</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-black bg-white border border-black hover:text-white hover:bg-black"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="text-white bg-green-800 hover:bg-green-600"
          >
            Confirmar Envio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
