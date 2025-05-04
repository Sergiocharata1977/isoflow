export interface AuditoriaModel {
    id?: number
    numero_auditoria: string;
    fecha_programada: string;
    
    responsable_id: number;
    responsable?: any;

    objetivo: string;
    proceso_id: number

    estado: string; // 'Planificada', 'En Proceso', 'Finalizada', 'Cancelada'
    puntos?: PuntoEvaluadoModel[];
    comentarios_finales: string;
    created_at?: string,
    updated_at?: string,
}

export interface PuntoEvaluadoModel {
    punto_norma: string;
    calificacion: string;
    comentarios: string;
}