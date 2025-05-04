import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Search, Edit, Delete } from "lucide-react";
import ObjetivoModal from "./ObjetivoModal";
import { ObjetivoService } from "@/services/ObjetivosService";
import { ObjetivoModel } from "@/models/objetivo-model";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ObjetivosListing() {
  const [objetivos, setObjetivos] = useState<ObjetivoModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentObjetivo, setCurrentObjetivo] = useState<ObjetivoModel | null>(null);

  useEffect(() => {
    const fetchObjetivos = async () => {
      setIsLoading(true);
      try {
        const data = await ObjetivoService.getAll();
        setObjetivos(data);
      } catch (error) {
        console.error("Error al cargar objetivos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjetivos();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredObjetivos = objetivos.filter((obj) =>
    [obj.titulo, obj.descripcion, obj.responsable, obj.procesos_relacionados].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const { confirm, ConfirmDialog } = useConfirmDialog();

  const handleNewObjetivo = () => {
    setCurrentObjetivo(null);
    setModalOpen(true);
  };

  const handleEditObjetivo = (objetivo: ObjetivoModel) => {
    setCurrentObjetivo(objetivo);
    setModalOpen(true);
  };

  const handleDelete = async (objetivo: ObjetivoModel) => {
    const accepted = await confirm({
      title: 'Eliminar objetivo',
      message: '¿Seguro que deseas eliminar este objetivo?',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
    });

    if (accepted) {
      try {
        const data = await ObjetivoService.delete(objetivo.id!);

        if (data.success) {
          setObjetivos(prevObjetivos => prevObjetivos.filter(item => item.id !== objetivo.id));

          toast.success('Objetivo eliminado correctamente');

        } else {
          toast.error('Error al eliminar el objetivo');
        }
      } catch (error) {
        toast.error('Hubo un error al eliminar el objetivo');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveObjetivo = (objetivoData: Omit<ObjetivoModel, "id" | "estado">) => {
    if (currentObjetivo) {
      setObjetivos((prev) =>
        prev.map((obj) =>
          obj.id === currentObjetivo.id ? { ...obj, ...objetivoData } : obj
        )
      );
    } else {
      const newObjetivo: ObjetivoModel = {
        ...objetivoData,
        id: Date.now(),
      };
      setObjetivos((prev) => [...prev, newObjetivo]);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Objetivos de Calidad</h2>
        <Button onClick={handleNewObjetivo}>+ Nuevo Objetivo</Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-8 p-2 border rounded"
            placeholder="Buscar objetivo..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredObjetivos.map((obj) => (
              <div
                key={obj.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{obj.titulo}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {obj.descripcion}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-4">

                      <div>
                        <p className="text-sm">
                          <b>Código:</b> {obj.codigo}
                        </p>
                        <p className="text-sm">
                          <b>Responsable:</b> {obj.responsable}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm">
                          <b>Procesos:</b> {obj.procesos_relacionados}
                        </p>
                      </div>

                    </div>

                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditObjetivo(obj)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(obj)}
                    >
                      <Delete className="h-4 w-4" />
                    </Button>
                    {ConfirmDialog}
                  </div>
                </div>
              </div>
            ))}
            {filteredObjetivos.length === 0 && (
              <p className="text-center text-muted-foreground">
                No se encontraron objetivos
              </p>
            )}
          </div>
        )}
      </div>

      <ObjetivoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveObjetivo}
        objetivo={currentObjetivo}
      />

    </div>
  );
}

export default ObjetivosListing;
