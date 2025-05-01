import { createClient } from "@libsql/client";
import { databaseConfig } from "../../config/database.js";
import bcrypt from "bcryptjs";
import { executeQuery } from "../../services/db.js";

const turso = createClient(databaseConfig);

export async function getUsuarios() {
  try {
    const result = await executeQuery(
      "SELECT id, email, full_name, role, department, position FROM users ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (error) {
    console.error("Error obteniendo usuarios:", {
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    throw new Error("Error al obtener usuarios: " + error.message);
  }
}

export async function createUsuario(userData) {
  try {
    const { email, password, full_name, role, department, position } = userData;

    // Validaciones
    if (!email || !password || !full_name) {
      throw new Error("Faltan campos requeridos");
    }

    // Verificar si el usuario ya existe
    const existingUser = await executeQuery(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("El email ya está registrado");
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const result = await executeQuery(
      `INSERT INTO users (
        id, email, password, full_name, role,
        department, position, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        "user-" + Date.now(),
        email,
        hashedPassword,
        full_name,
        role || "user",
        department || null,
        position || null,
      ]
    );

    return {
      id: result.lastInsertRowid,
      email,
      full_name,
      role,
      department,
      position,
    };
  } catch (error) {
    console.error("Error creando usuario:", {
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

export async function updateUsuario(id, userData) {
  try {
    const { email, password, full_name, role, department, position } = userData;

    // Si se proporciona una nueva contraseña, hashearla
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Construir la consulta dinámicamente
    const updateFields = [];
    const updateValues = [];

    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }

    if (hashedPassword) {
      updateFields.push("password = ?");
      updateValues.push(hashedPassword);
    }

    if (full_name) {
      updateFields.push("full_name = ?");
      updateValues.push(full_name);
    }

    if (role) {
      updateFields.push("role = ?");
      updateValues.push(role);
    }

    if (department) {
      updateFields.push("department = ?");
      updateValues.push(department);
    }

    if (position) {
      updateFields.push("position = ?");
      updateValues.push(position);
    }

    // Añadir el ID al final de los valores
    updateValues.push(id);

    await turso.execute({
      sql: `
        UPDATE users 
        SET ${updateFields.join(", ")},
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `,
      args: updateValues,
    });

    return {
      id,
      email,
      full_name,
      role,
      department,
      position,
    };
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    throw error;
  }
}

export async function deleteUsuario(id) {
  try {
    await turso.execute({
      sql: "DELETE FROM users WHERE id = ?",
      args: [id],
    });
    return true;
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    throw error;
  }
}
