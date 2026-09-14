import api from "./api";
import { ApiError, toUserFacingApiError } from "./apiErrorHandler";
import type { ImageGenerationResult } from "@/types";

// Correspond exactement aux valeurs de src/services/mockData.ts
// (imageStyles, imageSizes) déjà utilisées par le formulaire.
const VALID_STYLES = ["modern", "minimal", "corporate", "creative"];
const VALID_SIZES = ["1080x1080", "1920x1080", "1080x1920", "1200x628"];

export interface ImageGenerationFormInput {
  description: string;
  style: string;
  colors: string;
  size: string;
}

interface ImageGenerationApiRequest {
  description: string;
  style: string;
  colors: string;
  size: string;
}

interface ImageGenerationApiResponse {
  images: string[];
  prompt_used: string;
  model: string;
}

export { ApiError as ImageGenerationError };

function mapFormToApiRequest(form: ImageGenerationFormInput): ImageGenerationApiRequest {
  if (!VALID_STYLES.includes(form.style)) {
    throw new ApiError(`Style non reconnu : "${form.style}".`);
  }
  if (!VALID_SIZES.includes(form.size)) {
    throw new ApiError(`Taille non reconnue : "${form.size}".`);
  }

  return {
    description: form.description,
    style: form.style,
    colors: form.colors,
    size: form.size,
  };
}

function mapApiResponseToResult(data: ImageGenerationApiResponse): ImageGenerationResult {
  return {
    images: data.images,
    promptUsed: data.prompt_used,
    model: data.model,
  };
}

export const imageGenerationService = {
  /**
   * Appelle POST /generate/image. La génération peut prendre du temps
   * (3 images séquentielles côté backend) : timeout étendu à 90s.
   */
  async generateImages(form: ImageGenerationFormInput): Promise<ImageGenerationResult> {
    try {
      const payload = mapFormToApiRequest(form);
      const { data } = await api.post<ImageGenerationApiResponse>(
        "/generate/image",
        payload,
        { timeout: 90000 }
      );
      return mapApiResponseToResult(data);
    } catch (error) {
      throw toUserFacingApiError(error, "La génération d'image");
    }
  },
};
