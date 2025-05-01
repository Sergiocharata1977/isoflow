export const productionConfig = {
  api: {
    baseUrl: "https://tu-dominio.com/api", // Actualizar con tu dominio de producción
    timeout: 30000,
  },
  database: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  server: {
    port: process.env.PORT || 3001,
    cors: {
      origin: ["https://tu-dominio.com"], // Actualizar con tu dominio de producción
      credentials: true,
    },
  },
  security: {
    bcryptSaltRounds: 12,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: "24h",
  },
  logging: {
    level: "error",
    format: "json",
  },
}; 