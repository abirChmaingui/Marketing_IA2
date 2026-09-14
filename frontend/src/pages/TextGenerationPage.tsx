import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Bell,
  Megaphone,
  Sparkles,
  FileText,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/EmptyState";
import { Loader } from "@/components/Loader";
import { contentChannels, tones, languages, bankingProducts } from "@/services/mockData";
import { toast } from "@/hooks/useToast";
import { cn } from "@/utils";
import type { ContentChannel, TextGenerationResult } from "@/types";
import { textGenerationService, TextGenerationError } from "@/services/textGenerationService";

const iconMap: Record<string, React.ElementType> = {
  Mail,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Bell,
  Megaphone,
};

const textSchema = z
  .object({
    channel: z.string().min(1, "Sélectionnez un canal"),
    campaignName: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    targetAudience: z.string().min(3, "Décrivez le public cible"),
    bankingProduct: z.string().min(1, "Sélectionnez un produit"),
    bankingProductOther: z.string().optional(),
    tone: z.string().min(1, "Sélectionnez un ton"),
    language: z.string().min(1, "Sélectionnez une langue"),
    customPrompt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.bankingProduct === "Autre" && (!data.bankingProductOther || !data.bankingProductOther.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bankingProductOther"],
        message: "Précisez le produit bancaire pour le choix 'Autre'.",
      });
    }
  });

type TextForm = z.infer<typeof textSchema>;

export function TextGenerationPage() {
  const [selectedChannel, setSelectedChannel] = useState<ContentChannel | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<TextGenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TextForm>({
    resolver: zodResolver(textSchema),
    defaultValues: {
      channel: "",
      campaignName: "",
      targetAudience: "",
      bankingProduct: "",
      bankingProductOther: "",
      tone: "",
      language: "fr",
      customPrompt: "",
    },
  });

  const selectedBankingProduct = watch("bankingProduct");

  const handleChannelSelect = (channel: ContentChannel) => {
    setSelectedChannel(channel);
    setValue("channel", channel);
  };

  const onSubmit = async (data: TextForm) => {
    // Empêche les soumissions multiples accidentelles (double-clic, Entrée répétée)
    if (isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const generated = await textGenerationService.generateText(data);
      setResult(generated);
      toast({
        title: "Contenu généré",
        description: "Votre contenu marketing est prêt.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof TextGenerationError
          ? error.message
          : "Une erreur inattendue est survenue lors de la génération.";
      setErrorMessage(message);
      // Les données du formulaire ne sont pas réinitialisées : react-hook-form
      // conserve automatiquement les valeurs saisies après un échec de onSubmit.
      toast({
        title: "Échec de la génération",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const textToCopy = result.subjectLine
      ? `Objet : ${result.subjectLine}\n\n${result.generatedText}`
      : result.generatedText;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      toast({ title: "Copié", description: "Le contenu a été copié dans le presse-papiers.", variant: "success" });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({
        title: "Échec de la copie",
        description: "Impossible d'accéder au presse-papiers.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Header
        title="Génération de texte"
        description="Créez des contenus marketing adaptés à chaque canal de communication"
        breadcrumbs={[{ label: "Génération de texte" }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Paramètres de génération
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Channel selection */}
              <div className="space-y-3">
                <Label>Type de contenu <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {contentChannels.map((ch) => {
                    const Icon = iconMap[ch.icon];
                    return (
                      <button
                        key={ch.value}
                        type="button"
                        onClick={() => handleChannelSelect(ch.value as ContentChannel)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all",
                          selectedChannel === ch.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 hover:bg-accent"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {ch.label}
                      </button>
                    );
                  })}
                </div>
                {errors.channel && <p className="text-sm text-destructive">{errors.channel.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaignName">Nom de la campagne <span className="text-destructive">*</span></Label>
                <Input id="campaignName" placeholder="Ex: Crédit Immobilier Été 2026" {...register("campaignName")} />
                {errors.campaignName && <p className="text-sm text-destructive">{errors.campaignName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Public cible <span className="text-destructive">*</span></Label>
                <Input id="targetAudience" placeholder="Ex: Jeunes actifs 25-35 ans" {...register("targetAudience")} />
                {errors.targetAudience && <p className="text-sm text-destructive">{errors.targetAudience.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Produit bancaire <span className="text-destructive">*</span></Label>
                <Controller
                  name="bankingProduct"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== "Autre") {
                          setValue("bankingProductOther", "");
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankingProducts.map((product) => (
                          <SelectItem key={product} value={product}>{product}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.bankingProduct && <p className="text-sm text-destructive">{errors.bankingProduct.message}</p>}
                {selectedBankingProduct === "Autre" && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="bankingProductOther">Précisez le produit <span className="text-destructive">*</span></Label>
                    <Input
                      id="bankingProductOther"
                      placeholder="Ex : Assurance emprunteur, financement PME..."
                      {...register("bankingProductOther")}
                    />
                    {errors.bankingProductOther && (
                      <p className="text-sm text-destructive">{errors.bankingProductOther.message}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ton <span className="text-destructive">*</span></Label>
                  <Controller
                    name="tone"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tone && <p className="text-sm text-destructive">{errors.tone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Langue <span className="text-destructive">*</span></Label>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((l) => (
                            <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customPrompt">Prompt personnalisé</Label>
                <Textarea
                  id="customPrompt"
                  placeholder="Instructions supplémentaires pour l'IA..."
                  rows={4}
                  {...register("customPrompt")}
                />
              </div>

              <Button type="submit" variant="bank" size="xl" className="w-full" isLoading={isGenerating}>
                <Sparkles className="h-5 w-5" />
                Générer
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result area */}
        <Card>
          <CardHeader>
            <CardTitle>Résultat de la génération</CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex h-64 items-center justify-center">
                <Loader size="lg" text="Génération en cours..." />
              </div>
            ) : errorMessage ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-6 text-center animate-fade-in">
                <AlertTriangle className="h-10 w-10 text-destructive" />
                <p className="text-sm font-medium text-destructive">{errorMessage}</p>
                <p className="text-xs text-muted-foreground">
                  Vos informations saisies ont été conservées, vous pouvez réessayer.
                </p>
              </div>
            ) : result ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={result.compliance.isCompliant ? "success" : "warning"}
                    className="flex items-center gap-1"
                  >
                    {result.compliance.isCompliant ? (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5" />
                    )}
                    {result.compliance.isCompliant ? "Conforme" : "À vérifier"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {result.characterCount} caractères
                  </span>
                </div>

                {!result.compliance.isCompliant && (
                  <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    <p className="mb-1 font-medium">Points à vérifier avant publication :</p>
                    <ul className="list-inside list-disc space-y-0.5">
                      {result.compliance.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 min-h-[220px]">
                  {result.subjectLine && (
                    <p className="mb-3 border-b border-border pb-2 text-sm font-semibold">
                      Objet : {result.subjectLine}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {result.generatedText}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleCopy}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" /> Copié
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copier le contenu
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="Aucun contenu généré"
                description="Configurez les paramètres et cliquez sur Générer pour créer votre contenu marketing."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
