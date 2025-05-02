import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ClipboardCheck,
  Pencil,
  Trash2,
  Calendar,
  Users,
  Target,
  FileText,
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { AuditoriaModel } from "@/models/auditoria-model";

interface PuntoEvaluado {
  punto_norma: string;
  calificacion: string;
  comentarios: string;
}


interface AuditoriaSingleProps {
  auditoria: AuditoriaModel;
  onBack: () => void;
  onEdit: (auditoria: AuditoriaModel) => void;
  onDelete: (id: number) => void;
}

const AuditoriaSingle: React.FC<AuditoriaSingleProps> = ({ auditoria, onBack, onEdit, onDelete }) => {
  const getCalificacionColor = (calificacion: string): string => {
    switch (calificacion) {
      case "Malo":
        return "bg-red-100 text-red-800";
      case "Regular":
        return "bg-yellow-100 text-yellow-800";
      case "Bueno":
        return "bg-green-100 text-green-800";
      case "Muy Bueno":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case "Planificada":
        return "bg-blue-100 text-blue-800";
      case "En Ejecución":
        return "bg-yellow-100 text-yellow-800";
      case "Terminada":
        return "bg-green-100 text-green-800";
      case "Controlada":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.text(`Auditoría ${auditoria.numero}`, 20, 20);

    // Información general
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(auditoria.fecha_programada).toLocaleDateString()}`, 20, 35);
    doc.text(`Responsable: ${auditoria.responsable}`, 20, 45);
    doc.text(`Estado: ${auditoria.estado}`, 20, 55);

    // Objetivo
    doc.text("Objetivo:", 20, 70);
    const splitObjective = doc.splitTextToSize(auditoria.objetivo, 170);
    doc.text(splitObjective, 20, 80);

    // Procesos evaluados
    doc.text("Procesos Evaluados:", 20, 100);
    const splitProcesos = doc.splitTextToSize(auditoria.procesos_evaluar, 170);
    doc.text(splitProcesos, 20, 110);

    // Puntos evaluados
    doc.text("Puntos Evaluados:", 20, 140);

    const tableData = auditoria.puntos.map((punto) => [
      punto.punto_norma,
      punto.calificacion,
      punto.comentarios,
    ]);

    // doc.autoTable({
    //   startY: 150,
    //   head: [["Punto de la Norma", "Calificación", "Comentarios"]],
    //   body: tableData,
    // });

    // // Comentarios finales
    // const finalCommentsY = doc.previousAutoTable.finalY + 20;
    // doc.text("Comentarios Finales:", 20, finalCommentsY);
    // const splitComments = doc.splitTextToSize(auditoria.comentarios_finales || "", 170);
    // doc.text(splitComments, 20, finalCommentsY + 10);

    doc.save(`auditoria_${auditoria.numero}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Auditorías
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={downloadPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          <Button variant="outline" onClick={() => onEdit(auditoria)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(auditoria.id!); // Usamos el número como identificador
              onBack();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Header Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <ClipboardCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Auditoría {auditoria.numero}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(auditoria.fecha_programada).toLocaleDateString()}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {auditoria.responsable}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(auditoria.estado)}`}>
                    {auditoria.estado}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Objetivo y Procesos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">Objetivo</h2>
              <p className="text-muted-foreground whitespace-pre-line">{auditoria.objetivo}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Procesos a Evaluar</h2>
              <p className="text-muted-foreground whitespace-pre-line">{auditoria.procesos_evaluar}</p>
            </div>
          </motion.div>

          {/* Puntos Evaluados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Puntos Evaluados</h2>
            <div className="space-y-4">
              {auditoria.puntos.map((punto, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Punto #{index + 1}</h3>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getCalificacionColor(punto.calificacion)}`}
                    >
                      {punto.calificacion}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="font-medium text-sm">Punto de la Norma:</p>
                    <p className="text-muted-foreground">{punto.punto_norma}</p>
                  </div>
                  <div className="mt-2">
                    <p className="font-medium text-sm">Comentarios:</p>
                    <p className="text-muted-foreground">{punto.comentarios}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Comentarios finales */}
          {auditoria.comentarios_finales && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h2 className="text-lg font-semibold mb-2">Comentarios Finales</h2>
              <p className="text-muted-foreground whitespace-pre-line">{auditoria.comentarios_finales}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditoriaSingle;
