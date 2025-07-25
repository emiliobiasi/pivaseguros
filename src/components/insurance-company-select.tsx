import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InsuranceRule } from "@/types/Insurance"

interface InsuranceCompanySelectProps {
  onSelect: (company: string) => void;
  insuranceRules: InsuranceRule[]; // Agora recebe a lista de regras como prop
}

export function InsuranceCompanySelect({ onSelect, insuranceRules }: InsuranceCompanySelectProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a seguradora" />
        </SelectTrigger>
        <SelectContent>
          {insuranceRules.map((rule) => (
            <SelectItem key={rule.company} value={rule.company}>
              {rule.company}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
