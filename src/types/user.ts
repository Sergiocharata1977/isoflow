import { AcademicFormation, WorkExperience } from "@/models/personal-model";

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  image?: string;
  profile_image?: string;
  nombre?: string;
  puesto?: string;
  departamento?: string;
  imagen?: string;
  telefono?: string;
  documentoIdentidad?: string;
  identificacion?: string;
  hire_date?: string;
  fechaIngreso?: string;
  address?: string;
  direccion?: string;
  formacionAcademica: AcademicFormation[];
  experienciaLaboral: WorkExperience[];
  competencias?: string;
  evaluacionDesempeno?: string;
  capacitacionesRecibidas?: string;
  position?: string;
  department?: string;
}