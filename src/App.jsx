import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import LoginPage from "@/pages/auth/login";
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
  UserCircle,
  MessageSquare,
  LineChart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Lazy loaded components
const NoticiasListing = React.lazy(() =>
  import("@/components/noticias/NoticiasListing")
);
const CalendarView = React.lazy(() =>
  import("@/components/calendar/CalendarView")
);
const MejorasListing = React.lazy(() =>
  import("@/components/mejoras/MejorasListing")
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
const PuntosNormaListing = React.lazy(() =>
  import("@/components/norma/PuntosNormaListing")
);
const AuditoriasListing = React.lazy(() =>
  import("@/components/auditorias/AuditoriasListing")
);
const UsuariosListing = React.lazy(() =>
  import("@/components/usuarios/UsuariosListing")
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
    console.error("Error en componente:", error, errorInfo);
  }

  componentDidMount() {
    // Limpiar cualquier error pendiente al montar el componente
    if (this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-4">
          <h2 className="text-xl font-semibold text-red-500 mb-2">
            Algo salió mal
          </h2>
          <p className="text-gray-600 text-center mb-4">
            {this.state.error?.message || "Ha ocurrido un error inesperado"}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
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
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("noticias");
  const [expandedGroups, setExpandedGroups] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
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
          id: "usuarios",
          title: "Usuarios",
          icon: UserCircle,
        },
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
                  className={`w-full justify-start ${
                    itemIsActive
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  onClick={() => handleSectionChange(item.id)}
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

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    let Component;
    switch (selectedSection) {
      case "noticias":
        Component = NoticiasListing;
        break;
      case "calendario":
        Component = CalendarView;
        break;
      case "mejoras":
        Component = MejorasListing;
        break;
      case "personal":
        Component = PersonalListing;
        break;
      case "departamentos":
        Component = DepartamentosListing;
        break;
      case "puestos":
        Component = PuestosListing;
        break;
      case "procesos":
        Component = ProcesosListing;
        break;
      case "objetivos":
        Component = ObjetivosListing2;
        break;
      case "indicadores":
        Component = IndicadoresListing2;
        break;
      case "mediciones":
        Component = MedicionesListing2;
        break;
      case "documentos":
        Component = DocumentosListing;
        break;
      case "puntosnorma":
        Component = PuntosNormaListing;
        break;
      case "auditorias":
        Component = AuditoriasListing;
        break;
      case "usuarios":
        Component = UsuariosListing;
        break;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              Seleccione una sección del menú
            </p>
          </div>
        );
    }

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Overlay para móvil */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menú lateral */}
      <motion.div
        initial={isMobile ? { x: -320 } : false}
        animate={isMobile ? { x: isMobileMenuOpen ? 0 : -320 } : false}
        transition={{ type: "spring", damping: 20 }}
        className={`${
          isMobile ? "fixed inset-y-0 left-0 z-40 w-64" : "w-64"
        } border-r border-gray-700 bg-black p-4`}
      >
        <div className="space-y-2">{sections.map(renderMenuItem)}</div>
      </motion.div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </header>

        {/* Área de contenido principal */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
