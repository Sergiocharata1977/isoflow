import express from "express";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../api/usuarios.js";
import turso from "../../services/db.js";

const router = express.Router();

// Endpoint de prueba de conexión a la base de datos
router.get("/test-connection", async (req, res) => {
  try {
    await turso.execute("SELECT 1");
    res.json({
      status: "success",
      message: "Conexión a la base de datos exitosa",
    });
  } catch (error) {
    console.error("Error en test-connection:", error);
    res.status(500).json({
      status: "error",
      message: "Error al conectar con la base de datos",
      details: error.message,
    });
  }
});

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Error en GET /api/usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  console.log("Recibida petición POST /api/usuarios:", req.body);
  try {
    const nuevoUsuario = await createUsuario(req.body);
    console.log("Usuario creado exitosamente:", nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error en POST /api/usuarios:", error);
    res.status(500).json({
      error: error.message || "Error al crear usuario",
      details: error.stack,
    });
  }
});

// Actualizar un usuario
router.put("/:id", async (req, res) => {
  try {
    const usuarioActualizado = await updateUsuario(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error en PUT /api/usuarios/:id:", error);
    res
      .status(500)
      .json({ error: error.message || "Error al actualizar usuario" });
  }
});

// Eliminar un usuario
router.delete("/:id", async (req, res) => {
  try {
    await deleteUsuario(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error en DELETE /api/usuarios/:id:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

export default router;
