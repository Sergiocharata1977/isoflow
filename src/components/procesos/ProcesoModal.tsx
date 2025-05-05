import React from "react";
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
import { useState, useEffect } from "react";
import { ProcesoModel } from "@/models/proceso-model";
import { toast } from "sonner";

interface ProcesoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void; 
  proceso?: ProcesoModel | null;
  onSave: (procesoData: Omit<ProcesoModel, "id" | "created_at" | "updated_at">) => Promise<void>;

}

function ProcesoModal({ isOpen, onClose, onSaveSuccess, proceso, onSave }: ProcesoModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    codigo: "",
    version: "1.0",
    objetivo: "",
    alcance: "",
    descripcion_detallada: "",
    esquema_url: "",
    entradas: "",
    salidas: "",
    indicadores_relacionados: "",
    estado: "activo",
  });

  useEffect(() => {
    if (proceso) {
      setFormData({
        titulo: proceso.titulo || "",
        codigo: proceso.codigo || "",
        version: proceso.version || "1.0",
        objetivo: proceso.objetivo || "",
        alcance: proceso.alcance || "",
        descripcion_detallada: proceso.descripcion_detallada || "",
        esquema_url: proceso.esquema_url || "",
        entradas: proceso.entradas || "",
        salidas: proceso.salidas || "",
        indicadores_relacionados: proceso.indicadores_relacionados || "",
        estado: proceso.estado || "activo",
      });
    } else {
      // Resetear formulario si es nuevo
      setFormData({
        titulo: "",
        codigo: "",
        version: "1.0",
        objetivo: "",
        alcance: "",
        descripcion_detallada: "",
        esquema_url: "",
        entradas: "",
        salidas: "",
        indicadores_relacionados: "",
        estado: "activo",
      });
    }
  }, [proceso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData); 
      onClose();
    } catch (error) {
      console.error("Error al guardar el proceso:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {proceso ? "Editar Proceso" : "Nuevo Proceso"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título del Proceso</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versión</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo</Label>
            <Textarea
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alcance">Alcance</Label>
            <Textarea
              id="alcance"
              value={formData.alcance}
              onChange={(e) => setFormData({ ...formData, alcance: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción Detallada</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion_detallada}
              onChange={(e) => setFormData({ ...formData, descripcion_detallada: e.target.value })}
              required
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="esquema_url">URL del Esquema (Opcional)</Label>
            <Input
              id="esquema_url"
              type="text"
              value={formData.esquema_url}
              onChange={(e) => setFormData({ ...formData, esquema_url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entradas">Entradas</Label>
              <Textarea
                id="entradas"
                value={formData.entradas}
                onChange={(e) => setFormData({ ...formData, entradas: e.target.value })}
                required
                placeholder="Una entrada por línea"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salidas">Salidas</Label>
              <Textarea
                id="salidas"
                value={formData.salidas}
                onChange={(e) => setFormData({ ...formData, salidas: e.target.value })}
                required
                placeholder="Una salida por línea"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indicadores">Indicadores Relacionados</Label>
            <Textarea
              id="indicadores"
              value={formData.indicadores_relacionados}
              onChange={(e) => setFormData({ ...formData, indicadores_relacionados: e.target.value })}
              required
              placeholder="Un indicador por línea"
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {proceso ? "Guardar Cambios" : "Crear Proceso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProcesoModal;