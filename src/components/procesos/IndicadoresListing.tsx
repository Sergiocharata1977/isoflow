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
  BarChart2,
  LayoutGrid,
  List,
} from "lucide-react";
import IndicadorModal from "./IndicadorModal";
import { IndicadorModel } from "@/models/indicador-model";
import { IndicadoresService } from "@/services/IndicadoresService";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import IndicadorCard from "./IndicadorCard";

function IndicadoresListing() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIndicador, setSelectedIndicador] = useState<IndicadorModel | null>(null);
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [indicadores, setIndicadores] = useState<IndicadorModel[]>([]);

  useEffect(() => {
    loadIndicadores();
  }, []);

  const loadIndicadores = async () => {

    const fetchIndicadores = async () => {
      setIsLoading(true);
      try {
        const data = await IndicadoresService.getAll();
        setIndicadores(data);
      } catch (error) {
        console.error("Error al cargar indicadores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndicadores();
  };

  const handleSave = async (indicadorData: IndicadorModel) => {
    try {
      if (selectedIndicador) {
        const updatedIndicador = await IndicadoresService.update(indicadorData.id!, indicadorData);
        const updatedIndicadors = indicadores.map(a =>
          a.id === selectedIndicador.id ? updatedIndicador : a
        );
        setIndicadores(updatedIndicadors);
        toast({
          title: "Indicador actualizado",
          description: "Los datos del indicador han sido actualizados exitosamente",
        });
      } else {
        const createdIndicadores = await IndicadoresService.create(indicadorData);
        console.log(createdIndicadores);
        setIndicadores([createdIndicadores, ...indicadores]);
        toast({
          title: "Indicador creado",
          description: "Se ha agregado un nuevo indicador exitosamente",
        });
      }
      setIsModalOpen(false);
      setSelectedIndicador(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el indicador",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (indicador: IndicadorModel) => {
    setSelectedIndicador(indicador);
    setIsModalOpen(true);
  };

  const handleDelete = async (indicador: IndicadorModel) => {
    const accepted = await confirm({
      title: 'Eliminar indicador',
      message: '¿Seguro que deseas eliminar esta indicador?',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
    });

    if (accepted) {
      try {
        await IndicadoresService.delete(indicador.id!);

        setIndicadores(prev =>
          prev.filter(a => a.id !== indicador.id)
        );

        toast({
          title: "Indicador eliminado",
          description: "El indicador se ha sido eliminado exitosamente"
        });

      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el indicador",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredIndicadores = indicadores.filter((indicador) =>
    indicador.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indicador.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar indicadores..."
              className="pl-8 h-10 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {/* <Button variant="outline" onClick={() => { }}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button> */}
          <Button onClick={() => { setIsModalOpen(true), setSelectedIndicador(null) }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Indicador
          </Button>
        </div>
      </div>

      {/* Content */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIndicadores.map((indicador: IndicadorModel) => (
              <IndicadorCard
                key={indicador.id}
                indicador={indicador}
                onEdit={handleEdit}
                onDelete={() => handleDelete(indicador)}
                onView={() => { }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Título</th>
                  <th className="text-left p-4">Descripción</th>
                  <th className="text-left p-4">Unidad de Medida</th>
                  <th className="text-left p-4">Límite</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredIndicadores.map((indicador) => (
                  <motion.tr
                    key={indicador.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border cursor-pointer hover:bg-accent/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <BarChart2 className="h-5 w-5 text-primary" />
                        <span className="font-medium">{indicador.titulo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">
                        {indicador.descripcion}
                      </p>
                    </td>
                    <td className="p-4">{indicador.unidad_medida}</td>
                    <td className="p-4">{indicador.limite_aceptacion}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(indicador)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(indicador)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredIndicadores.length === 0 && (
              <div className="text-center py-12">
                <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay indicadores registrados. Haz clic en "Nuevo Indicador"
                  para comenzar.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <IndicadorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIndicador(null);
        }}
        onSave={handleSave}
        indicador={selectedIndicador}
      />

      {ConfirmDialog}

    </div>
  );
}

export default IndicadoresListing;