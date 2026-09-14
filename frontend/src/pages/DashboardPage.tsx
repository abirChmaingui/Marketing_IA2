import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Image,
  Video,
  Megaphone,
  Clock,
  Sparkles,
  History,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { PageLoader } from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardService, monthTrend, type DashboardData } from "@/services/dashboardService";
import { formatDate } from "@/utils";
import type { GenerationStatus } from "@/types";

const statusLabels: Record<
  GenerationStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary" }
> = {
  completed: { label: "Terminé", variant: "success" },
  pending: { label: "En attente", variant: "warning" },
  processing: { label: "En cours", variant: "secondary" },
  failed: { label: "Échoué", variant: "destructive" },
};

const typeIcons = {
  text: FileText,
  image: Image,
  video: Video,
};

const quickActions = [
  {
    title: "Générer un texte",
    description: "Email, SMS, réseaux sociaux",
    href: "/text-generation",
    icon: FileText,
  },
  {
    title: "Générer une image",
    description: "Visuels de campagne IA",
    href: "/image-generation",
    icon: Image,
  },
  {
    title: "Historique",
    description: "Revoir les contenus déjà créés",
    href: "/history",
    icon: History,
  },
];

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    setIsLoading(true);
    const result = await dashboardService.load();
    setData(result);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (isLoading || !data) {
    return <PageLoader />;
  }

  const firstName = user?.name?.split(" ")[0] ?? "là";
  const campaignsTrend = monthTrend(data.chartData, "campaigns");
  const textsTrend = monthTrend(data.chartData, "texts");
  const imagesTrend = monthTrend(data.chartData, "images");
  const videosTrend = monthTrend(data.chartData, "videos");

  return (
    <div className="space-y-8">
      <Header
        title={`Bonjour ${firstName}`}
        description="Vue d’ensemble de vos générations de contenus marketing"
        actions={
          <Button variant="bank" asChild>
            <Link to="/text-generation">
              <Sparkles className="h-4 w-4" />
              Nouvelle génération
            </Link>
          </Button>
        }
      />

      {data.source === "error" && (
        <Card>
          <CardContent className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive">
              {data.errorMessage ?? "Impossible de charger les données du tableau de bord."}
            </p>
            <Button variant="outline" size="sm" onClick={() => void loadDashboard()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Campagnes générées"
          value={data.stats.campaignsGenerated}
          icon={Megaphone}
          description="Total des contenus enregistrés"
          trend={campaignsTrend}
        />
        <StatCard
          title="Textes générés"
          value={data.stats.textsGenerated}
          icon={FileText}
          description="Emails, SMS, posts…"
          trend={textsTrend}
        />
        <StatCard
          title="Images générées"
          value={data.stats.imagesGenerated}
          icon={Image}
          description="Visuels de campagne"
          trend={imagesTrend}
        />
        <StatCard
          title="Vidéos générées"
          value={data.stats.videosGenerated}
          icon={Video}
          description="Spots et formats courts"
          trend={videosTrend}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} to={action.href} className="group">
              <Card className="h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Générations sur 6 mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis allowDecimals={false} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="texts" name="Textes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="images" name="Images" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="videos" name="Vidéos" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Évolution des campagnes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis allowDecimals={false} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="campaigns"
                  name="Total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="texts"
                  name="Textes"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="images"
                  name="Images"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Activité récente
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/history">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {data.activities.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Aucune génération pour le moment"
              description="Créez un texte ou une image de campagne : l’activité apparaîtra ici."
              action={
                <Button variant="bank" asChild>
                  <Link to="/text-generation">Générer un texte</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {data.activities.map((activity) => {
                const Icon = typeIcons[activity.type];
                const status = statusLabels[activity.status];
                return (
                  <Link
                    key={activity.id}
                    to="/history"
                    className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{activity.title}</p>
                      <p className="truncate text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <span className="hidden whitespace-nowrap text-xs text-muted-foreground sm:block">
                      {formatDate(activity.date)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
