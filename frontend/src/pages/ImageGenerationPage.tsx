import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Image, Sparkles, Palette, AlertTriangle, Download } from "lucide-react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/EmptyState";
import { Loader } from "@/components/Loader";
import { imageStyles, imageSizes } from "@/services/mockData";
import { toast } from "@/hooks/useToast";
import type { ImageGenerationResult } from "@/types";
import { imageGenerationService, ImageGenerationError } from "@/services/imageGenerationService";

const imageSchema = z.object({
  description: z.string().min(10, "Décrivez l'image en au moins 10 caractères"),
  style: z.string().min(1, "Sélectionnez un style"),
  colors: z.string().min(1, "Indiquez les couleurs souhaitées"),
  size: z.string().min(1, "Sélectionnez une taille"),
});

type ImageForm = z.infer<typeof imageSchema>;

export function ImageGenerationPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ImageGenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      description: "",
      style: "",
      colors: "",
      size: "",
    },
  });

  const onSubmit = async (data: ImageForm) => {
    if (isGenerating) return; // évite les doubles soumissions accidentelles

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const generated = await imageGenerationService.generateImages(data);
      setResult(generated);
      toast({
        title: "Images générées",
        description: "Vos visuels sont prêts dans la galerie.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof ImageGenerationError
          ? error.message
          : "Une erreur inattendue est survenue lors de la génération.";
      setErrorMessage(message);
      // Le formulaire n'est pas réinitialisé : les valeurs saisies restent.
      toast({ title: "Échec de la génération", description: message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Header
        title="Génération d'images"
        description="Créez des visuels marketing professionnels pour vos campagnes"
        breadcrumbs={[{ label: "Génération d'image" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="description">Description de l'image <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez l'image que vous souhaitez générer..."
                  rows={4}
                  {...register("description")}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Style <span className="text-destructive">*</span></Label>
                <Controller
                  name="style"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un style" />
                      </SelectTrigger>
                      <SelectContent>
                        {imageStyles.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.style && <p className="text-sm text-destructive">{errors.style.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="colors">Couleurs <span className="text-destructive">*</span></Label>
                <Input id="colors" placeholder="Ex: Bleu, blanc, or" {...register("colors")} />
                {errors.colors && <p className="text-sm text-destructive">{errors.colors.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Taille <span className="text-destructive">*</span></Label>
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une taille" />
                      </SelectTrigger>
                      <SelectContent>
                        {imageSizes.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.size && <p className="text-sm text-destructive">{errors.size.message}</p>}
              </div>

              <Button type="submit" variant="bank" size="xl" className="w-full" isLoading={isGenerating}>
                <Sparkles className="h-5 w-5" />
                Générer
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              Galerie
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex h-64 items-center justify-center">
                <Loader size="lg" text="Génération des images..." />
              </div>
            ) : errorMessage ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-6 text-center animate-fade-in">
                <AlertTriangle className="h-10 w-10 text-destructive" />
                <p className="text-sm font-medium text-destructive">{errorMessage}</p>
                <p className="text-xs text-muted-foreground">
                  Vos paramètres saisis ont été conservés, vous pouvez réessayer.
                </p>
              </div>
            ) : result ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
                {result.images.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <img
                      src={url}
                      alt={`Visuel généré ${i + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Image}
                title="Galerie vide"
                description="Les images générées apparaîtront ici. Configurez les paramètres et lancez la génération."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
