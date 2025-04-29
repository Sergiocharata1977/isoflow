import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import LoginPage from "@/pages/auth/login";
import { initializeData } from "@/data/initial-data";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ArrowUpCircle,
  Users,
  Building2,
  FileText,
  Settings,
  LayoutGrid,
  ClipboardList,
  Target,
  BarChart2,
  Ruler,
  ClipboardCheck,
  BadgeCheck as TicketCheck,
  Star,
  Calendar,
  Bell,
} from "lucide-react";

// Lazy loaded components
const NoticiasListing = React.lazy(() =>
  import("@/components/noticias/NoticiasListing")
);
const MejorasListing = React.lazy(() =>
  import("@/components/mejoras/MejorasListing")
);
const MejorasDashboard = React.lazy(() =>
  import("@/components/mejoras/MejorasDashboard")
);
const PersonalListing = React.lazy(() =>
  import("@/components/personal/PersonalListing")
);
const DepartamentosListing = React.lazy(() =>
  import("@/components/rrhh/DepartamentosListing")
);
const PuestosListing = React.lazy(() =>
  import("@/components/rrhh/PuestosListing")
);
const ProcesosListing = React.lazy(() =>
  import("@/components/procesos/ProcesosListing")
);
const ObjetivosListing2 = React.lazy(() =>
  import("@/components/procesos/ObjetivosListing2")
);
const IndicadoresListing2 = React.lazy(() =>
  import("@/components/procesos/IndicadoresListing2")
);
const MedicionesListing2 = React.lazy(() =>
  import("@/components/procesos/MedicionesListing2")
);
const DocumentosListing = React.lazy(() =>
  import("@/components/documentos/DocumentosListing")
);
const AuditoriasListing = React.lazy(() =>
  import("@/components/auditorias/AuditoriasListing")
);
const TicketsListing = React.lazy(() =>
  import("@/components/tickets/TicketsListing")
);
const EncuestasListing = React.lazy(() =>
  import("@/components/encuestas/EncuestasListing")
);
const UsuariosListing = React.lazy(() =>
  import("@/components/usuarios/UsuariosListing")
);
const CalendarView = React.lazy(() =>
  import("@/components/calendar/CalendarView")
);
const PuntosNormaListing = React.lazy(() =>
  import("@/components/norma/PuntosNormaListing")
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 text-center">
          <X className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Algo salió mal</h2>
          <p className="text-muted-foreground mb-4">
            Ha ocurrido un error al cargar este componente.
          </p>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
          >
            Intentar de nuevo
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Utilidad para manejar peticiones fetch con manejo de errores
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzamos un error con detalles
      const errorText = await response.text();
      throw new Error(
        `Error ${response.status}: ${errorText || response.statusText}`
      );
    }

    // Para respuestas vacías (como 204 No Content)
    if (response.status === 204) {
      return null;
    }

    // Intentamos parsear la respuesta como JSON
    try {
      return await response.json();
    } catch (e) {
      // Si no es JSON, devolvemos el texto
      return await response.text();
    }
  } catch (error) {
    console.error("Error en la petición fetch:", error);
    // Reenviar el error para que pueda ser manejado por el componente
    throw error;
  }
};

// Métodos de API con manejo de errores
const api = {
  get: (url) => fetchWithErrorHandling(url),
  post: (url, data) =>
    fetchWithErrorHandling(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (url, data) =>
    fetchWithErrorHandling(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (url) =>
    fetchWithErrorHandling(url, {
      method: "DELETE",
    }),
};

function App() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSection, setSelectedSection] = useState("noticias");
  const [expandedGroups, setExpandedGroups] = useState([
    "rrhh",
    "procesos",
    "satisfaccion",
  ]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(true);
  const [mejoras, setMejoras] = useState([]);

  useEffect(() => {
    try {
      // Initialize sample data
      initializeData();

      // Load mejoras data
      const savedMejoras = localStorage.getItem("mejoras");
      if (savedMejoras) {
        setMejoras(JSON.parse(savedMejoras));
      }

      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen(false);
        }
      };

      window.addEventListener("resize", handleResize);
      setIsLoading(false);

      return () => window.removeEventListener("resize", handleResize);
    } catch (error) {
      console.error("Error initializing app:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al inicializar la aplicación",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, []);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
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

  const renderMenuItem = (section) => {
    const isGroup = section.items && section.items.length > 0;
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
              setSelectedSection(section.id);
              if (isMobile) {
                setIsMobileMenuOpen(false);
              }
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
                  className={`w-full justify-start ${
                    itemIsActive
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
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

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          {(() => {
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
          })()}
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className="fixed top-4 left-4 z-50 p-2 bg-background rounded-lg border border-border"
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
          className={`${
            isMobile ? `fixed inset-y-0 left-0 z-40 w-64` : "w-64"
          } border-r border-gray-700 bg-black p-4`}
        >
          <div className="space-y-2">{sections.map(renderMenuItem)}</div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className={`flex-1 overflow-hidden flex flex-col ${
            isMobile ? "w-full" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header sin notificaciones */}
          <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-end">
            {/* Aquí antes estaba NotificationCenter, ahora está vacío */}
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
