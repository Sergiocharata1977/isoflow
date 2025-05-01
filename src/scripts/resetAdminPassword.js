import { createClient } from "@libsql/client";
import { databaseConfig } from "../config/database.js";
import bcrypt from "bcryptjs";

const turso = createClient(databaseConfig);

async function resetAdminPassword() {
  try {
    console.log("Restableciendo contraseña del administrador...");

    // Nueva contraseña: admin123
    const newPassword = "admin123";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await turso.execute({
      sql: "UPDATE users SET password = ? WHERE email = ?",
      args: [hashedPassword, "admin@isoflow.com"],
    });

    console.log("✅ Contraseña restablecida exitosamente");
    console.log("\nCredenciales de acceso:");
    console.log("Email: admin@isoflow.com");
    console.log("Contraseña: admin123");
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
  }
}

// Ejecutar el script
resetAdminPassword();
