export interface PersonalData {
  id?: number;
  email: string;
  full_name: string;
  role: string;
  department?: string;
  position?: string;
  identificacion?: string;
  phone?: string;
  address?: string;
  hire_date?: string;
  skills?: string;
  performance_evaluation?: string;
  training_received?: string;
  notes?: string;
  profile_image?: string;
  formacionAcademica?: AcademicFormation[];
  experienciaLaboral?: WorkExperience[];
  password: string;
}

export interface AcademicFormation {
  id?: number;
  user_id: number;
  titulo: string;
  institucion: string;
  anio_finalizacion: string;
  descripcion?: string;
}

export interface WorkExperience {
  id?: number;
  user_id: number;
  empresa: string;
  puesto: string;
  fecha_inicio: string;
  fecha_fin?: string;
  descripcion?: string;


}