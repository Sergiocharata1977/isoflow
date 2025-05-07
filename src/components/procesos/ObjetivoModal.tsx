import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ObjetivoModel } from "@/models/objetivo-model";
import { ObjetivoService } from "@/services/ObjetivosService";

interface ObjetivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: ObjetivoModel) => void;
  objetivo?: ObjetivoModel | null;
}

const ObjetivoModal: React.FC<ObjetivoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  objetivo,
}) => {

  const [formData, setFormData] = useState<ObjetivoModel>({
    titulo: "",
    codigo: "",
    descripcion: "",
    responsable: "",
    procesos_relacionados: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (objetivo) {
      setFormData(objetivo);
    } else {
      setFormData({
        titulo: "",
        codigo: "",
        descripcion: "",
        responsable: "",
        procesos_relacionados: "",
      });
    }
  }, [objetivo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      let savedObjetivo: ObjetivoModel;
      if (objetivo?.id) {
        savedObjetivo = await ObjetivoService.update(objetivo.id, formData);
      } else {
        savedObjetivo = await ObjetivoService.create(formData);
      }
      if (onSave) {
        onSave(savedObjetivo);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar");
      alert(err.message || "Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{objetivo ? "Editar Objetivo" : "Nuevo Objetivo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="grid gap-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
                placeholder="Ej: OBJ-001"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                placeholder="Título del objetivo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Descripción detallada del objetivo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                value={formData.responsable}
                onChange={(e) =>
                  setFormData({ ...formData, responsable: e.target.value })
                }
                placeholder="Nombre del responsable"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="procesos">Procesos Relacionados</Label>
              <Input
                id="procesos"
                value={formData.procesos_relacionados}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    procesos_relacionados: e.target.value,
                  })
                }
                placeholder="Procesos relacionados"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Cargando..." : objetivo ? "Guardar Cambios" : "Crear Objetivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ObjetivoModal;