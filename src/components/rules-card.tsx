import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsuranceRule } from "../types/Insurance";
import { FileType, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RulesCardProps {
  rules: InsuranceRule;
}

export function RulesCard({ rules }: RulesCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-6 w-6" />
          {rules.company}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {rules.rules.map((rule, index) => (
            <li
              key={index}
              className="flex items-center gap-2 p-2 rounded-md bg-secondary"
            >
              <FileType className="h-5 w-5 text-primary" />
              <span className="flex-grow">{rule.documentType}</span>
              <Badge variant="outline">{rule.type}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
