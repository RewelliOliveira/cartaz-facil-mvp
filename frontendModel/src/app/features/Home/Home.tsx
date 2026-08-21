import { useNavigate } from "react-router-dom";
import { Printer, PlusSquare, UploadCloud, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NAV_ROUTES } from "@/routes/router-config";

export function Home() {
  const navigate = useNavigate();

  const options = [
    {
      id: "impressao-lote",
      title: "Impressão em lote",
      subtitle: "Impressão diaria",
      description: "Selecione múltiplos produtos e imprima etiquetas em lote com apenas um clique.",
      icon: Printer,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
      borderColor: "hover:border-blue-500/50",
      onClick: () => navigate(NAV_ROUTES.componentesProntos.url),
    },
    {
      id: "cartaz-unitario",
      title: "Cartaz Unitario",
      subtitle: "Criar Cartazes",
      description: "Crie e edite cartazes e etiquetas personalizadas do zero para produtos específicos.",
      icon: PlusSquare,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "hover:border-emerald-500/50",
      onClick: () => navigate(NAV_ROUTES.cartazUnitario.url),
    },
    {
      id: "importar-lista",
      title: "Importar Lista",
      subtitle: "Importar dados",
      description: "Carregue listas de produtos via arquivo CSV ou integração para preenchimento rápido.",
      icon: UploadCloud,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
      borderColor: "hover:border-amber-500/50",
      onClick: () => navigate(NAV_ROUTES.componentesProntos.url),
    },
  ];

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto max-w-7xl mx-auto w-full">
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Sistema de Cartazes
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          O que você deseja fazer hoje?
        </h1>
        <p className="text-muted-foreground text-base mt-2 max-w-2xl">
          Escolha uma das opções abaixo para iniciar o processo de criação ou impressão de cartazes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {options.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.id}
              onClick={item.onClick}
              className={`group relative flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${item.borderColor} p-2`}
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3.5 rounded-xl ${item.bgColor} ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.subtitle}
                  </span>
                  <CardTitle className="text-xl font-bold mt-0.5 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
