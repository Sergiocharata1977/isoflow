import turso from "./db.js";
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

export async function authenticateUser(email, password) {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
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
