import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Image,
  Video,
  History,
  LayoutTemplate,
  Settings,
  User,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Génération de texte", href: "/text-generation", icon: FileText },
  { label: "Génération d'image", href: "/image-generation", icon: Image },
  { label: "Génération de vidéo", href: "/video-generation", icon: Video },
  { label: "Historique", href: "/history", icon: History },
  { label: "Modèles", href: "/templates", icon: LayoutTemplate },
];

const bottomItems = [
  { label: "Paramètres", href: "/settings", icon: Settings },
  { label: "Profil", href: "/profile", icon: User },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bank">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">Marketing AI</span>
            <span className="text-xs text-muted-foreground">Communications</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive(item.href)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        <Separator className="my-3" />

        {bottomItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive(item.href)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-3 space-y-2">
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-muted-foreground hover:text-destructive", collapsed && "justify-center px-0")}
          onClick={() => logout()}
          title={collapsed ? "Déconnexion" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </Button>

        {onToggle && (
          <Button variant="ghost" size="icon" className="w-full" onClick={onToggle}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </aside>
  );
}
