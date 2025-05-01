import { createClient } from "@libsql/client";
import { databaseConfig } from "../config/database.js";
import bcrypt from "bcryptjs";

const turso = createClient(databaseConfig);

async function createAdminUser() {
  try {
    console.log("Verificando si el usuario admin ya existe...");

    const checkResult = await turso.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: ["admin@isoflow.com"],
    });

    if (checkResult.rows.length > 0) {
      console.log("⚠️ El usuario admin ya existe. Actualizando contraseña...");

      const hashedPassword = await bcrypt.hash("admin123", 10);

      await turso.execute({
        sql: "UPDATE users SET password = ? WHERE email = ?",
        args: [hashedPassword, "admin@isoflow.com"],
      });

      console.log("✅ Contraseña actualizada correctamente");
      return;
    }

    console.log("Creando usuario administrador...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await turso.execute({
      sql: `
        INSERT INTO users (
          id, email, password, full_name, role,
          department, position
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        "user-" + Date.now(),
        "admin@isoflow.com",
        hashedPassword,
        "Administrador del Sistema",
        "admin",
        "Dirección",
        "Administrador",
      ],
    });

    console.log("✅ Usuario administrador creado exitosamente");
  } catch (error) {
    console.error("Error al crear usuario admin:", error);
  }
}

createAdminUser();
