import React, { useState, useEffect, FormEvent } from "react";
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

// Define el tipo para los datos del formulario
interface FormData {
  titulo: string;
  medicion: string;
  comentarios: string;
}

// Define los props del componente
interface MedicionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  medicion?: FormData | null;
}

function MedicionModal({ isOpen, onClose, onSave, medicion }: MedicionModalProps): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    medicion: "",
    comentarios: ""
  });

  useEffect(() => {
    if (medicion) {
      setFormData(medicion);
    } else {
      setFormData({
        titulo: "",
        medicion: "",
        comentarios: ""
      });
    }
  }, [medicion]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {medicion ? "Editar Medición" : "Nueva Medición"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicion">Medición</Label>
            <Input
              id="medicion"
              type="number"
              value={formData.medicion}
              onChange={(e) => setFormData({ ...formData, medicion: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentarios">Comentarios</Label>
            <Textarea
              id="comentarios"
              value={formData.comentarios}
              onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {medicion ? "Guardar Cambios" : "Crear Medición"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MedicionModal;
