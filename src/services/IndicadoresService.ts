import db from "./db";
import { IndicadorModel } from "@/models/indicador-model";

export class IndicadoresService {
    static async create(data: IndicadorModel): Promise<IndicadorModel> {
        try {
            await db.execute(
                `INSERT INTO indicadores (
                    titulo,
                    responsable_id,
                    descripcion,
                    unidad_medida,
                    limite_aceptacion,
                    objetivo_calidad
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data.titulo,
                    data.responsable_id,
                    data.descripcion ?? null,
                    data.unidad_medida ?? null,
                    data.limite_aceptacion ?? null,
                    data.objetivo_calidad ?? null,
                ]
            );

            const created = await db.execute("SELECT * FROM indicadores ORDER BY id DESC LIMIT 1");
            const row = created.rows[0];
            if (!row) throw new Error("No se pudo recuperar el indicador recién creado");

            return {
                id: Number(row.id),
                titulo: row.titulo as string,
                responsable_id: row.responsable_id as number,
                descripcion: row.descripcion as string,
                unidad_medida: row.unidad_medida as string,
                limite_aceptacion: row.limite_aceptacion as string,
                objetivo_calidad: row.objetivo_calidad as string,
                created_at: row.created_at as string,
                updated_at: row.updated_at as string,
            };
        } catch (error) {
            throw error;
        }
    }

    static async getAll(): Promise<IndicadorModel[]> {
        try {
            const result = await db.execute("SELECT * FROM indicadores ORDER BY created_at DESC");

            return result.rows.map((row: any) => ({
                id: row.id ?? null,
                titulo: row.titulo ?? null,
                responsable_id: row.responsable_id as number,
                descripcion: row.descripcion ?? null,
                unidad_medida: row.unidad_medida ?? null,
                limite_aceptacion: row.limite_aceptacion ?? null,
                objetivo_calidad: row.objetivo_calidad ?? null,
                created_at: row.created_at ?? null,
                updated_at: row.updated_at ?? null,
            }));
        } catch (error) {
            console.error("Error obteniendo indicadores:", error);
            throw error;
        }
    }

    static async getById(id: number): Promise<IndicadorModel | null> {
        try {
            const result = await db.execute("SELECT * FROM indicadores WHERE id = ?", [id]);
            const row = result.rows[0];
            if (!row) return null;

            return {
                id: Number(row.id),
                titulo: row.titulo as string,
                responsable_id: row.responsable_id as number,
                descripcion: row.descripcion as string,
                unidad_medida: row.unidad_medida as string,
                limite_aceptacion: row.limite_aceptacion as string,
                objetivo_calidad: row.objetivo_calidad as string,
                created_at: row.created_at as string,
                updated_at: row.updated_at as string,
            };
        } catch (error) {
            console.error("Error obteniendo indicador:", error);
            throw error;
        }
    }

    static async update(id: number, data: Partial<IndicadorModel>): Promise<IndicadorModel> {
        try {
            const original = await this.getById(id);
            if (!original) throw new Error("Indicador no encontrado");

            const updateData: Partial<IndicadorModel> = {
                titulo: data.titulo ?? original.titulo,
                responsable_id: data.responsable_id ?? original.responsable_id,
                descripcion: data.descripcion ?? original.descripcion,
                unidad_medida: data.unidad_medida ?? original.unidad_medida,
                limite_aceptacion: data.limite_aceptacion ?? original.limite_aceptacion,
                objetivo_calidad: data.objetivo_calidad ?? original.objetivo_calidad,
            };

            await db.execute(
                `UPDATE indicadores SET
                    titulo = ?, responsable_id = ?, descripcion = ?,
                    unidad_medida = ?, limite_aceptacion = ?, objetivo_calidad = ?
                WHERE id = ?`,
                [
                    updateData.titulo,
                    updateData.responsable_id,
                    updateData.descripcion,
                    updateData.unidad_medida,
                    updateData.limite_aceptacion,
                    updateData.objetivo_calidad,
                    id,
                ]
            );

            const updated = await this.getById(id);
            return updated!;
        } catch (error) {
            console.error("Error actualizando indicador:", error);
            throw error;
        }
    }

    static async delete(id: number) {
        try {
            await db.execute("DELETE FROM indicadores WHERE id = ?", [id]);
            return { success: true, message: "Indicador eliminado correctamente" };
        } catch (error) {
            console.error("Error eliminando indicador:", error);
            throw error;
        }
    }
}
