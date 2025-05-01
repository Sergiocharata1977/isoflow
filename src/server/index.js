import express from "express";
import cors from "cors";
import usuariosRouter from "./routes/usuarios.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging de peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use("/api/usuarios", usuariosRouter);

// Endpoint de salud
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(`Error en ${req.method} ${req.url}:`, err);
  res.status(500).json({
    error: "Algo salió mal en el servidor",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   - GET /health`);
  console.log(`   - GET /api/usuarios/test-connection`);
  console.log(`   - GET /api/usuarios`);
  console.log(`   - POST /api/usuarios`);
  console.log(`   - PUT /api/usuarios/:id`);
  console.log(`   - DELETE /api/usuarios/:id`);
});
