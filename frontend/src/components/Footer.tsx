import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card py-6 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span>Assistant Marketing Bancaire © 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Support technique</span>
        </div>
      </div>
    </footer>
  );
}
