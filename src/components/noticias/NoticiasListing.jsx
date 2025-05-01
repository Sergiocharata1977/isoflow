import React from "react";
import { motion } from "framer-motion";

function NoticiasListing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tablero Central</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Bienvenida */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">
            ¡Bienvenido al Sistema!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Este es tu tablero central donde podrás ver un resumen de la
            actividad del sistema de gestión de calidad.
          </p>
        </motion.div>

        {/* Tarjeta de Estadísticas */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Estadísticas Rápidas</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Documentos Activos
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Procesos en Curso
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta de Actividades Recientes */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Actividades Recientes</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              No hay actividades recientes para mostrar.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default NoticiasListing;
