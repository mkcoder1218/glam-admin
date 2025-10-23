import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const YearSelector = ({ selectedYear, onChange }: { selectedYear: number; onChange: (year: number) => void }) => {
  // Generate years dynamically: current year and last 5 years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <Select value={String(selectedYear)} onValueChange={(val) => onChange(Number(val))}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select Year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={String(y)}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default YearSelector;
