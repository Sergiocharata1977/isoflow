import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export const MobileMenuButton = ({
  isMobileMenuOpen,
  toggleMobileMenu
}: MobileMenuButtonProps) => (
  <button
    className="fixed z-50 p-2 border rounded-lg shadow-lg top-4 left-4 bg-background border-border"
    onClick={toggleMobileMenu}
  >
    {isMobileMenuOpen ? (
      <X className="w-6 h-6" />
    ) : (
      <Menu className="w-6 h-6" />
    )}
  </button>
);