export interface AuditoriaModel {
    id?: number
    numero: string;
    fecha_programada: string;
    responsable: string;
    objetivo: string;
    procesos_evaluar: string;
    estado: string;
    puntos: PuntoEvaluadoModel[];
    comentarios_finales: string;
}

export interface PuntoEvaluadoModel {
    punto_norma: string;
    calificacion: string;
    comentarios: string;
}