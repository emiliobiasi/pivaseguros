'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { insuranceRules } from '@/data/insurance-rules'

interface InsuranceCompanySelectProps {
  onSelect: (company: string) => void
}

export function InsuranceCompanySelect({ onSelect }: InsuranceCompanySelectProps) {
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

