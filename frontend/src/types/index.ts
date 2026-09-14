export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  campaignsGenerated: number;
  imagesGenerated: number;
  videosGenerated: number;
  textsGenerated: number;
}

export interface ActivityItem {
  id: string;
  type: "text" | "image" | "video";
  title: string;
  description: string;
  date: string;
  status: GenerationStatus;
}

export type GenerationType = "text" | "image" | "video";
export type GenerationStatus = "completed" | "pending" | "failed" | "processing";
export type ContentChannel =
  | "email"
  | "sms"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "notification"
  | "advertisement";

export type Tone = "professional" | "commercial" | "friendly";

export interface HistoryItem {
  id: string;
  date: string;
  type: GenerationType;
  campaignName: string;
  status: GenerationStatus;
  channel?: ContentChannel;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  preview: string;
  icon: string;
}

export interface TextGenerationForm {
  channel: ContentChannel;
  campaignName: string;
  targetAudience: string;
  bankingProduct: string;
  tone: Tone;
  language: string;
  customPrompt: string;
}

export interface ImageGenerationForm {
  description: string;
  style: string;
  colors: string;
  size: string;
}

export interface VideoGenerationForm {
  description: string;
  duration: string;
  format: string;
}

export interface ChartDataPoint {
  name: string;
  campaigns: number;
  texts: number;
  images: number;
  videos: number;
}

export interface Settings {
  language: string;
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  apiKey: string;
}

export interface ComplianceCheck {
  isCompliant: boolean;
  issues: string[];
}

export interface TextGenerationResult {
  campaignName: string;
  contentType: string;
  generatedText: string;
  subjectLine?: string;
  characterCount: number;
  compliance: ComplianceCheck;
  tokensUsed: number;
  model: string;
}

export interface ImageGenerationResult {
  images: string[];
  promptUsed: string;
  model: string;
}

export type VideoJobStatus = "pending" | "processing" | "completed" | "failed";

export interface VideoGenerationResult {
  jobId: string;
  status: VideoJobStatus;
  videoUrl?: string;
  message: string;
}

export interface ProfileForm {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
