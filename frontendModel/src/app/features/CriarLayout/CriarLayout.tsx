import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TEMPLATE_SIZES } from "@/constants/mockData";
import { NAV_ROUTES } from "@/routes/router-config";

export function CriarLayout() {
  const navigate = useNavigate();

  function handleSelectSize(sizeIndex: number) {
    const size = TEMPLATE_SIZES[sizeIndex];
    navigate(NAV_ROUTES.layoutDesign.url, {
      state: {
        mode: "create",
        sizeConfig: {
          label: size.label,
          width: size.width,
          height: size.height,
          starterElements: size.starterElements,
        },
      },
    });
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Plus className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Criar Novo Layout</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Escolha o tamanho da etiqueta para começar um layout do zero.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATE_SIZES.map((size, index) => {
          const widthCm = parseFloat(size.width);
          const heightCm = parseFloat(size.height);
          const previewScale = 120 / (heightCm * 37.8);

          return (
            <Card
              key={size.label}
              className="flex flex-col hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="pb-2">
                <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center mb-3 overflow-hidden">
                  <div
                    style={{
                      transformOrigin: "center center",
                      transform: `scale(${previewScale})`,
                      width: size.width,
                      height: size.height,
                      background: "white",
                      border: "1px solid #e5e7eb",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FileText
                      style={{ width: `${Math.min(widthCm * 0.3, 1)}cm`, opacity: 0.2 }}
                    />
                  </div>
                </div>
                <CardTitle className="text-base leading-tight">{size.label}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2 flex-1">
                <p className="text-xs text-muted-foreground">{size.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Elementos iniciais:{" "}
                  <span className="font-medium text-foreground">
                    {size.starterElements.length} campos
                  </span>
                </p>
              </CardContent>
              <CardFooter className="pt-3 border-t border-border">
                <Button
                  id={`btn-criar-${index}`}
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleSelectSize(index)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Criar com este tamanho
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
