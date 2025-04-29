import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutGrid,
  Calendar,
  ArrowUpCircle,
  Users,
  Building2,
  ClipboardList,
  Target,
  BarChart2,
  Ruler,
  FileText,
  ClipboardCheck
} from 'lucide-react';

const AppMenu = ({ 
  isMobile, 
  isMobileMenuOpen, 
  selectedSection, 
  expandedGroups, 
  toggleGroup, 
  setSelectedSection, 
  setIsMobileMenuOpen 
}) => {
  const sections = [
    {
      id: "noticias",
      title: "Tablero Central",
      icon: LayoutGrid
    },
    {
      id: "calendario",
      title: "Calendario",
      icon: Calendar
    },
    {
      id: "mejoras",
      title: "Hallazgos y mejoras",
      icon: ArrowUpCircle
    },
    {
      id: "rrhh",
      title: "Recursos Humanos",
      icon: Users,
      items: [
        {
          id: "personal",
          title: "Personal",
          icon: Users
        },
        {
          id: "departamentos",
          title: "Departamentos",
          icon: Building2
        },
        {
          id: "puestos",
          title: "Puestos",
          icon: Users
        }
      ]
    },
    {
      id: "procesos",
      title: "Procesos",
      icon: ClipboardList,
      items: [
        {
          id: "procesos",
          title: "Procesos",
          icon: ClipboardList
        },
        {
          id: "objetivos",
          title: "Objetivos (v2)",
          icon: Target
        },
        {
          id: "indicadores",
          title: "Indicadores (v2)",
          icon: BarChart2
        },
        {
          id: "mediciones",
          title: "Mediciones (v2)",
          icon: Ruler
        }
      ]
    },
    {
      id: "documentos",
      title: "Documentos",
      icon: FileText
    },
    {
      id: "puntosnorma",
      title: "Puntos de Norma",
      icon: ClipboardCheck
    },
    {
      id: "auditorias",
      title: "Auditorías",
      icon: ClipboardCheck
    }
  ];

  const renderMenuItem = (section) => {
    const isGroup = section.items && section.items.length > 0;
    const isExpanded = expandedGroups.includes(section.id);
    const isActive = !isGroup && selectedSection === section.id;
    const Icon = section.icon;

    return (
      <div key={section.id} className="mb-1">
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`w-full justify-start ${isActive ? 'bg-green-500 hover:bg-green-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
          onClick={() => {
            if (isGroup) {
              toggleGroup(section.id);
            } else {
              setSelectedSection(section.id);
              if (isMobile) {
                setIsMobileMenuOpen(false);
              }
            }
          }}
        >
          <Icon className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{section.title}</span>
          {isGroup && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          )}
        </Button>

        {isGroup && isExpanded && (
          <div className="pl-4 space-y-1 mt-1">
            {section.items.map((item) => {
              const itemIsActive = selectedSection === item.id;
              const ItemIcon = item.icon;
              
              return (
                <Button
                  key={item.id}
                  variant={itemIsActive ? "default" : "ghost"}
                  className={`w-full justify-start ${itemIsActive ? 'bg-green-500 hover:bg-green-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                  onClick={() => {
                    setSelectedSection(item.id);
                    if (isMobile) {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  <ItemIcon className="mr-2 h-4 w-4" />
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
        isMobile
          ? `fixed inset-y-0 left-0 z-40 w-64`
          : 'w-64'
      } border-r border-gray-700 bg-black p-4`}
    >
      <div className="space-y-2">
        {sections.map(renderMenuItem)}
      </div>
    </motion.div>
  );
};

export default AppMenu;