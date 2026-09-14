import api from "./api";
import type {
  ActivityItem,
  ChartDataPoint,
  DashboardStats,
  GenerationStatus,
  GenerationType,
  HistoryItem,
} from "@/types";

export interface DashboardData {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  activities: ActivityItem[];
  source: "api" | "empty" | "error";
  errorMessage?: string;
}

const MONTH_LABELS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

function asType(value: unknown): GenerationType {
  if (value === "image" || value === "video") return value;
  return "text";
}

function asStatus(value: unknown): GenerationStatus {
  if (value === "pending" || value === "processing" || value === "failed") return value;
  return "completed";
}

function mapHistoryItem(raw: Record<string, unknown>): HistoryItem {
  return {
    id: String(raw.id ?? crypto.randomUUID()),
    date: String(raw.created_at ?? raw.date ?? new Date().toISOString()),
    type: asType(raw.type),
    campaignName: String(raw.campaign_name ?? raw.campaignName ?? "Campagne sans nom"),
    status: asStatus(raw.status),
  };
}

function activityFromHistory(item: HistoryItem): ActivityItem {
  const typeLabel = item.type === "text" ? "Texte" : item.type === "image" ? "Image" : "Vidéo";
  const statusLabel =
    item.status === "completed"
      ? "génération terminée"
      : item.status === "failed"
        ? "échec"
        : item.status === "processing"
          ? "en cours"
          : "en attente";
  return {
    id: item.id,
    type: item.type,
    title: item.campaignName,
    description: `${typeLabel} · ${statusLabel}`,
    date: item.date,
    status: item.status,
  };
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function emptyBuckets(): ChartDataPoint[] {
  const now = new Date();
  const buckets: ChartDataPoint[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      name: MONTH_LABELS[d.getMonth()],
      campaigns: 0,
      texts: 0,
      images: 0,
      videos: 0,
    });
  }
  return buckets;
}

function buildChart(items: HistoryItem[]): ChartDataPoint[] {
  const now = new Date();
  const buckets = emptyBuckets();
  const indexByKey = new Map<string, number>();
  buckets.forEach((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    indexByKey.set(monthKey(d), idx);
  });

  items.forEach((item) => {
    const parsed = new Date(item.date);
    if (Number.isNaN(parsed.getTime())) return;
    const idx = indexByKey.get(monthKey(parsed));
    if (idx === undefined) return;
    buckets[idx].campaigns += 1;
    if (item.type === "text") buckets[idx].texts += 1;
    if (item.type === "image") buckets[idx].images += 1;
    if (item.type === "video") buckets[idx].videos += 1;
  });

  return buckets;
}

function buildStats(items: HistoryItem[]): DashboardStats {
  return {
    campaignsGenerated: items.length,
    textsGenerated: items.filter((i) => i.type === "text").length,
    imagesGenerated: items.filter((i) => i.type === "image").length,
    videosGenerated: items.filter((i) => i.type === "video").length,
  };
}

const emptyStats: DashboardStats = {
  campaignsGenerated: 0,
  textsGenerated: 0,
  imagesGenerated: 0,
  videosGenerated: 0,
};

async function fetchHistoryItems(): Promise<HistoryItem[]> {
  const endpoints = ["/history", "/generate/text/history"];
  let lastError: unknown;

  for (const path of endpoints) {
    try {
      const { data } = await api.get<{ items?: Array<Record<string, unknown>> }>(path, {
        params: { page: 1, page_size: 100 },
        timeout: 12000,
      });
      if (Array.isArray(data?.items)) {
        return data.items.map(mapHistoryItem);
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  return [];
}

export function monthTrend(chartData: ChartDataPoint[], key: keyof ChartDataPoint): {
  value: number;
  isPositive: boolean;
} | undefined {
  if (chartData.length < 2) return undefined;
  const prev = Number(chartData[chartData.length - 2][key] ?? 0);
  const curr = Number(chartData[chartData.length - 1][key] ?? 0);
  if (prev === 0 && curr === 0) return undefined;
  if (prev === 0) return { value: 100, isPositive: curr > 0 };
  const pct = Math.round(((curr - prev) / prev) * 100);
  return { value: Math.abs(pct), isPositive: pct >= 0 };
}

export const dashboardService = {
  async load(): Promise<DashboardData> {
    try {
      const items = await fetchHistoryItems();
      const sorted = [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return {
        stats: buildStats(sorted),
        chartData: buildChart(sorted),
        activities: sorted.slice(0, 8).map(activityFromHistory),
        source: sorted.length === 0 ? "empty" : "api",
      };
    } catch {
      return {
        stats: emptyStats,
        chartData: emptyBuckets(),
        activities: [],
        source: "error",
        errorMessage: "Impossible de charger le tableau de bord depuis l’API.",
      };
    }
  },
};
