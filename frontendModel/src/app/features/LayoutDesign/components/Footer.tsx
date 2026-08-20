import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS, type Product } from "@/constants/products";

interface FooterProps {
  product: Product;
  onProductChange: (product: Product) => void;
}

export function Footer({ product, onProductChange }: FooterProps) {
  return (
    <footer className="h-14 bg-white border-t flex items-center justify-center gap-3 px-4 shrink-0">
      <span className="text-sm text-gray-500 font-medium">Produto:</span>
      <Select
        value={product.id}
        onValueChange={(id) => {
          const nextProduct = PRODUCTS.find((item) => item.id === id);
          if (nextProduct) onProductChange(nextProduct);
        }}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Selecione um produto" />
        </SelectTrigger>
        <SelectContent>
          {PRODUCTS.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </footer>
  );
}
