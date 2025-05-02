import React, { useState, useEffect, Suspense, SetStateAction } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowUpCircle,
  Users,
  Building2,
  FileText,
  LayoutGrid,
  ClipboardList,
  Target,
  BarChart2,
  Ruler,
  ClipboardCheck,
  Calendar,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/toaster";
import LoginPage from "./pages/auth/login";
import { ErrorBoundary } from "./utils/ErrorBoundary";
import { LoadingSpinner } from "./utils/LoadingSpinner";

// Lazy loaded components with preload
const NoticiasListing = React.lazy(() => {
  const component = import("./components/noticias/NoticiasListing");
  component.catch((error) =>
    console.error("Error cargando NoticiasListing:", error)
  );
  return component;
});

const CalendarView = React.lazy(() => {
  const component = import("./components/calendar/CalendarView");
  component.catch((error) =>
    console.error("Error cargando CalendarView:", error)
  );
  return component;
});

const MejorasListing = React.lazy(() => {
  const component = import("./components/mejoras/MejorasListing");
  component.catch((error) =>
    console.error("Error cargando MejorasListing:", error)
  );
  return component;
});

const PersonalListing = React.lazy(() =>
  import("./components/personal/PersonalListing")
);

const DepartamentosListing = React.lazy(() =>
  import("./components/rrhh/DepartamentosListing")
);

const PuestosListing = React.lazy(() =>
  import("./components/rrhh/PuestosListing")
);

const ProcesosListing = React.lazy(() =>
  import("./components/procesos/ProcesosListing")
);

const ObjetivosListing2 = React.lazy(() =>
  import("./components/procesos/ObjetivosListing2")
);

const IndicadoresListing2 = React.lazy(() =>
  import("./components/procesos/IndicadoresListing2")
);

const MedicionesListing2 = React.lazy(() =>
  import("./components/procesos/MedicionesListing2")
);

const DocumentosListing = React.lazy(() =>
  import("./components/documentos/DocumentosListing")
);

const AuditoriasListing = React.lazy(() =>
  import("./components/auditorias/AuditoriasListing")
);

const PuntosNormaListing = React.lazy(() =>
  import("./components/norma/PuntosNormaListing")
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSection, setSelectedSection] = useState("noticias");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(["rrhh", "procesos"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Solo manejar el resize y el estado de carga
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    setIsLoading(false);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Precarga de componentes principales
  useEffect(() => {
    const preloadMainComponents = async () => {
      try {
        // Precargar componentes principales
        const componentsToPreload = [
          import("./components/noticias/NoticiasListing"),
          import("./components/calendar/CalendarView"),
          import("./components/mejoras/MejorasListing"),
        ];

        await Promise.all(componentsToPreload);
      } catch (error) {
        console.error("Error al precargar componentes:", error);
      }
    };

    preloadMainComponents();
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prevGroups: string[]) =>
      prevGroups.includes(groupId)
        ? prevGroups.filter((id) => id !== groupId)
        : [...prevGroups, groupId]
    );
  };

  const handleSectionChange = (sectionId: SetStateAction<string>) => {
    setIsLoading(true);
    setSelectedSection(sectionId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
    // Simular tiempo de carga mínimo para mejor UX
    setTimeout(() => setIsLoading(false), 300);
  };

  const sections = [
    {
      id: "noticias",
      title: "Tablero Central",
      icon: LayoutGrid,
    },
    {
      id: "calendario",
      title: "Calendario",
      icon: Calendar,
    },
    {
      id: "mejoras",
      title: "Hallazgos y mejoras",
      icon: ArrowUpCircle,
    },
    {
      id: "rrhh",
      title: "Recursos Humanos",
      icon: Users,
      items: [
        {
          id: "personal",
          title: "Personal",
          icon: Users,
        },
        {
          id: "departamentos",
          title: "Departamentos",
          icon: Building2,
        },
        {
          id: "puestos",
          title: "Puestos",
          icon: Users,
        },
      ],
    },
    {
      id: "procesos",
      title: "Procesos",
      icon: ClipboardList,
      items: [
        {
          id: "procesos",
          title: "Procesos",
          icon: ClipboardList,
        },
        {
          id: "objetivos",
          title: "Objetivos",
          icon: Target,
        },
        {
          id: "indicadores",
          title: "Indicadores",
          icon: BarChart2,
        },
        {
          id: "mediciones",
          title: "Mediciones",
          icon: Ruler,
        },
      ],
    },
    {
      id: "documentos",
      title: "Documentos",
      icon: FileText,
    },
    {
      id: "puntosnorma",
      title: "Puntos de Norma",
      icon: ClipboardCheck,
    },
    {
      id: "auditorias",
      title: "Auditorías",
      icon: ClipboardCheck,
    },
  ];

  const renderMenuItem = (section: any) => {
    const isGroup = section.items && section.items.length > 0;
    const isExpanded = expandedGroups.includes(section.id);
    const isActive = !isGroup && selectedSection === section.id;
    const Icon = section.icon;

    return (
      <div key={section.id} className="mb-1">
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`w-full justify-start ${isActive
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
          <Icon className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{section.title}</span>
          {isGroup &&
            (isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            ))}
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
                  className={`w-full justify-start ${itemIsActive
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  onClick={() => {
                    handleSectionChange(item.id);
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          }
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {(() => {
              try {
                switch (selectedSection) {
                  case "noticias":
                    return <NoticiasListing />;
                  case "calendario":
                    return <CalendarView />;
                  case "mejoras":
                    return <MejorasListing />;
                  case "personal":
                    return <PersonalListing />;
                  case "departamentos":
                    return <DepartamentosListing />;
                  case "puestos":
                    return <PuestosListing />;
                  case "procesos":
                    return <ProcesosListing />;
                  case "objetivos":
                    return <ObjetivosListing2 />;
                  case "indicadores":
                    return <IndicadoresListing2 />;
                  case "mediciones":
                    return <MedicionesListing2 />;
                  case "documentos":
                    return <DocumentosListing />;
                  case "puntosnorma":
                    return <PuntosNormaListing />;
                  case "auditorias":
                    return <AuditoriasListing />;
                  default:
                    return (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">
                          Seleccione una sección del menú
                        </p>
                      </div>
                    );
                }
              } catch (error) {
                console.error("Error al renderizar contenido:", error);
                return (
                  <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-red-500 mb-2">
                      Error al cargar el contenido
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Recargar página
                    </Button>
                  </div>
                );
              }
            })()}
          </motion.div>
        </Suspense>
      </ErrorBoundary>
    );
  };

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
        <Toaster />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className="fixed top-4 left-4 z-50 p-2 bg-background rounded-lg border border-border shadow-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}

        {/* Sidebar */}
        <motion.div
          initial={isMobile ? { x: -320 } : false}
          animate={isMobile ? { x: isMobileMenuOpen ? 0 : -320 } : false}
          transition={{ type: "spring", damping: 20 }}
          className={`${isMobile ? "fixed inset-y-0 left-0 z-40 w-64 shadow-xl" : "w-64"
            } border-r border-gray-700 bg-black p-4 overflow-y-auto`}
        >
          <div className="space-y-2">{sections.map(renderMenuItem)}</div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className={`flex-1 overflow-hidden flex flex-col ${isMobile ? "w-full" : ""
            }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {sections.find((s) => s.id === selectedSection)?.title ||
                "Dashboard"}
            </h1>
          </div>

          {/* Content area */}
          <div
            className={`flex-1 overflow-auto p-6 ${isMobile ? "pt-16" : ""}`}
          >
            {renderContent()}
          </div>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
