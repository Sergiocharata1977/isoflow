import { AuditoriaModel } from "@/models/auditoria-model";
import db from "./db";

export class AuditoriasService {
    static async create(data: AuditoriaModel): Promise<AuditoriaModel> {
        try {
            // Verifica si ya existe un número de auditoría igual
            const exists = await db.execute("SELECT 1 FROM auditorias WHERE numero_auditoria = ?", [data.numero_auditoria]);
            if (exists.rows.length > 0) throw new Error("El número de auditoría ya existe");

            await db.execute(
                `INSERT INTO auditorias (
                    numero_auditoria,
                    fecha_programada,
                    responsable_id,
                    objetivo,
                    proceso_id,
                    estado,
                    comentarios_finales
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.numero_auditoria,
                    data.fecha_programada,
                    data.responsable_id,
                    data.objetivo,
                    data.proceso_id,
                    data.estado,
                    data.comentarios_finales ?? null,
                ]
            );

            const created = await db.execute("SELECT * FROM auditorias ORDER BY created_at DESC LIMIT 1");
            const row = created.rows[0];
            if (!row) throw new Error("No se pudo recuperar la auditoría recién creada");

            return {
                id: Number(row.id),
                numero_auditoria: row.numero_auditoria as string,
                fecha_programada: row.fecha_programada as string,
                responsable_id: row.responsable_id as number,
                objetivo: row.objetivo as string,
                proceso_id: row.proceso_id as number,
                estado: row.estado as string,
                comentarios_finales: row.comentarios_finales as string,
                created_at: row.created_at as string,
                updated_at: row.updated_at as string,
            };
        } catch (error) {
            console.error("Error creando auditoría:", error);
            throw error;
        }
    }

    static async getAll(): Promise<AuditoriaModel[]> {
        try {
            const result = await db.execute("SELECT * FROM auditorias ORDER BY created_at DESC");

            return result.rows.map((row: any) => ({
                id: row.id ?? null,
                numero_auditoria: row.numero_auditoria ?? null,
                fecha_programada: row.fecha_programada ?? null,
                responsable_id: row.responsable_id ?? null,
                objetivo: row.objetivo ?? null,
                proceso_id: row.proceso_id ?? null,
                estado: row.estado ?? null,
                comentarios_finales: row.comentarios_finales ?? null,
                created_at: row.created_at ?? null,
                updated_at: row.updated_at ?? null,
            }));
        } catch (error) {
            console.error("Error obteniendo auditorías:", error);
            throw error;
        }
    }

    static async getById(id: number): Promise<AuditoriaModel | null> {
        try {
            const result = await db.execute("SELECT * FROM auditorias WHERE id = ?", [id]);
            const row = result.rows[0];
            if (!row) return null;

            return {
                id: Number(row.id),
                numero_auditoria: row.numero_auditoria as string,
                fecha_programada: row.fecha_programada as string,
                responsable_id: row.responsable_id as number,
                objetivo: row.objetivo as string,
                proceso_id: row.proceso_id as number,
                estado: row.estado as string,
                comentarios_finales: row.comentarios_finales as string,
                created_at: row.created_at as string,
                updated_at: row.updated_at as string,
            };
        } catch (error) {
            console.error("Error obteniendo auditoría:", error);
            throw error;
        }
    }

    static async update(id: number, data: Partial<AuditoriaModel>): Promise<AuditoriaModel> {
        try {
            const original = await this.getById(id);
            if (!original) throw new Error("Auditoría no encontrada");

            const updateData: Partial<AuditoriaModel> = {
                numero_auditoria: data.numero_auditoria ?? original.numero_auditoria,
                fecha_programada: data.fecha_programada ?? original.fecha_programada,
                responsable_id: data.responsable_id ?? original.responsable_id,
                objetivo: data.objetivo ?? original.objetivo,
                proceso_id: data.proceso_id ?? original.proceso_id,
                estado: data.estado ?? original.estado,
                comentarios_finales: data.comentarios_finales ?? original.comentarios_finales,
            };

            await db.execute(
                `UPDATE auditorias SET
                    numero_auditoria = ?, fecha_programada = ?, responsable_id = ?, 
                    objetivo = ?, proceso_id = ?, estado = ?, comentarios_finales = ?
                WHERE id = ?`,
                [
                    updateData.numero_auditoria,
                    updateData.fecha_programada,
                    updateData.responsable_id,
                    updateData.objetivo,
                    updateData.proceso_id,
                    updateData.estado,
                    updateData.comentarios_finales,
                    id,
                ]
            );

            const updated = await this.getById(id);
            return updated!;
        } catch (error) {
            console.error("Error actualizando auditoría:", error);
            throw error;
        }
    }

    static async delete(id: number) {
        try {
            await db.execute("DELETE FROM auditorias WHERE id = ?", [id]);
            return { success: true, message: "Auditoría eliminada correctamente" };
        } catch (error) {
            console.error("Error eliminando auditoría:", error);
            throw error;
        }
    }
}
