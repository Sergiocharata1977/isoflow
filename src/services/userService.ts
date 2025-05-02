import db from "./db";
import bcrypt from "bcryptjs";

// Mock de usuarios para desarrollo
const mockUsers = [
  {
    id: "admin-1",
    email: "admin@isoflow.com",
    password: "admin123",
    full_name: "Administrador del Sistema",
    role: "admin",
    department: "Administración",
    position: "Administrador",
    is_active: true,
    can_approve_documents: true,
    can_create_processes: true,
    can_edit_indicators: true,
  },
];

interface User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
  department: string;
  position: string;
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
    const existingUser = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.rows.length > 0) {
      throw new Error("El usuario ya existe");
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

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
        email,
        hashedPassword,
        fullName,
        role,
        department,
        position,
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

export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; user: Omit<User, "password"> }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const result = await db.query<User>("SELECT * FROM users WHERE email = ?", [email]);
  const user = result[0];

  if (!user) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    user: userWithoutPassword,
  };
}

export async function updateUser(id, updates) {
  throw new Error("Función no implementada en modo desarrollo");
}

export async function getUserById(id) {
  throw new Error("Función no implementada en modo desarrollo");
}

export async function listUsers(params) {
  throw new Error("Función no implementada en modo desarrollo");
}
