import { useState } from "react";
import { Globe, Palette, Bell, Key, Save } from "lucide-react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeContext } from "@/contexts/ThemeContext";
import { languages } from "@/services/mockData";
import { toast } from "@/hooks/useToast";

export function SettingsPage() {
  const { theme, setTheme } = useThemeContext();
  const [language, setLanguage] = useState("fr");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });
  const [apiKey, setApiKey] = useState("sk-****************************");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    toast({
      title: "Paramètres enregistrés",
      description: "Vos préférences ont été mises à jour.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-8">
      <Header
        title="Paramètres"
        description="Configurez vos préférences d'application"
        breadcrumbs={[{ label: "Paramètres" }]}
        actions={
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        }
      />

      <div className="grid gap-6 max-w-2xl">
        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-primary" />
              Langue
            </CardTitle>
            <CardDescription>Choisissez la langue de l'interface</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-primary" />
              Thème
            </CardTitle>
            <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                    theme === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`h-8 w-12 rounded border ${
                      t === "light" ? "bg-white" : t === "dark" ? "bg-gray-900" : "bg-gradient-to-r from-white to-gray-900"
                    }`}
                  />
                  <span className="text-sm font-medium capitalize">
                    {t === "light" ? "Clair" : t === "dark" ? "Sombre" : "Système"}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Gérez vos préférences de notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "email" as const, label: "Notifications par email", desc: "Recevez des alertes par email" },
              { key: "push" as const, label: "Notifications push", desc: "Alertes en temps réel dans le navigateur" },
              { key: "marketing" as const, label: "Actualités marketing", desc: "Nouveautés et conseils marketing" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* API Key */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Key className="h-5 w-5 text-primary" />
              Clé API
            </CardTitle>
            <CardDescription>Configurez votre clé API pour les services d'IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="apiKey">Clé API</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-muted-foreground">
                Cette clé sera utilisée pour connecter les services de génération IA.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
