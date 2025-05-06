import { Button } from "@/components/ui/button";
import { Search, Download, Plus, LayoutGrid, List } from "lucide-react";

interface PersonalToolbarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onExport: () => void;
  onAddNew: () => void;
}

export function PersonalToolbar({
  viewMode,
  onViewModeChange,
  searchTerm,
  onSearchChange,
  onExport,
  onAddNew,
}: PersonalToolbarProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center w-full space-x-2 sm:w-auto">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("list")}
        >
          <List className="w-4 h-4" />
        </Button>
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="pl-8 h-10 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-end w-full space-x-2 sm:w-auto">
        <Button variant="outline" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        <Button onClick={onAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>
    </div>
  );
}