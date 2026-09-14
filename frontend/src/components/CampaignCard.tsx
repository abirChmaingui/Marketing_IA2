import { type LucideIcon } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";

interface CampaignCardProps {
  title: string;
  description: string;
  category: string;
  previewClass: string;
  icon: LucideIcon;
  onUse?: () => void;
  className?: string;
}

export function CampaignCard({
  title,
  description,
  category,
  previewClass,
  icon: Icon,
  onUse,
  className,
}: CampaignCardProps) {
  return (
    <Card className={cn("group overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
      <div className={cn("h-32 flex items-center justify-center", previewClass)}>
        <Icon className="h-12 w-12 text-white/90 transition-transform group-hover:scale-110" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="bank" className="w-full" onClick={onUse}>
          Utiliser
        </Button>
      </CardFooter>
    </Card>
  );
}
