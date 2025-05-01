import initializeDatabase from "../src/services/initDb.js";

console.log("🚀 Iniciando configuración de la base de datos...");

initializeDatabase()
  .then(() => {
    console.log("✅ Base de datos configurada exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error configurando la base de datos:", error);
    process.exit(1);
  });
