
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  FileText,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Filter
} from "lucide-react";
import ProcesoModal from "./ProcesoModal";
import ProcesoSingle from "./ProcesoSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { ProcesoModel } from "@/models/proceso-model";
import { ProcesosService } from "@/services/ProcesosService";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ProcesosPDFDocument from "./ProcesosPDFDocument";


function ProcesosListing() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState<ProcesoModel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentProceso, setCurrentProceso] = useState<ProcesoModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [procesoToDelete, setProcesoToDelete] = useState<ProcesoModel | null>(null);
  const [procesos, setProcesos] = useState<ProcesoModel[]>([]);

  useEffect(() => {
    loadProcesos();
  }, []);

  const loadProcesos = async () => {
    try {
      setIsLoading(true);
      const data = await ProcesosService.getAll();
      setProcesos(data);
    } catch (error) {
      console.error("Error loading procesos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los procesos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (procesoData: Omit<ProcesoModel, "id" | "created_at" | "updated_at">) => {
    try {
      if (selectedProceso) {
        // Actualizar proceso existente
        const updatedProceso = await ProcesosService.update(selectedProceso.id!, procesoData);
        if (updatedProceso) {
          setProcesos(procesos.map(p => 
            p.id === updatedProceso.id ? updatedProceso : p
          ));
          toast({
            title: "Proceso actualizado",
            description: "Los datos del proceso han sido actualizados exitosamente"
          });
        }
      } else {
        const newProceso = await ProcesosService.create(procesoData);
        setProcesos([...procesos, newProceso]); 
        toast({
          title: "Proceso creado",
          description: "Se ha agregado un nuevo proceso exitosamente"
        });
      }
      setIsModalOpen(false);
      setSelectedProceso(null);
    } catch (error) {
      console.error("Error saving proceso:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el proceso",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (proceso: ProcesoModel) => {
    setSelectedProceso(proceso);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const procesoToDelete = procesos.find(p => p.id === id);
    if (procesoToDelete) {
      setProcesoToDelete(procesoToDelete);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!procesoToDelete?.id) return;
    
    try {
      const success = await ProcesosService.delete(procesoToDelete.id);
      if (success) {
        const updatedProcesos = procesos.filter(p => p.id !== procesoToDelete.id);
        setProcesos(updatedProcesos);
        toast({
          title: "Proceso eliminado",
          description: "El proceso ha sido eliminado exitosamente"
        });
        
        if (showSingle) {
          setShowSingle(false);
        }
      }
    } catch (error) {
      console.error("Error deleting proceso:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el proceso",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setProcesoToDelete(null);
    }
  };

  const handleViewProceso = (proceso: ProcesoModel) => {
    setCurrentProceso(proceso);
    setShowSingle(true);
  };

  const filteredProcesos = procesos.filter(proceso =>
    proceso.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.objetivo?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (showSingle) {
    return (
      <ProcesoSingle 
        proceso={currentProceso} 
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center w-full space-x-2 sm:w-auto">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <ListIcon className="w-4 h-4" />
          </Button>
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar procesos..."
              className="pl-8 h-10 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end w-full space-x-2 sm:w-auto">
        <Button variant="outline" asChild>
            <PDFDownloadLink
              document={<ProcesosPDFDocument procesos={filteredProcesos} />} 
              fileName="procesos.pdf"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {({ loading }) => (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Generando PDF...' : 'Exportar PDF'}
                </>
              )}
            </PDFDownloadLink>
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proceso
          </Button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProcesos.map((proceso) => (
              <motion.div
                key={proceso.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="overflow-hidden transition-colors border rounded-lg cursor-pointer bg-card border-border hover:border-primary"
                onClick={() => handleViewProceso(proceso)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4 space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{proceso.titulo}</h3>
                      <p className="text-sm text-muted-foreground">
                        {proceso.codigo}
                      </p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {proceso.objetivo}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      proceso.estado === "Activo" 
                        ? "bg-green-100 text-green-800"
                        : proceso.estado === "revision"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {proceso.estado}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(proceso);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (proceso.id !== undefined) handleDelete(proceso.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden border rounded-lg bg-card border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="p-4 text-left">Proceso</th>
                  <th className="p-4 text-left">Objetivo</th>
                  <th className="p-4 text-left">Versión</th>
                  <th className="p-4 text-left">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcesos.map((proceso) => (
                  <motion.tr
                    key={proceso.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b cursor-pointer border-border hover:bg-accent/50"
                    onClick={() => handleViewProceso(proceso)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{proceso.titulo}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">{proceso.objetivo}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
                        v{proceso.version}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        proceso.estado === "activo" 
                          ? "bg-green-100 text-green-800"
                          : proceso.estado === "revision"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {proceso.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(proceso);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (proceso.id !== undefined) handleDelete(proceso.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredProcesos.length === 0 && (
              <div className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay procesos registrados. Haz clic en "Nuevo Proceso" para comenzar.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <ProcesoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProceso(null);
        }}
        onSave={handleSave}
        onSaveSuccess={loadProcesos}
        proceso={selectedProceso}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el proceso {procesoToDelete?.titulo}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProcesosListing;
