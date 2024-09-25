import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle } from "lucide-react";
import { SeguroIncendio } from "@/types/SeguroIncendio";
import { SeguroIncendioModal } from "../SeguroIncendioModal/seguro-incendio-modal";

// Props para o componente TableContent
type TableContentProps = {
  data: SeguroIncendio[];
};

export function IncendioTable({ data }: TableContentProps) {
  const [seguros, setSeguros] = useState<SeguroIncendio[]>(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeguro, setSelectedSeguro] = useState<SeguroIncendio | null>(
    null
  );

  // Atualiza o estado "seguros" sempre que a prop "data" mudar
  useEffect(() => {
    setSeguros(data);
  }, [data]);

  const handleAcaoChange = (
    id: string,
    novaAcao: "PENDENTE" | "FINALIZADO"
  ) => {
    setSeguros((prevSeguros) =>
      prevSeguros.map((seguro) =>
        seguro.id === id ? { ...seguro, acao: novaAcao } : seguro
      )
    );
  };

  const openUserModal = (seguro: SeguroIncendio) => {
    setSelectedSeguro(seguro);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSeguro(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableHead className="px-3 py-2 lg:px-6 lg:py-3">ID</TableHead>
                <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                  Ação
                </TableHead>
                <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                  Nome da Imobiliária
                </TableHead>
                <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                  Nome do Locatário
                </TableHead>
                <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                  Data de Nascimento
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seguros.map((seguro) => (
                <TableRow
                  key={seguro.id}
                  className={
                    seguro.acao === "FINALIZADO"
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                    {seguro.id}
                  </TableCell>
                  <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                    <Select
                      value={seguro.acao}
                      onValueChange={(value) =>
                        handleAcaoChange(
                          seguro.id,
                          value as "PENDENTE" | "FINALIZADO"
                        )
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDENTE">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                            <span>Pendente</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="FINALIZADO">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            <span>Finalizado</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                    <button
                      onClick={() => openUserModal(seguro)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {seguro.nome_imobiliaria}
                    </button>
                  </TableCell>
                  <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                    {seguro.nome_locatario}
                  </TableCell>
                  <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                    {new Date(
                      seguro.data_nascimento_locatario
                    ).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal - renderizado condicionalmente */}
      {selectedSeguro && (
        <SeguroIncendioModal
          seguro={selectedSeguro}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
