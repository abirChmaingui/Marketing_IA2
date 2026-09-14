import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Video, Sparkles, AlertTriangle, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { videoDurations, videoFormats } from "@/services/mockData";
import { toast } from "@/hooks/useToast";
import type { VideoGenerationResult } from "@/types";
import { videoGenerationService, VideoGenerationError } from "@/services/videoGenerationService";

const videoSchema = z.object({
  description: z.string().min(10, "Décrivez la vidéo en au moins 10 caractères"),
  duration: z.string().min(1, "Sélectionnez une durée"),
  format: z.string().min(1, "Sélectionnez un format"),
});

type VideoForm = z.infer<typeof videoSchema>;

export function VideoGenerationPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<VideoGenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VideoForm>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      description: "",
      duration: "",
      format: "",
    },
  });

  const onSubmit = async (data: VideoForm) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const initial = await videoGenerationService.startGeneration(data);
      setResult(initial);

      if (initial.status === "failed") {
        // Cas notamment : aucun fournisseur vidéo configuré côté backend
        setErrorMessage(initial.message);
        setIsGenerating(false);
        return;
      }

      const final = await videoGenerationService.pollUntilDone(initial.jobId, setResult);

      if (final.status === "failed") {
        setErrorMessage(final.message);
      } else {
        toast({
          title: "Vidéo générée",
          description: "Votre vidéo est prête dans l'aperçu.",
          variant: "success",
        });
      }
    } catch (error) {
      const message =
        error instanceof VideoGenerationError
          ? error.message
          : "Une erreur inattendue est survenue lors de la génération.";
      setErrorMessage(message);
      toast({ title: "Échec de la génération", description: message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Header
        title="Génération de vidéos"
        description="Créez des vidéos marketing engageantes pour vos campagnes bancaires"
        breadcrumbs={[{ label: "Génération de vidéo" }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Paramètres de la vidéo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="description">Description de la vidéo <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le contenu et le scénario de la vidéo..."
                  rows={5}
                  {...register("description")}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Durée <span className="text-destructive">*</span></Label>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir la durée" />
                      </SelectTrigger>
                      <SelectContent>
                        {videoDurations.map((d) => (
                          <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Format <span className="text-destructive">*</span></Label>
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le format" />
                      </SelectTrigger>
                      <SelectContent>
                        {videoFormats.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.format && <p className="text-sm text-destructive">{errors.format.message}</p>}
              </div>

              <Button type="submit" variant="bank" size="xl" className="w-full" isLoading={isGenerating}>
                <Sparkles className="h-5 w-5" />
                Générer
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2">
                <Loader size="lg" text="Génération de la vidéo..." />
                {result && (
                  <p className="text-xs text-muted-foreground">{result.message}</p>
                )}
              </div>
            ) : errorMessage ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-6 text-center animate-fade-in">
                <AlertTriangle className="h-10 w-10 text-destructive" />
                <p className="text-sm font-medium text-destructive">{errorMessage}</p>
                <p className="text-xs text-muted-foreground">
                  Vos paramètres saisis ont été conservés, vous pouvez réessayer.
                </p>
              </div>
            ) : result?.status === "completed" && result.videoUrl ? (
              <div className="aspect-video rounded-lg border border-border overflow-hidden animate-fade-in">
                <video src={result.videoUrl} controls className="h-full w-full" />
              </div>
            ) : result ? (
              <div className="aspect-video rounded-lg border border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-3 animate-fade-in">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{result.message}</p>
              </div>
            ) : (
              <EmptyState
                icon={Video}
                title="Aucune vidéo générée"
                description="Décrivez votre vidéo et lancez la génération pour voir l'aperçu ici."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
