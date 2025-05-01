import { createClient } from "@libsql/client";
import { databaseConfig } from "../config/database.js";

const turso = createClient(databaseConfig);

async function setupDatabase() {
  try {
    console.log("Verificando estructura de la base de datos...");

    // Crear tabla users si no existe
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        department TEXT,
        position TEXT,
        is_active BOOLEAN DEFAULT true,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Verificar si existe el usuario admin
    const adminExists = await turso.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: ["admin@isoflow.com"],
    });

    if (adminExists.rows.length === 0) {
      console.log("Creando usuario administrador por defecto...");

      // Crear usuario admin por defecto
      await turso.execute({
        sql: `
          INSERT INTO users (
            id, email, password, full_name, role,
            department, position
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          "admin-" + Date.now(),
          "admin@isoflow.com",
          // Contraseña: admin123 (hasheada)
          "$2a$10$XkNlQv.8U3vX5oxYX0Kz8O6t5Qz/nX0Nm/QVqR1XxN1IXQXFvBR6q",
          "Administrador del Sistema",
          "admin",
          "Dirección",
          "Administrador",
        ],
      });

      console.log("✅ Usuario administrador creado");
    }

    console.log("✅ Estructura de la base de datos verificada correctamente");
  } catch (error) {
    console.error("Error al configurar la base de datos:", error);
    throw error;
  }
}

// Ejecutar la configuración
setupDatabase()
  .then(() => {
    console.log("🎉 Base de datos configurada exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error configurando la base de datos:", error);
    process.exit(1);
  });
