import turso from "./db.js";

async function initializeDatabase() {
  try {
    // Crear tabla de usuarios si no existe
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT,
        position TEXT,
        is_active BOOLEAN DEFAULT true,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        password_reset_token TEXT,
        password_reset_expires DATETIME,
        profile_image TEXT,
        phone TEXT,
        emergency_contact TEXT,
        iso_training_level TEXT,
        iso_certifications TEXT,
        can_approve_documents BOOLEAN DEFAULT false,
        can_create_processes BOOLEAN DEFAULT false,
        can_edit_indicators BOOLEAN DEFAULT false,
        notes TEXT
      )
    `);

    console.log("✅ Base de datos inicializada correctamente");

    // Crear usuario admin por defecto si no existe
    const adminExists = await turso.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: ["admin@isoflow.com"],
    });

    if (adminExists.rows.length === 0) {
      await turso.execute({
        sql: `
          INSERT INTO users (
            id, email, password, full_name, role,
            can_approve_documents, can_create_processes, can_edit_indicators
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          "admin-" + Date.now(),
          "admin@isoflow.com",
          "admin123", // Cambiar en producción
          "Administrador del Sistema",
          "admin",
          true,
          true,
          true,
        ],
      });
      console.log("👤 Usuario administrador creado");
    }
  } catch (error) {
    console.error("❌ Error inicializando la base de datos:", error);
    throw error;
  }
}

// Exportar la función para uso manual (no ejecutar automáticamente en frontend)
export default initializeDatabase;
