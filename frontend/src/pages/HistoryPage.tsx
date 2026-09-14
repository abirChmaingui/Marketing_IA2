import { useState, useMemo, useEffect } from "react";
import { Eye, Download, Trash2, Search, Filter, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/DataTable";
import { usePagination } from "@/hooks/usePagination";
import { formatDate } from "@/utils";
import api from "@/services/api";
import type { HistoryItem, GenerationStatus, GenerationType } from "@/types";

const statusLabels: Record<GenerationStatus, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  completed: { label: "Terminé", variant: "success" },
  pending: { label: "En attente", variant: "warning" },
  processing: { label: "En cours", variant: "secondary" },
  failed: { label: "Échoué", variant: "destructive" },
};

const typeLabels: Record<GenerationType, string> = {
  text: "Texte",
  image: "Image",
  video: "Vidéo",
};

const ITEMS_PER_PAGE = 5;

export function HistoryPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get<{ items: Array<Record<string, unknown>> }>('/generate/text/history');
        const mapped: HistoryItem[] = (data.items ?? []).map((item) => ({
          id: String(item.id ?? crypto.randomUUID()),
          date: String(item.created_at ?? new Date().toISOString()),
          type: "text",
          campaignName: String(item.campaign_name ?? "Campagne sans nom"),
          status: "completed",
          channel: String(item.content_type ?? "email").toLowerCase() as HistoryItem["channel"],
        }));
        setHistory(mapped);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage("Impossible de charger l’historique depuis l’API.");
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadHistory();
  }, []);

  const filteredData = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.campaignName.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [history, search, typeFilter, statusFilter]);

  const { currentPage, totalPages, startIndex, endIndex, goToPage, hasNextPage, hasPrevPage } =
    usePagination({ totalItems: filteredData.length, itemsPerPage: ITEMS_PER_PAGE });

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (item: HistoryItem) => (
        <span className="text-sm whitespace-nowrap">{formatDate(item.date)}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item: HistoryItem) => (
        <Badge variant="outline">{typeLabels[item.type]}</Badge>
      ),
    },
    {
      key: "campaignName",
      header: "Nom de campagne",
      render: (item: HistoryItem) => (
        <span className="font-medium">{item.campaignName}</span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (item: HistoryItem) => {
        const status = statusLabels[item.status];
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (_item: HistoryItem) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Voir">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Télécharger">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Supprimer">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <Header
        title="Historique"
        description="Consultez et gérez toutes vos générations de contenus"
        breadcrumbs={[{ label: "Historique" }]}
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom de campagne..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  goToPage(1);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); goToPage(1); }}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Vidéo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); goToPage(1); }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="processing">En cours</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement de l’historique...
          </CardContent>
        </Card>
      )}

      {!isLoading && errorMessage && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">{errorMessage}</CardContent>
        </Card>
      )}

      {!isLoading && !errorMessage && (
        <DataTable data={paginatedData} columns={columns} emptyMessage="Aucune génération trouvée" />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {startIndex + 1}–{Math.min(endIndex, filteredData.length)} sur {filteredData.length} résultats
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={!hasPrevPage}>
              Précédent
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="w-9"
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={!hasNextPage}>
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
