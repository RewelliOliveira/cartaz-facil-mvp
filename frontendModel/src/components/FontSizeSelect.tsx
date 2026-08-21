import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GOOGLE_FONTS, injectGoogleFont } from "@/utils/fonts";
import { useEffect } from "react";

interface FontSizeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function FontSizeSelect({
  value,
  onChange,
  disabled,
}: FontSizeSelectProps) {
  useEffect(() => {
    injectGoogleFont(value);
  }, [value]);

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(nextValue) => {
        if (nextValue) onChange(nextValue);
      }}
    >
      <SelectTrigger className="w-52" disabled={disabled}>
        <SelectValue placeholder="Fonte" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {GOOGLE_FONTS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

