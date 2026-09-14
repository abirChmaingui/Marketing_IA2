import {
  type LucideIcon,
  Home,
  Car,
  Shield,
  PiggyBank,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CampaignCard } from "@/components/CampaignCard";
import { mockTemplates } from "@/services/mockData";
import { toast } from "@/hooks/useToast";

const iconMap: Record<string, LucideIcon> = {
  Home,
  Car,
  Shield,
  PiggyBank,
  CreditCard,
  Smartphone,
};

export function TemplatesPage() {
  const navigate = useNavigate();

  const handleUseTemplate = (title: string) => {
    toast({
      title: "Modèle sélectionné",
      description: `Le modèle "${title}" a été chargé. Redirection vers la génération...`,
      variant: "success",
    });
    navigate("/text-generation");
  };

  return (
    <div className="space-y-8">
      <Header
        title="Bibliothèque de modèles"
        description="Utilisez des modèles prêts à l'emploi pour vos campagnes marketing bancaires"
        breadcrumbs={[{ label: "Modèles" }]}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockTemplates.map((template) => {
          const Icon = iconMap[template.icon] || Home;
          return (
            <CampaignCard
              key={template.id}
              title={template.title}
              description={template.description}
              category={template.category}
              previewClass={template.preview}
              icon={Icon}
              onUse={() => handleUseTemplate(template.title)}
              className="animate-fade-in"
            />
          );
        })}
      </div>
    </div>
  );
}
