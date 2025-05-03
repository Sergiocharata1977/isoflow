import db from "./db";
import bcrypt from "bcryptjs";

interface User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
  department: string;
  position: string;
}

export async function createUser(data: User) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [data.email],
    );

    if (existingUser.rows.length > 0) {
      throw new Error("El usuario ya existe");
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear el usuario
    const result = await db.execute(
      `
        INSERT INTO users (
          id, email, password, full_name, role,
          department, position
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        "user-" + Date.now(),
        data.email,
        hashedPassword,
        data.full_name,
        data.role,
        data.department,
        data.position,
      ]
    );

    return {
      success: true,
      message: "Usuario creado correctamente",
    };
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error;
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; user: Omit<User, "password">; access_token: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const result: User[] = await db.query<User>("SELECT * FROM users WHERE email = ?", [email]);

  const user: User = result[0];

  if (!user) {
    throw new Error("El usuario no se encuentra registrado en el sistema");
  }

  const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const { password: _, ...userWithoutPassword } = user;

  const token = `fake-token-${user.id}-${Date.now()}`;

  return {
    success: true,
    user: userWithoutPassword,
    access_token: token
  };
}

export async function updatePassword(email: string, newPassword: string): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await db.execute("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

    if (result && result.rowsAffected > 0) {
      console.log("Contraseña actualizada correctamente.");
    } else {
      throw new Error("No se encontró el usuario con ese correo electrónico.");
    }
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    throw error;
  }
}

export async function updateUser(id: string | number, updates: any) {
  throw new Error("Función no implementada en modo desarrollo");
}

export async function getUserById(id: string | number) {
  throw new Error("Función no implementada en modo desarrollo");
}

export async function listUsers(params: any) {
  throw new Error("Función no implementada en modo desarrollo");
}
