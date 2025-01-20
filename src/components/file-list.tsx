import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { UploadedFile } from "../types/Insurance";
import { AnimatePresence, motion } from "framer-motion";

interface FileListProps {
  files: UploadedFile[];
  onDelete: (id: string) => void;
}

export function FileList({ files, onDelete }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">
            {/* <TableHead className="hover:bg-transparent"> */}
              Nome do Arquivo
            </TableHead>
            <TableHead className="">Tipo</TableHead>
            <TableHead className="">Seguradora</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className=" w-[100px]">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {files.map((file) => (
              <motion.tr
                key={file.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TableCell className="text-black">{file.name}</TableCell>
                <TableCell className="text-black">{file.type}</TableCell>
                <TableCell className="text-black">
                  {file.insuranceCompany}
                </TableCell>
                <TableCell className="text-black">
                  {file.status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(file.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
