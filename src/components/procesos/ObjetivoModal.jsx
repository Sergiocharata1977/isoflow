import React, { useEffect, useState } from "react";
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

function ObjetivoModal({ isOpen, onClose, onSave, objetivo }) {
  const [formData, setFormData] = useState({
    titulo: "",
    codigo: "",
    descripcion: "",
    responsable: "",
    procesos: "",
  });

  useEffect(() => {
    if (objetivo) {
      setFormData(objetivo);
    } else {
      setFormData({
        titulo: "",
        codigo: "",
        descripcion: "",
        responsable: "",
        procesos: "",
      });
    }
  }, [objetivo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {objetivo ? "Editar Objetivo" : "Nuevo Objetivo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
                value={formData.procesos}
                onChange={(e) =>
                  setFormData({ ...formData, procesos: e.target.value })
                }
                placeholder="Procesos relacionados"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {objetivo ? "Guardar Cambios" : "Crear Objetivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ObjetivoModal;
