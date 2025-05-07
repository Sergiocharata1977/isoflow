export interface IndicadorModel {
    id?: number,
    titulo: string,
    responsable_id: number,
    descripcion: string,
    unidad_medida: string,
    limite_aceptacion: string,
    objetivo_calidad: string,
    created_at?: string,
    updated_at?: string
}