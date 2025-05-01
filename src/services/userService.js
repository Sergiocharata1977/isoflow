import turso from "./db.js";
import bcrypt from "bcryptjs";

export async function authenticateUser(email, password) {
  try {
    console.log("Iniciando autenticación para:", email);

    const result = await turso.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });

    console.log(
      "Resultado de búsqueda:",
      result.rows.length > 0 ? "Usuario encontrado" : "Usuario no encontrado"
    );

    if (result.rows.length === 0) {
      console.error("Usuario no encontrado:", email);
      throw new Error("Usuario o contraseña incorrectos");
    }

    const user = result.rows[0];
    console.log("Verificando contraseña para usuario:", user.email);

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(
      "Resultado de verificación de contraseña:",
      isValidPassword ? "Válida" : "Inválida"
    );

    if (!isValidPassword) {
      console.error("Contraseña inválida para usuario:", email);
      throw new Error("Usuario o contraseña incorrectos");
    }

    // Actualizar último login
    await turso.execute({
      sql: "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
      args: [user.id],
    });

    // No enviar la contraseña al frontend
    const { password: _, ...userWithoutPassword } = user;

    console.log("Autenticación exitosa para:", email);
    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error("Error en autenticación:", error);
    throw error;
  }
}

export async function createUser({
  email,
  password,
  fullName,
  role = "user",
  department,
  position,
}) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await turso.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });

    if (existingUser.rows.length > 0) {
      throw new Error("El usuario ya existe");
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    await turso.execute({
      sql: `
        INSERT INTO users (
          id, email, password, full_name, role,
          department, position
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        "user-" + Date.now(),
        email,
        hashedPassword,
        fullName,
        role,
        department,
        position,
      ],
    });

    return {
      success: true,
      message: "Usuario creado correctamente",
    };
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error;
  }
}

export async function updateUser(id, updates) {
  try {
    const updateFields = [];
    const updateValues = [];

    // Construir la consulta dinámicamente basada en los campos a actualizar
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    // Añadir el ID al final de los valores
    updateValues.push(id);

    const sql = `
      UPDATE users 
      SET ${updateFields.join(", ")}, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    await turso.execute({
      sql,
      args: updateValues,
    });

    return {
      success: true,
      message: "Usuario actualizado correctamente",
    };
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const result = await turso.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const user = result.rows[0];
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    throw error;
  }
}

export async function listUsers(params = {}) {
  try {
    let sql = "SELECT * FROM users";
    const conditions = [];
    const args = [];

    // Filtrar por rol si se especifica
    if (params.role) {
      conditions.push("role = ?");
      args.push(params.role);
    }

    // Filtrar por departamento si se especifica
    if (params.department) {
      conditions.push("department = ?");
      args.push(params.department);
    }

    // Añadir condiciones a la consulta
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    // Ordenar por fecha de creación por defecto
    sql += " ORDER BY created_at DESC";

    const result = await turso.execute({ sql, args });

    // Remover contraseñas antes de enviar los datos
    const users = result.rows.map((user) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error("Error listando usuarios:", error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    await turso.execute({
      sql: "DELETE FROM users WHERE id = ?",
      args: [id],
    });

    return {
      success: true,
      message: "Usuario eliminado correctamente",
    };
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    const {
      email,
      password,
      full_name,
      role = "user",
      department,
      position,
    } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await turso.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [email],
    });

    if (existingUser.rows.length > 0) {
      throw new Error("El email ya está registrado");
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const result = await turso.execute({
      sql: `
        INSERT INTO users (
          id, email, password, full_name, role,
          department, position
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        "user-" + Date.now(),
        email,
        hashedPassword,
        full_name,
        role,
        department || "Sin asignar",
        position || "Sin asignar",
      ],
    });

    return {
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        id: result.lastInsertRowid,
        email,
        full_name,
        role,
        department,
        position,
      },
    };
  } catch (error) {
    console.error("Error registrando usuario:", error);
    throw error;
  }
}
