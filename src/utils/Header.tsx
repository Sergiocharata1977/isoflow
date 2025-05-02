import { ThemeToggle } from './ThemeToggle';
import {
    Root as DropdownMenuRoot,
    Trigger as DropdownMenuTrigger,
    Content as DropdownMenuContent,
    Item as DropdownMenuItem,
  } from "@radix-ui/react-dropdown-menu";
import { User, LogOut } from 'lucide-react';

const Header = ({ sections, selectedSection }: { sections: any[], selectedSection: string }) => {
  return (
    <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Título del Dashboard */}
      <h1 className="text-xl font-semibold">
        {sections.find((s) => s.id === selectedSection)?.title || "Dashboard"}
      </h1>

      {/* Botón para cambiar tema */}
      <ThemeToggle />

      {/* Menú desplegable para el usuario */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center space-x-2 focus:outline-none">
            <img
              src="https://i.pravatar.cc/40" // Imagen de avatar
              alt="Avatar"
              className="w-8 h-8 rounded-full border"
            />
            <span className="text-sm font-medium">Juan Pérez</span>
          </button>
        </DropdownMenuTrigger>

        {/* Opciones del menú */}
        <DropdownMenuContent
          className="z-50 mt-2 w-48 rounded-md border border-border bg-background shadow-md"
          sideOffset={5}
        >
          <DropdownMenuItem
            onClick={() => console.log("Ver perfil")}
            className="px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Cerrar sesión")}
            className="px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </div>
  );
};

export default Header;
