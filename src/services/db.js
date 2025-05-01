// Este archivo no debe usarse en el frontend. Exportamos un objeto vacío para evitar errores.
import { createClient } from "@libsql/client";
import { databaseConfig } from "../config/database.js";

let turso = null;
let lastConnectionAttempt = null;
const RECONNECT_INTERVAL = 5000; // 5 segundos

async function initializeConnection() {
  try {
    console.log("🔄 Iniciando conexión a la base de datos...");
    turso = createClient(databaseConfig);
    await turso.execute("SELECT 1");
    console.log("✅ Conexión a la base de datos establecida");
    lastConnectionAttempt = Date.now();
    return turso;
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    throw error;
  }
}

// Función para verificar y mantener la conexión
async function ensureConnection() {
  if (!turso || Date.now() - lastConnectionAttempt > RECONNECT_INTERVAL) {
    try {
      await initializeConnection();
    } catch (error) {
      console.error("Error crítico en la conexión a la base de datos:", {
        error: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack,
      });

      // Reintentar conexión con backoff exponencial
      setTimeout(async () => {
        console.log("Reintentando conexión a la base de datos...");
        await ensureConnection();
      }, RECONNECT_INTERVAL * 2);

      throw error;
    }
  }
  return turso;
}

// Inicializar la conexión
initializeConnection().catch(console.error);

// Exportar una función wrapper para todas las operaciones de base de datos
export async function executeQuery(sql, args = []) {
  const db = await ensureConnection();
  try {
    const result = await db.execute({ sql, args });
    return result;
  } catch (error) {
    console.error("Error ejecutando consulta:", {
      sql,
      args,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

export default {
  execute: executeQuery,
  ensureConnection,
};
