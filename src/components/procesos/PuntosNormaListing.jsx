import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2,
  ClipboardCheck,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  ArrowLeft
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagination } from "@/hooks/use-pagination";

const PuntoNormaCard = React.memo(({ puntoNorma, onView, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
    onClick={() => onView(puntoNorma)}
  >
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <ClipboardCheck className="h-8 w-8 text-primary" />
        <h3 className="font-semibold text-lg">{puntoNorma.codigo}</h3>
      </div>
      <p className="text-sm font-medium mb-2">{puntoNorma.titulo}</p>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{puntoNorma.descripcion}</p>
      <div className="text-sm">
        <p><strong>Norma:</strong> {puntoNorma.norma}</p>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(puntoNorma);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(puntoNorma.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </motion.div>
));

const PuntoNormaSkeletonCard = () => (
  <div className="bg-card border border-border rounded-lg overflow-hidden p-6">
    <div className="flex items-center space-x-3 mb-4">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-5 w-1/4" />
    </div>
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-16 w-full mb-4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

function PuntosNormaListing() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPuntoNorma, setSelectedPuntoNorma] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentPuntoNorma, setCurrentPuntoNorma] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [puntoNormaToDelete, setPuntoNormaToDelete] = useState(null);
  const [puntosNorma, setPuntosNorma] = useState([]);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      setPuntosNorma([
        {
          id: 1,
          codigo: "4.1",
          titulo: "Comprensión de la organización y su contexto",
          descripcion: "La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y su dirección estratégica.",
          norma: "ISO 9001:2015"
        },
        {
          id: 2,
          codigo: "4.2",
          titulo: "Comprensión de las necesidades y expectativas de las partes interesadas",
          descripcion: "La organización debe determinar las partes interesadas que son pertinentes al sistema de gestión de la calidad.",
          norma: "ISO 9001:2015"
        },
        {
          id: 3,
          codigo: "4.3",
          titulo: "Determinación del alcance del sistema de gestión de la calidad",
          descripcion: "La organización debe determinar los límites y la aplicabilidad del sistema de gestión de la calidad para establecer su alcance.",
          norma: "ISO 9001:2015"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEdit = (puntoNorma) => {
    setSelectedPuntoNorma(puntoNorma);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const puntoNorma = puntosNorma.find(p => p.id === id);
    setPuntoNormaToDelete(puntoNorma);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Simulación de eliminación
      setPuntosNorma(prev => prev.filter(p => p.id !== puntoNormaToDelete.id));
      toast({
        title: "Punto de norma eliminado",
        description: "El punto de norma ha sido eliminado exitosamente"
      });
      setDeleteDialogOpen(false);
      setPuntoNormaToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el punto de norma",
        variant: "destructive"
      });
    }
  };

  const handleViewPuntoNorma = (puntoNorma) => {
    setCurrentPuntoNorma(puntoNorma);
    setShowSingle(true);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredPuntosNorma = React.useMemo(() => {
    return puntosNorma.filter(punto =>
      punto.codigo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      punto.titulo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      punto.descripcion?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      punto.norma?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [puntosNorma, debouncedSearchTerm]);

  const {
    items: paginatedPuntosNorma,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(filteredPuntosNorma, viewMode === "grid" ? 8 : 10);

  if (showSingle && currentPuntoNorma) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setShowSingle(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Detalle del Punto de Norma</h2>
          </div>
          <Button onClick={() => {
            setSelectedPuntoNorma(currentPuntoNorma);
            setIsModalOpen(true);
            setShowSingle(false);
          }}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-semibold">{currentPuntoNorma.codigo}</h3>
                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">
                  {currentPuntoNorma.norma}
                </span>
              </div>
              <h4 className="text-lg font-medium mt-2">{currentPuntoNorma.titulo}</h4>
              <div className="h-1 w-20 bg-primary mt-2"></div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
              <p className="text-foreground">{currentPuntoNorma.descripcion}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar puntos de norma..."
              className="pl-8 h-10 w-[250px] sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Tabs defaultValue={viewMode} className="w-full sm:w-auto" onValueChange={setViewMode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center">
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tarjetas</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nuevo</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <PuntoNormaSkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedPuntosNorma.map((puntoNorma) => (
                  <PuntoNormaCard
                    key={puntoNorma.id}
                    puntoNorma={puntoNorma}
                    onView={handleViewPuntoNorma}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
                {paginatedPuntosNorma.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                      No hay puntos de norma registrados. Haz clic en "Nuevo" para comenzar.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="text-left p-4">Código</th>
                      <th className="text-left p-4">Título</th>
                      <th className="text-left p-4 hidden md:table-cell">Descripción</th>
                      <th className="text-left p-4">Norma</th>
                      <th className="text-right p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPuntosNorma.map((puntoNorma) => (
                      <motion.tr
                        key={puntoNorma.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewPuntoNorma(puntoNorma)}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <ClipboardCheck className="h-5 w-5 text-primary" />
                            <span className="font// En la sección de importaciones, añade:
                            import AppMenu from "@/components/layaut/AppMenu";
                            
                            // Luego, en el return del componente App, reemplaza este bloque:
                            {/* Sidebar */}
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
                            
                            // Por este:
                            {/* Sidebar */}
                            <AppMenu 
                              isMobile={isMobile}
                              isMobileMenuOpen={isMobileMenuOpen}
                              selectedSection={selectedSection}
                              expandedGroups={expandedGroups}
                              toggleGroup={toggleGroup}
                              setSelectedSection={setSelectedSection}
                              setIsMobileMenuOpen={setIsMobileMenuOpen}
                            />