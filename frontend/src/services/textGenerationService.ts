import axios from "axios";
import api from "./api";
import type { ComplianceCheck, TextGenerationResult } from "@/types";

/**
 * Données telles que produites par le formulaire de TextGenerationPage
 * (validées par Zod, donc garanties non vides à l'exécution — voir
 * mapFormToApiRequest qui valide en plus l'appartenance aux valeurs
 * connues avant l'envoi).
 *
 * Volontairement typé en `string` simple plutôt qu'avec les unions
 * strictes du type global `TextGenerationForm` : c'est la forme réelle
 * inférée par le schéma Zod local du formulaire.
 */
export interface TextGenerationFormInput {
  channel: string;
  campaignName: string;
  targetAudience: string;
  bankingProduct: string;
  bankingProductOther?: string;
  tone: string;
  language: string;
  customPrompt?: string;
}

/**
 * Le backend attend des libellés français exacts (ex: "Email", "Commercial",
 * "Français") alors que le formulaire frontend utilise des valeurs internes
 * courtes en anglais (ex: "email", "commercial", "fr") — plus adaptées à une
 * future internationalisation de l'UI.
 *
 * Ces tables de correspondance isolent cette différence ici, dans le
 * service, sans impacter le formulaire ni le backend.
 */
const CHANNEL_TO_CONTENT_TYPE: Record<string, string> = {
  email: "Email",
  sms: "SMS",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  notification: "Notification",
  advertisement: "Publicité",
};

const TONE_TO_LABEL: Record<string, string> = {
  professional: "Professionnel",
  commercial: "Commercial",
  friendly: "Amical",
};

const LANGUAGE_TO_LABEL: Record<string, string> = {
  fr: "Français",
  en: "Anglais",
  es: "Espagnol",
  de: "Allemand",
};

// Format exact attendu par POST /generate/text (voir doc backend)
interface TextGenerationApiRequest {
  content_type: string;
  campaign_name: string;
  target_audience: string;
  banking_product: string;
  tone: string;
  language: string;
  custom_prompt?: string;
}

// Format exact renvoyé par POST /generate/text
interface TextGenerationApiResponse {
  campaign_name: string;
  content_type: string;
  generated_text: string;
  subject_line?: string | null;
  character_count: number;
  compliance: { is_compliant: boolean; issues: string[] };
  tokens_used: number;
  model: string;
}

export class TextGenerationError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "TextGenerationError";
    this.status = status;
  }
}

function mapFormToApiRequest(form: TextGenerationFormInput): TextGenerationApiRequest {
  const contentType = CHANNEL_TO_CONTENT_TYPE[form.channel];
  const tone = TONE_TO_LABEL[form.tone];
  const language = LANGUAGE_TO_LABEL[form.language] ?? "Français";
  const bankingProduct =
    form.bankingProduct === "Autre"
      ? form.bankingProductOther?.trim() || "Autre"
      : form.bankingProduct;

  if (!contentType) {
    throw new TextGenerationError(`Type de contenu non reconnu : "${form.channel}".`);
  }
  if (!tone) {
    throw new TextGenerationError(`Ton non reconnu : "${form.tone}".`);
  }
  if (form.bankingProduct === "Autre" && !form.bankingProductOther?.trim()) {
    throw new TextGenerationError("Précisez le produit bancaire pour le choix 'Autre'.");
  }

  return {
    content_type: contentType,
    campaign_name: form.campaignName,
    target_audience: form.targetAudience,
    banking_product: bankingProduct,
    tone,
    language,
    custom_prompt: form.customPrompt?.trim() ? form.customPrompt.trim() : undefined,
  };
}

function mapApiResponseToResult(data: TextGenerationApiResponse): TextGenerationResult {
  const compliance: ComplianceCheck = {
    isCompliant: data.compliance.is_compliant,
    issues: data.compliance.issues,
  };

  return {
    campaignName: data.campaign_name,
    contentType: data.content_type,
    generatedText: data.generated_text,
    subjectLine: data.subject_line ?? undefined,
    characterCount: data.character_count,
    compliance,
    tokensUsed: data.tokens_used,
    model: data.model,
  };
}

/** Traduit les erreurs HTTP/réseau en messages compréhensibles pour l'utilisateur. */
function toUserFacingError(error: unknown): TextGenerationError {
  if (error instanceof TextGenerationError) return error;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (!error.response) {
      // Pas de réponse du tout : timeout ou serveur injoignable
      if (error.code === "ECONNABORTED") {
        return new TextGenerationError(
          "La génération prend trop de temps. Veuillez réessayer."
        );
      }
      return new TextGenerationError(
        "Impossible de contacter le serveur. Vérifiez votre connexion ou réessayez plus tard."
      );
    }

    switch (status) {
      case 400:
      case 422:
        return new TextGenerationError(
          "Certaines informations du formulaire sont invalides. Vérifiez les champs et réessayez.",
          status
        );
      case 401:
        return new TextGenerationError(
          "Votre session a expiré. Veuillez vous reconnecter.",
          status
        );
      case 403:
        return new TextGenerationError(
          "Vous n'avez pas les droits nécessaires pour générer du contenu.",
          status
        );
      case 404:
        return new TextGenerationError(
          "Le service de génération de texte est introuvable.",
          status
        );
      case 429:
        return new TextGenerationError(
          "Trop de générations effectuées. Merci de patienter quelques instants avant de réessayer.",
          status
        );
      case 500:
      case 502:
      case 503:
        return new TextGenerationError(
          "Le service de génération IA est momentanément indisponible. Réessayez dans quelques instants.",
          status
        );
      default:
        return new TextGenerationError(
          "Une erreur inattendue est survenue lors de la génération.",
          status
        );
    }
  }

  return new TextGenerationError("Une erreur inattendue est survenue.");
}

export const textGenerationService = {
  /**
   * Appelle POST /generate/text avec les données du formulaire et retourne
   * le résultat mappé au format frontend. Lève une TextGenerationError avec
   * un message adapté à l'utilisateur en cas d'échec.
   */
  async generateText(form: TextGenerationFormInput): Promise<TextGenerationResult> {
    try {
      const payload = mapFormToApiRequest(form);
      const { data } = await api.post<TextGenerationApiResponse>(
        "/generate/text",
        payload,
        { timeout: 30000 } // génération IA plus longue qu'un appel standard
      );
      return mapApiResponseToResult(data);
    } catch (error) {
      throw toUserFacingError(error);
    }
  },
};
