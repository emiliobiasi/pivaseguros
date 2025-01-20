import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchImobiliariaList } from "@/utils/api/ImobiliariasService";
import { Imobiliaria } from "@/types/Imobiliarias";

interface SearchBarProps {
  onSelect: (company: Imobiliaria) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [realEstateCompanies, setRealEstateCompanies] = useState<Imobiliaria[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchTerm) {
        setRealEstateCompanies([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetchImobiliariaList(1, 10, searchTerm);
        setRealEstateCompanies(response.items);
      } catch (error) {
        console.error("Erro ao buscar imobiliárias:", error);
        setRealEstateCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar chamadas desnecessárias
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    // <div className="relative w-full max-w-2xl mx-auto">
    <div className="relative w-full max-w-4xl mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start text-left font-normal border-gray-300 text-black bg-white hover:bg-white hover:text-black"
          >
            <Search className="mr-2 h-4 w-8 shrink-0 text-gray-500" />
            {value ? value : "Buscar imobiliária..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 bg-white" align="start">
          <Command className="bg-white">
            <CommandInput
              placeholder="Digite o nome da imobiliária..."
              className="text-black"
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {loading && (
                <div className="px-4 py-2 text-gray-500">Carregando...</div>
              )}
              <CommandEmpty>Nenhuma imobiliária encontrada.</CommandEmpty>
              <CommandGroup>
                {realEstateCompanies.map((company) => (
                  <CommandItem
                    key={company.id}
                    onSelect={() => {
                      setValue(company.nome); // Ajuste para usar o campo correto
                      onSelect(company);
                      setOpen(false);
                    }}
                    className="text-black"
                  >
                    {company.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
