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

interface EvaluacionData {
  empleado: string;
  evaluador: string;
  fecha: string;
  periodo: string;
  resultado: string;
  desempeno: string;
  objetivos: string;
  competencias: string;
  fortalezas: string;
  oportunidades: string;
  planAccion: string;
  comentarios: string;
}

interface EvaluacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EvaluacionData) => void;
  evaluacion?: EvaluacionData | null;
}

const EvaluacionModal: React.FC<EvaluacionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  evaluacion,
}) => {
  const [formData, setFormData] = useState<EvaluacionData>({
    empleado: "",
    evaluador: "",
    fecha: "",
    periodo: "",
    resultado: "",
    desempeno: "",
    objetivos: "",
    competencias: "",
    fortalezas: "",
    oportunidades: "",
    planAccion: "",
    comentarios: "",
  });

  useEffect(() => {
    if (evaluacion) {
      setFormData(evaluacion);
    } else {
      setFormData({
        empleado: "",
        evaluador: "",
        fecha: "",
        periodo: "",
        resultado: "",
        desempeno: "",
        objetivos: "",
        competencias: "",
        fortalezas: "",
        oportunidades: "",
        planAccion: "",
        comentarios: "",
      });
    }
  }, [evaluacion]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "empleado", label: "Empleado" },
              { id: "evaluador", label: "Evaluador" },
              { id: "fecha", label: "Fecha de Evaluación", type: "date" },
              { id: "periodo", label: "Periodo", placeholder: "Ej: 2025-Q1" },
              { id: "resultado", label: "Resultado (%)", type: "number" },
            ].map(({ id, label, type = "text", placeholder }) => (
              <div className="space-y-2" key={id}>
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={(formData as any)[id]}
                  onChange={(e) =>
                    setFormData({ ...formData, [id]: e.target.value })
                  }
                  required
                  min={type === "number" ? 0 : undefined}
                  max={type === "number" ? 100 : undefined}
                />
              </div>
            ))}
          </div>

          {[
            "desempeno",
            "objetivos",
            "competencias",
            "fortalezas",
            "oportunidades",
            "planAccion",
            "comentarios",
          ].map((field) => (
            <div className="space-y-2" key={field}>
              <Label htmlFor={field}>
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </Label>
              <Input
                id={field}
                value={(formData as any)[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                required={
                  ["desempeno", "objetivos", "competencias"].includes(field)
                }
              />
            </div>
          ))}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {evaluacion ? "Guardar Cambios" : "Crear Evaluación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluacionModal;