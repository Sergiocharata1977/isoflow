import db from "./db";
import { MedicionModel } from "@/models/medicion-model";

export class MedicionesService {
    static async create(data: MedicionModel): Promise<MedicionModel> {
        try {
            const result = await db.execute(
                `INSERT INTO mediciones (titulo, medicion, comentarios)
         VALUES (?, ?, ?) RETURNING *`,
                [data.titulo, data.medicion, data.comentarios]
            );

            const row = result.rows[0];
            if (!row) throw new Error("No se pudo crear la medición.");

            return this.mapRowToModel(row);
        } catch (error) {
            console.error("Error al crear medición:", error);
            throw error;
        }
    }

    static async getAll(): Promise<MedicionModel[]> {
        try {
            const result = await db.execute("SELECT * FROM mediciones ORDER BY created_at DESC");
            return result.rows.map(this.mapRowToModel);
        } catch (error) {
            console.error("Error al obtener mediciones:", error);
            throw error;
        }
    }

    static async getById(id: number): Promise<MedicionModel | null> {
        try {
            const result = await db.execute("SELECT * FROM mediciones WHERE id = ?", [id]);
            const row = result.rows[0];
            return row ? this.mapRowToModel(row) : null;
        } catch (error) {
            console.error("Error al obtener medición:", error);
            throw error;
        }
    }

    static async update(id: number, data: Partial<MedicionModel>): Promise<MedicionModel> {
        try {
            const existing = await this.getById(id);
            if (!existing) throw new Error("Medición no encontrada.");

            const updatedData = {
                ...existing,
                ...data,
            };

            await db.execute(
                `UPDATE mediciones
         SET titulo = ?, medicion = ?, comentarios = ?
         WHERE id = ?`,
                [
                    updatedData.titulo,
                    updatedData.medicion,
                    updatedData.comentarios,
                    id,
                ]
            );

            const updated = await this.getById(id);
            if (!updated) throw new Error("No se pudo recuperar la medición actualizada.");

            return updated;
        } catch (error) {
            console.error("Error al actualizar medición:", error);
            throw error;
        }
    }

    static async delete(id: number): Promise<{ success: boolean; message: string }> {
        try {
            await db.execute("DELETE FROM mediciones WHERE id = ?", [id]);
            return { success: true, message: "Medición eliminada correctamente" };
        } catch (error) {
            console.error("Error al eliminar medición:", error);
            throw error;
        }
    }

    private static mapRowToModel(row: any): MedicionModel {
        return {
            id: Number(row.id),
            titulo: String(row.titulo),
            medicion: String(row.medicion),
            comentarios: String(row.comentarios),
            created_at: row.created_at ? String(row.created_at) : undefined,
            updated_at: row.updated_at ? String(row.updated_at) : undefined,
        };
    }
}