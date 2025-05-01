import { createClient } from "@libsql/client";
import { databaseConfig } from "../config/database.js";

const turso = createClient(databaseConfig);

async function checkAdminUser() {
  try {
    console.log("Verificando usuario administrador...");

    const result = await turso.execute({
      sql: "SELECT id, email, full_name, role FROM users WHERE email = ?",
      args: ["admin@isoflow.com"],
    });

    if (result.rows.length === 0) {
      console.log(
        "❌ El usuario admin@isoflow.com no existe en la base de datos"
      );
    } else {
      console.log("✅ Usuario encontrado:");
      console.log(result.rows[0]);
    }
  } catch (error) {
    console.error("Error al verificar usuario:", error);
  }
}

checkAdminUser();
