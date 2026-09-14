import type {
  ActivityItem,
  ChartDataPoint,
  DashboardStats,
  HistoryItem,
  Template,
  User,
} from "@/types";

export const mockUser: User = {
  id: "1",
  name: "Marie Dupont",
  email: "marie.dupont@banque.fr",
  avatar: "",
  role: "Responsable Marketing",
  department: "Communications Bancaires",
};

export const mockStats: DashboardStats = {
  campaignsGenerated: 156,
  imagesGenerated: 342,
  videosGenerated: 89,
  textsGenerated: 428,
};

export const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "text",
    title: "Campagne Crédit Immobilier",
    description: "Email promotionnel généré pour les jeunes actifs",
    date: "2026-07-12T10:30:00",
    status: "completed",
  },
  {
    id: "2",
    type: "image",
    title: "Visuel Carte Premium",
    description: "Bannière publicitaire pour la carte bancaire premium",
    date: "2026-07-12T09:15:00",
    status: "completed",
  },
  {
    id: "3",
    type: "video",
    title: "Spot Assurance Habitation",
    description: "Vidéo courte pour les réseaux sociaux",
    date: "2026-07-11T16:45:00",
    status: "processing",
  },
  {
    id: "4",
    type: "text",
    title: "SMS Épargne Jeunes",
    description: "Message SMS pour le livret jeune",
    date: "2026-07-11T14:20:00",
    status: "completed",
  },
  {
    id: "5",
    type: "image",
    title: "Post LinkedIn Digital",
    description: "Visuel pour la promotion banque digitale",
    date: "2026-07-11T11:00:00",
    status: "failed",
  },
];

export const mockChartData: ChartDataPoint[] = [
  { name: "Jan", campaigns: 12, texts: 12, images: 28, videos: 5 },
  { name: "Fév", campaigns: 18, texts: 18, images: 35, videos: 8 },
  { name: "Mar", campaigns: 22, texts: 22, images: 42, videos: 12 },
  { name: "Avr", campaigns: 25, texts: 25, images: 48, videos: 15 },
  { name: "Mai", campaigns: 30, texts: 30, images: 55, videos: 18 },
  { name: "Juin", campaigns: 28, texts: 28, images: 52, videos: 16 },
  { name: "Juil", campaigns: 21, texts: 21, images: 38, videos: 15 },
];

export const mockHistory: HistoryItem[] = [
  {
    id: "1",
    date: "2026-07-12T10:30:00",
    type: "text",
    campaignName: "Crédit Immobilier Été 2026",
    status: "completed",
    channel: "email",
  },
  {
    id: "2",
    date: "2026-07-12T09:15:00",
    type: "image",
    campaignName: "Carte Premium Visuel",
    status: "completed",
  },
  {
    id: "3",
    date: "2026-07-11T16:45:00",
    type: "video",
    campaignName: "Assurance Habitation Spot",
    status: "processing",
  },
  {
    id: "4",
    date: "2026-07-11T14:20:00",
    type: "text",
    campaignName: "Livret Jeune SMS",
    status: "completed",
    channel: "sms",
  },
  {
    id: "5",
    date: "2026-07-11T11:00:00",
    type: "image",
    campaignName: "Banque Digitale LinkedIn",
    status: "failed",
  },
  {
    id: "6",
    date: "2026-07-10T15:30:00",
    type: "text",
    campaignName: "Crédit Auto Facebook",
    status: "completed",
    channel: "facebook",
  },
  {
    id: "7",
    date: "2026-07-10T12:00:00",
    type: "video",
    campaignName: "Épargne Retraite",
    status: "completed",
  },
  {
    id: "8",
    date: "2026-07-09T09:45:00",
    type: "text",
    campaignName: "Notification App Mobile",
    status: "completed",
    channel: "notification",
  },
  {
    id: "9",
    date: "2026-07-08T17:20:00",
    type: "image",
    campaignName: "Assurance Vie Bannière",
    status: "completed",
  },
  {
    id: "10",
    date: "2026-07-08T10:10:00",
    type: "text",
    campaignName: "Publicité Instagram",
    status: "pending",
    channel: "instagram",
  },
  {
    id: "11",
    date: "2026-07-07T14:55:00",
    type: "video",
    campaignName: "Crédit Conso TikTok",
    status: "completed",
  },
  {
    id: "12",
    date: "2026-07-06T11:30:00",
    type: "text",
    campaignName: "LinkedIn Corporate",
    status: "completed",
    channel: "linkedin",
  },
];

export const mockTemplates: Template[] = [
  {
    id: "1",
    title: "Crédit Immobilier",
    description:
      "Modèle complet pour promouvoir les offres de prêt immobilier avec taux attractifs.",
    category: "Crédit",
    preview: "bg-gradient-to-br from-blue-500 to-blue-700",
    icon: "Home",
  },
  {
    id: "2",
    title: "Crédit Auto",
    description:
      "Campagne prête à l'emploi pour le financement de véhicules neufs et d'occasion.",
    category: "Crédit",
    preview: "bg-gradient-to-br from-slate-500 to-slate-700",
    icon: "Car",
  },
  {
    id: "3",
    title: "Assurance",
    description:
      "Templates multicanaux pour les produits d'assurance habitation et vie.",
    category: "Assurance",
    preview: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    icon: "Shield",
  },
  {
    id: "4",
    title: "Épargne",
    description:
      "Contenus optimisés pour promouvoir les livrets et plans d'épargne.",
    category: "Épargne",
    preview: "bg-gradient-to-br from-amber-500 to-amber-700",
    icon: "PiggyBank",
  },
  {
    id: "5",
    title: "Carte Bancaire",
    description:
      "Visuels et textes pour le lancement de nouvelles cartes bancaires.",
    category: "Cartes",
    preview: "bg-gradient-to-br from-violet-500 to-violet-700",
    icon: "CreditCard",
  },
  {
    id: "6",
    title: "Banque Digitale",
    description:
      "Campagne complète pour promouvoir les services bancaires en ligne.",
    category: "Digital",
    preview: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    icon: "Smartphone",
  },
];

export const contentChannels = [
  { value: "email", label: "Email", icon: "Mail" },
  { value: "sms", label: "SMS", icon: "MessageSquare" },
  { value: "facebook", label: "Facebook", icon: "Facebook" },
  { value: "instagram", label: "Instagram", icon: "Instagram" },
  { value: "linkedin", label: "LinkedIn", icon: "Linkedin" },
  { value: "notification", label: "Notification", icon: "Bell" },
  { value: "advertisement", label: "Publicité", icon: "Megaphone" },
] as const;

export const tones = [
  { value: "professional", label: "Professionnel" },
  { value: "commercial", label: "Commercial" },
  { value: "friendly", label: "Amical" },
] as const;

export const languages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "es", label: "Espagnol" },
  { value: "de", label: "Allemand" },
] as const;

export const imageStyles = [
  { value: "modern", label: "Moderne" },
  { value: "minimal", label: "Minimaliste" },
  { value: "corporate", label: "Corporate" },
  { value: "creative", label: "Créatif" },
] as const;

export const imageSizes = [
  { value: "1080x1080", label: "Carré (1080×1080)" },
  { value: "1920x1080", label: "Paysage (1920×1080)" },
  { value: "1080x1920", label: "Portrait (1080×1920)" },
  { value: "1200x628", label: "Facebook (1200×628)" },
] as const;

export const videoDurations = [
  { value: "15", label: "15 secondes" },
  { value: "30", label: "30 secondes" },
  { value: "60", label: "1 minute" },
  { value: "120", label: "2 minutes" },
] as const;

export const videoFormats = [
  { value: "16:9", label: "16:9 (Paysage)" },
  { value: "9:16", label: "9:16 (Vertical)" },
  { value: "1:1", label: "1:1 (Carré)" },
  { value: "4:5", label: "4:5 (Instagram)" },
] as const;

export const bankingProducts = [
  "Crédit immobilier",
  "Crédit auto",
  "Crédit consommation",
  "Assurance habitation",
  "Assurance vie",
  "Livret A",
  "Livret jeune",
  "PEA",
  "Carte bancaire",
  "Compte courant",
  "Banque en ligne",
  "Autre",
] as const;
