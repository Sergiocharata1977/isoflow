import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Target } from "lucide-react";
import { motion } from "framer-motion";

function ObjetivoSingle({ objetivo, onBack, onEdit }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <Button onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Target className="h-10 w-10 text-primary" />
          <h2 className="text-2xl font-bold">{objetivo.titulo}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{objetivo.descripcion}</p>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Responsable</h3>
              <p className="text-muted-foreground">{objetivo.responsable}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Procesos Relacionados</h3>
              <p className="text-muted-foreground">{objetivo.procesos}</p>
            </div>
          </div>
        </div>

        {objetivo.indicadores && objetivo.indicadores.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Indicadores Asociados</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <ul className="list-disc pl-5 space-y-2">
                {objetivo.indicadores.map((indicador, index) => (
                  <li key={index}>{indicador.nombre}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ObjetivoSingle;