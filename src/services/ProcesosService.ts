import { ProcesoModel } from "@/models/proceso-model";
import db from "./db";

export class ProcesosService {

    static async getAll(): Promise<ProcesoModel[]> {
        try {
            const result = await db.execute("SELECT * FROM procesos ORDER BY created_at DESC");

            return result.rows.map((row: any) => ({
                id: row.id ?? null,
                titulo: row.titulo,
                codigo: row.codigo,
                version: row.version,
                estado: row.estado,
                objetivo: row.objetivo,
                alcance: row.alcance,
                descripcion_detellada: row.descripcion_detellada,
                esquema_url: row.esquema_url,
                entradas: row.entradas,
                salidas: row.salidas,
                indicadores_relacionados: row.indicadores_relacionados,
                created_at: row.created_at ?? null,
                updated_at: row.updated_at ?? null,
            }));
        } catch (error) {
            console.error("Error obteniendo auditorías:", error);
            throw error;
        }
    }
}
