import api from "./api";
import { ApiError, toUserFacingApiError } from "./apiErrorHandler";
import type { VideoGenerationResult, VideoJobStatus } from "@/types";

const VALID_DURATIONS = ["15", "30", "60", "120"];
const VALID_FORMATS = ["16:9", "9:16", "1:1", "4:5"];

export interface VideoGenerationFormInput {
  description: string;
  duration: string;
  format: string;
}

interface VideoGenerationApiRequest {
  description: string;
  duration: string;
  format: string;
}

interface VideoGenerationApiResponse {
  job_id: string;
  status: VideoJobStatus;
  video_url?: string | null;
  message: string;
}

export { ApiError as VideoGenerationError };

function mapFormToApiRequest(form: VideoGenerationFormInput): VideoGenerationApiRequest {
  if (!VALID_DURATIONS.includes(form.duration)) {
    throw new ApiError(`Durée non reconnue : "${form.duration}".`);
  }
  if (!VALID_FORMATS.includes(form.format)) {
    throw new ApiError(`Format non reconnu : "${form.format}".`);
  }
  return { description: form.description, duration: form.duration, format: form.format };
}

function mapApiResponseToResult(data: VideoGenerationApiResponse): VideoGenerationResult {
  return {
    jobId: data.job_id,
    status: data.status,
    videoUrl: data.video_url ?? undefined,
    message: data.message,
  };
}

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes max

export const videoGenerationService = {
  /** Crée le job de génération vidéo (retourne immédiatement). */
  async startGeneration(form: VideoGenerationFormInput): Promise<VideoGenerationResult> {
    try {
      const payload = mapFormToApiRequest(form);
      const { data } = await api.post<VideoGenerationApiResponse>(
        "/generate/video",
        payload,
        { timeout: 15000 }
      );
      return mapApiResponseToResult(data);
    } catch (error) {
      throw toUserFacingApiError(error, "La génération de vidéo");
    }
  },

  /**
   * Interroge périodiquement le statut du job jusqu'à complétion, échec,
   * ou expiration du délai maximal. `onUpdate` permet d'informer l'UI à
   * chaque nouvelle réponse (utile si le message change en cours de route).
   */
  async pollUntilDone(
    jobId: string,
    onUpdate?: (result: VideoGenerationResult) => void
  ): Promise<VideoGenerationResult> {
    const startedAt = Date.now();

    while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
      let result: VideoGenerationResult;
      try {
        const { data } = await api.get<VideoGenerationApiResponse>(
          `/generate/video/${jobId}`
        );
        result = mapApiResponseToResult(data);
      } catch (error) {
        throw toUserFacingApiError(error, "Le suivi de la génération vidéo");
      }

      onUpdate?.(result);

      if (result.status === "completed" || result.status === "failed") {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    throw new ApiError(
      "La génération vidéo prend plus de temps que prévu. Réessayez plus tard ou vérifiez l'historique."
    );
  },
};
