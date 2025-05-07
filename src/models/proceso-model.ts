export interface ProcesoModel {
  id?: number;
  titulo?: string;
  codigo?: string
  version?: string
  estado?: string
  objetivo?: string
  alcance?: string
  descripcion_detallada?: string
  esquema_url?: string
  entradas: string
  salidas: string
  indicadores_relacionados: string
  created_at?: string
  updated_at?: string
} 