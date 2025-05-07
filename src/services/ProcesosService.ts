import { ProcesoModel } from "@/models/proceso-model";
import db from "./db";
import { log } from "console";

export class ProcesosService {
  /**
   * Obtener todos los procesos
   */
  static async getAll(): Promise<ProcesoModel[]> {
    try {
      const result = await db.execute(
        "SELECT * FROM procesos ORDER BY created_at DESC"
      );
      return result.rows.map((row: any) => this.mapRowToModel(row));
    } catch (error) {
      console.error("Error obteniendo procesos:", error);
      throw error;
    }
  }

  /**
   * Obtener un proceso por ID
   */
  static async getById(id: number): Promise<ProcesoModel | null> {
    try {
      const result = await db.execute("SELECT * FROM procesos WHERE id = ?", [
        id,
      ]);
      if (result.rows.length === 0) return null;
      return this.mapRowToModel(result.rows[0]);
    } catch (error) {
      console.error("Error obteniendo proceso por ID:", error);
      throw error;
    }
  }

  /**
   * Crear un nuevo proceso
   */
  static async create(
    proceso: Omit<ProcesoModel, "id" | "created_at" | "updated_at">
  ): Promise<ProcesoModel> {
    try {
      const query = `
                INSERT INTO procesos (
                    titulo, codigo, version, estado, objetivo, alcance, 
                    descripcion_detallada, esquema_url, entradas, salidas, indicadores_relacionados
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
      const params = [
        proceso.titulo,
        proceso.codigo,
        proceso.version,
        proceso.estado,
        proceso.objetivo,
        proceso.alcance,
        proceso.descripcion_detallada,
        proceso.esquema_url,
        proceso.entradas,
        proceso.salidas,
        proceso.indicadores_relacionados,
      ];

      const result = await db.execute(query, params);
      const insertId = Number(result.lastInsertRowid);

      if (isNaN(insertId)) {
        throw new Error("No se pudo obtener el ID del proceso creado.");
      }

      return {
        ...proceso,
        id: insertId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as ProcesoModel;
    } catch (error) {
      console.error("Error creando proceso:", error);
      throw error;
    }
  }

  /**
   * Actualizar un proceso existente
   */
  static async update(
    id: number,
    proceso: Partial<Omit<ProcesoModel, "id" | "created_at" | "updated_at">>
  ): Promise<ProcesoModel | null> {
    try {
      const existingProceso = await this.getById(id);
      if (!existingProceso) return null;

      const query = `
                UPDATE procesos SET
                    titulo = ?, codigo = ?, version = ?, estado = ?, objetivo = ?, 
                    alcance = ?, descripcion_detallada = ?, esquema_url = ?, 
                    entradas = ?, salidas = ?, indicadores_relacionados = ?
                WHERE id = ?
            `;
      const params = [
        proceso.titulo ?? existingProceso.titulo,
        proceso.codigo ?? existingProceso.codigo,
        proceso.version ?? existingProceso.version,
        proceso.estado ?? existingProceso.estado,
        proceso.objetivo ?? existingProceso.objetivo,
        proceso.alcance ?? existingProceso.alcance,
        proceso.descripcion_detallada ?? existingProceso.descripcion_detallada,
        proceso.esquema_url ?? existingProceso.esquema_url,
        proceso.entradas ?? existingProceso.entradas,
        proceso.salidas ?? existingProceso.salidas,
        proceso.indicadores_relacionados ??
          existingProceso.indicadores_relacionados,
        id,
      ];

      await db.execute(query, params);
      return await this.getById(id);
    } catch (error) {
      console.error("Error actualizando proceso:", error);
      throw error;
    }
  }

  /**
   * Eliminar un proceso por ID
   */
  static async delete(id: number): Promise<boolean> {
    try {
      const result = await db.execute("DELETE FROM procesos WHERE id = ?", [
        id,
      ]);
      return result.rowsAffected > 0; 
    } catch (error) {
      console.error("Error eliminando proceso:", error);
      throw error;
    }
  }

  /**
   * Mapea una fila de la base de datos a un ProcesoModel
   */
  private static mapRowToModel(row: any): ProcesoModel {
    return {
      id: row.id ?? null,
      titulo: row.titulo,
      codigo: row.codigo,
      version: row.version,
      estado: row.estado,
      objetivo: row.objetivo,
      alcance: row.alcance,
      descripcion_detallada: row.descripcion_detallada,
      esquema_url: row.esquema_url,
      entradas: row.entradas,
      salidas: row.salidas,
      indicadores_relacionados: row.indicadores_relacionados,
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    };
  }
}
