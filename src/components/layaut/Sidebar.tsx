import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { SectionMenuModel } from "../../models/section-menu-model";

interface SidebarProps {
  sections: SectionMenuModel[];
  expandedGroups: string[];
  selectedSection: string;
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  toggleGroup: (groupId: string) => void;
  handleSectionChange: (sectionId: string) => void;
}

export const Sidebar = ({
  sections,
  expandedGroups,
  selectedSection,
  isMobile,
  isMobileMenuOpen,
  toggleGroup,
  handleSectionChange
}: SidebarProps) => {
  const renderMenuItem = (section: SectionMenuModel) => {
    const isGroup = !!section.items?.length;
    const isExpanded = expandedGroups.includes(section.id);
    const isActive = !isGroup && selectedSection === section.id;
    const Icon = section.icon;

    return (
      <div key={section.id} className="mb-1">
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`w-full justify-start ${
            isActive
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "text-gray-300 hover:text-white hover:bg-gray-800"
          }`}
          onClick={() => {
            if (isGroup) {
              toggleGroup(section.id);
            } else {
              handleSectionChange(section.id);
            }
          }}
        >
          <Icon className="w-4 h-4 mr-2" />
          <span className="flex-1 text-left">{section.title}</span>
          {isGroup && (isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          ))}
        </Button>

        {isGroup && isExpanded && (
          <div className="pl-4 mt-1 space-y-1">
            {section.items?.map((item) => {
              const itemIsActive = selectedSection === item.id;
              const ItemIcon = item.icon;

              return (
                <Button
                  key={item.id}
                  variant={itemIsActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    itemIsActive
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  onClick={() => handleSectionChange(item.id)}
                >
                  <ItemIcon className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">{item.title}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={isMobile ? { x: -320 } : false}
      animate={isMobile ? { x: isMobileMenuOpen ? 0 : -320 } : false}
      transition={{ type: "spring", damping: 20 }}
      className={`${
        isMobile ? "fixed inset-y-0 left-0 z-40 w-64 shadow-xl" : "w-64"
      } border-r border-gray-700 bg-black p-4 overflow-y-auto`}
    >
      <div className="space-y-2">{sections.map(renderMenuItem)}</div>
    </motion.div>
  );
};