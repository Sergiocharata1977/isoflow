import { ObjetivoModel } from "@/models/objetivo-model";
import db from "./db";

export class ObjetivoService {
    static async create(data: ObjetivoModel): Promise<ObjetivoModel> {
        try {
            const exists = await db.execute("SELECT 1 FROM objetivos WHERE codigo = ?", [data.codigo]);
            if (exists.rows.length > 0) throw new Error("El código ya existe");

            const result = await db.execute(
                `INSERT INTO objetivos (
          codigo, titulo, descripcion, responsable, procesos_relacionados
        ) VALUES (?, ?, ?, ?, ?)`,
                [
                    data.codigo,
                    data.titulo,
                    data.descripcion ?? "",
                    data.responsable,
                    data.procesos_relacionados ?? "",
                ]
            );

            return result as any;
        } catch (error) {
            console.error("Error creando objetivo:", error);
            throw error;
        }
    }

    static async getAll(): Promise<ObjetivoModel[]> {
        try {
            const result = await db.execute("SELECT * FROM objetivos ORDER BY created_at DESC");

            return result.rows.map((row: any) => ({
                id: row.id,
                codigo: row.codigo,
                titulo: row.titulo,
                descripcion: row.descripcion,
                responsable: row.responsable,
                procesos_relacionados: row.procesos_relacionados,
                created_at: row.created_at,
            }));
        } catch (error) {
            console.error("Error obteniendo objetivos:", error);
            throw error;
        }
    }

    static async getById(id: number): Promise<ObjetivoModel | null> {
        try {
            const result = await db.execute("SELECT * FROM objetivos WHERE id = ?", [id]);
            const row = result.rows[0];
            if (!row) return null;

            return {
                id: Number(row.id) ?? undefined,
                codigo: row.codigo as string,
                titulo: row.titulo as string,
                descripcion: row.descripcion as string,
                responsable: row.responsable as string,
                procesos_relacionados: row.procesos_relacionados as string,
                created_at: row.created_at as string,
            };
        } catch (error) {
            console.error("Error obteniendo objetivo:", error);
            throw error;
        }
    }

    static async update(id: number, data: Partial<ObjetivoModel>): Promise<ObjetivoModel> {
        try {
            const original = await this.getById(id);
            if (!original) throw new Error("Objetivo no encontrado");

            const result = await db.execute(
                `UPDATE objetivos SET
          codigo = ?, titulo = ?, descripcion = ?, responsable = ?, procesos_relacionados = ?
        WHERE id = ?`,
                [
                    data.codigo ?? original.codigo,
                    data.titulo ?? original.titulo,
                    data.descripcion ?? original.descripcion,
                    data.responsable ?? original.responsable,
                    data.procesos_relacionados ?? original.procesos_relacionados,
                    id,
                ]
            );

            return result as any;
        } catch (error) {
            console.error("Error actualizando objetivo:", error);
            throw error;
        }
    }

    static async delete(id: number) {
        try {
            await db.execute("DELETE FROM objetivos WHERE id = ?", [id]);
            return { success: true, message: "Objetivo eliminado correctamente" };
        } catch (error) {
            console.error("Error eliminando objetivo:", error);
            throw error;
        }
    }
}
