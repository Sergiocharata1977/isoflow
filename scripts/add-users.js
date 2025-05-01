import { createUser } from "../src/services/userService.js";

async function addTestUsers() {
  try {
    console.log("🚀 Creando usuarios de prueba...");

    // Usuario 1 - Supervisor de Calidad
    await createUser({
      email: "supervisor@isoflow.com",
      password: "calidad123",
      fullName: "Juan Pérez",
      role: "supervisor",
      department: "Calidad",
      position: "Supervisor de Calidad",
    });
    console.log("✅ Usuario supervisor creado");

    // Usuario 2 - Auditor
    await createUser({
      email: "auditor@isoflow.com",
      password: "audit123",
      fullName: "María García",
      role: "auditor",
      department: "Auditoría",
      position: "Auditor Interno",
    });
    console.log("✅ Usuario auditor creado");

    console.log("\n📝 Credenciales de acceso:");
    console.log("\nSupervisor de Calidad:");
    console.log("Email: supervisor@isoflow.com");
    console.log("Contraseña: calidad123");
    console.log("\nAuditor:");
    console.log("Email: auditor@isoflow.com");
    console.log("Contraseña: audit123");
  } catch (error) {
    console.error("❌ Error creando usuarios:", error.message);
  }
}

addTestUsers();
