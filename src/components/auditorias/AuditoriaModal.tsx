import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "../ui/dialog";
import { AuditoriaModel, PuntoEvaluadoModel } from "@/models/auditoria-model";
import { ProcesoModel } from "@/models/proceso-model";


interface Persona {
  id: number;
  nombre: string;
}

interface AuditoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (auditoria: AuditoriaModel) => void;
  auditoria?: AuditoriaModel;
}

function AuditoriaModal({ isOpen, onClose, onSave, auditoria }: AuditoriaModalProps) {
  const [formData, setFormData] = useState<AuditoriaModel>({
    numero: "",
    fecha_programada: "",
    responsable: "",
    objetivo: "",
    procesos_evaluar: "",
    estado: "Planificada",
    puntos: [],
    comentarios_finales: ""
  });

  const [personal, setPersonal] = useState<Persona[]>(() => {
    const saved = localStorage.getItem("personal");
    return saved ? JSON.parse(saved) : [];
  });

  const [procesos, setProcesos] = useState<ProcesoModel[]>(() => {
    const saved = localStorage.getItem("procesos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (auditoria) {
      setFormData(auditoria);
    } else {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData({
        numero: `A${year}${month}-${random}`,
        fecha_programada: "",
        responsable: "",
        objetivo: "",
        procesos_evaluar: "",
        estado: "Planificada",
        puntos: [],
        comentarios_finales: ""
      });
    }
  }, [auditoria]);

  const addPuntoEvaluado = () => {
    setFormData(prev => ({
      ...prev,
      puntos: [
        ...prev.puntos,
        {
          punto_norma: "",
          calificacion: "Regular",
          comentarios: ""
        }
      ]
    }));
  };

  const removePuntoEvaluado = (index: number) => {
    setFormData(prev => ({
      ...prev,
      puntos: prev.puntos.filter((_, i) => i !== index)
    }));
  };

  const updatePuntoEvaluado = (index: number, field: keyof PuntoEvaluadoModel, value: string) => {
    setFormData(prev => ({
      ...prev,
      puntos: prev.puntos.map((punto, i) =>
        i === index ? { ...punto, [field]: value } : punto
      )
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{auditoria ? "Editar Auditoría" : "Nueva Auditoría"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número de Auditoría</Label>
              <Input id="numero" value={formData.numero} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_programada">Fecha Programada</Label>
              <Input
                id="fecha_programada"
                type="date"
                value={formData.fecha_programada}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_programada: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable</Label>
            <select
              id="responsable"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.responsable}
              onChange={(e) =>
                setFormData({ ...formData, responsable: e.target.value })
              }
              required
            >
              <option value="">Seleccione un responsable</option>
              {personal.map((persona) => (
                <option key={persona.id} value={persona.nombre}>
                  {persona.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo</Label>
            <Textarea
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) =>
                setFormData({ ...formData, objetivo: e.target.value })
              }
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="procesos_evaluar">Procesos a Evaluar</Label>
            <select
              id="procesos_evaluar"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.procesos_evaluar}
              onChange={(e) =>
                setFormData({ ...formData, procesos_evaluar: e.target.value })
              }
              required
            >
              <option value="">Seleccione un proceso</option>
              {procesos.map((proceso) => (
                <option key={proceso.id} value={proceso.titulo}>
                  {proceso.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado de la Auditoría</Label>
            <select
              id="estado"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.estado}
              onChange={(e) =>
                setFormData({ ...formData, estado: e.target.value })
              }
              required
            >
              <option value="Planificada">Planificada</option>
              <option value="En Ejecución">En Ejecución</option>
              <option value="Terminada">Terminada</option>
              <option value="Controlada">Controlada</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Puntos Evaluados</Label>
              <Button type="button" onClick={addPuntoEvaluado} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Punto
              </Button>
            </div>

            {formData.puntos.map((punto, index) => (
              <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium">Punto Evaluado #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePuntoEvaluado(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Punto de la Norma</Label>
                    <Input
                      value={punto.punto_norma}
                      onChange={(e) =>
                        updatePuntoEvaluado(index, "punto_norma", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calificación</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={punto.calificacion}
                      onChange={(e) =>
                        updatePuntoEvaluado(index, "calificacion", e.target.value)
                      }
                      required
                    >
                      <option value="Malo">Malo</option>
                      <option value="Regular">Regular</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Muy Bueno">Muy Bueno</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Comentarios</Label>
                  <Textarea
                    value={punto.comentarios}
                    onChange={(e) =>
                      updatePuntoEvaluado(index, "comentarios", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentarios_finales">Comentarios Finales</Label>
            <Textarea
              id="comentarios_finales"
              value={formData.comentarios_finales}
              onChange={(e) =>
                setFormData({ ...formData, comentarios_finales: e.target.value })
              }
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {auditoria ? "Guardar Cambios" : "Crear Auditoría"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AuditoriaModal;
