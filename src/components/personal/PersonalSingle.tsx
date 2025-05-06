import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  Pencil,
  Trash2,
  Building2,
  GraduationCap,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Briefcase,
  Star,
  BarChart2,
} from "lucide-react";
import { AcademicFormation, PersonalData, WorkExperience } from "@/models/personal-model";

interface Formacion {
  titulo?: string;
  institucion?: string;
  anioFinalizacion?: string;
  descripcion?: string;
}

interface Experiencia {
  puesto?: string;
  empresa?: string;
  fechaInicio?: string;
  fechaFin?: string;
  descripcion?: string;
}

interface PersonalSingleProps {
  persona: {
    id: number;
    nombre?: string;
    puesto?: string;
    departamento?: string;
    imagen?: string;
    email?: string;
    telefono?: string;
    documentoIdentidad?: string;
    identificacion?: string;
    hire_date?: string;
    fechaIngreso?: string;
    address: string;
    phone?: string;
    direccion?: string;
    formacionAcademica?: AcademicFormation[];
    experienciaLaboral?: WorkExperience[];
    competencias?: string;
    evaluacionDesempeno?: string;
    capacitacionesRecibidas?: string;
    full_name?: string;
    position?: string;
    department?: string;
  };
  onBack: () => void;
  onEdit: (persona: PersonalSingleProps["persona"]) => void;
  onDelete: (id: number) => void;
}

function PersonalSingle({ persona, onBack, onEdit, onDelete }: PersonalSingleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Personal
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(persona)}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(persona.id);
              onBack();
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
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
            className="p-6 border rounded-lg bg-card border-border"
          >
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 overflow-hidden rounded-lg">
                <img
                  src={
                    persona.imagen ||
                    "https://images.unsplash.com/photo-1578390432942-d323db577792"
                  }
                  alt={`Foto de ${persona.full_name}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{persona.full_name}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4 mr-1" />
                    {persona.position}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4 mr-1" />
                    {persona.department}
                  </span>
                </div>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-1" />
                    {persona.email}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-1" />
                    {persona.phone}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Información Personal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 space-y-4 border rounded-lg bg-card border-border"
          >
            <h2 className="flex items-center text-lg font-semibold">
              <Users className="w-5 h-5 mr-2" />
              Información Personal
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Documento de Identidad
                </p>
                <p>{persona.identificacion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                <p>
                  {persona.hire_date
                    ? new Date(persona.hire_date ?? "").toLocaleDateString()
                    : ""}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p>{persona.address}</p>
              </div>
            </div>
          </motion.div>

          {/* Formación y Experiencia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="p-6 border rounded-lg bg-card border-border">
              <h2 className="flex items-center mb-4 text-lg font-semibold">
                <GraduationCap className="w-5 h-5 mr-2" />
                Formación Académica
              </h2>
              <div className="space-y-4">
                {persona.formacionAcademica?.map((formacion, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium">{formacion.titulo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formacion.institucion}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Año: {formacion.anio_finalizacion}
                    </p>
                    {formacion.descripcion && (
                      <p className="text-sm text-muted-foreground">
                        {formacion.descripcion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border rounded-lg bg-card border-border">
              <h2 className="flex items-center mb-4 text-lg font-semibold">
                <Briefcase className="w-5 h-5 mr-2" />
                Experiencia Laboral
              </h2>
              <div className="space-y-4">
                {persona.experienciaLaboral?.map((experiencia, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium">{experiencia.puesto}</h3>
                    <p className="text-sm text-muted-foreground">
                      {experiencia.empresa}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {experiencia.fecha_inicio
                        ? new Date(experiencia.fecha_inicio).toLocaleDateString()
                        : ""}
                      {" - "}
                      {experiencia.fecha_fin
                        ? new Date(experiencia.fecha_fin).toLocaleDateString()
                        : "Actual"}
                    </p>
                    {experiencia.descripcion && (
                      <p className="text-sm text-muted-foreground">
                        {experiencia.descripcion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - 1 columna */}
        <div className="space-y-6">
          {/* Competencias */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 border rounded-lg bg-card border-border"
          >
            <h2 className="flex items-center mb-4 text-lg font-semibold">
              <Star className="w-5 h-5 mr-2" />
              Competencias
            </h2>
            <div className="space-y-2">
              {persona.competencias?.split("\n").map((competencia, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 space-x-2 rounded-md hover:bg-accent"
                >
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>{competencia}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Evaluación de Desempeño */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 border rounded-lg bg-card border-border"
          >
            <h2 className="flex items-center mb-4 text-lg font-semibold">
              <BarChart2 className="w-5 h-5 mr-2" />
              Evaluación de Desempeño
            </h2>
            <p className="text-sm whitespace-pre-line text-muted-foreground">
              {persona.evaluacionDesempeno}
            </p>
          </motion.div>

          {/* Capacitaciones */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 border rounded-lg bg-card border-border"
          >
            <h2 className="flex items-center mb-4 text-lg font-semibold">
              <BookOpen className="w-5 h-5 mr-2" />
              Capacitaciones Recibidas
            </h2>
            <div className="space-y-2">
              {persona.capacitacionesRecibidas?.split("\n").map(
                (capacitacion, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 space-x-2 rounded-md hover:bg-accent"
                  >
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>{capacitacion}</span>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PersonalSingle;