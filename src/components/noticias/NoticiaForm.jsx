import { useState, useEffect } from "react";
import { SafeMotion } from "@/components/common/SafeMotion";

export default function NoticiaForm({ noticia, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    autor: "",
    imagen: "",
  });

  useEffect(() => {
    if (noticia) {
      setFormData({
        titulo: noticia.titulo || "",
        contenido: noticia.contenido || "",
        autor: noticia.autor || "",
        imagen: noticia.imagen || "",
      });
    }
  }, [noticia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: noticia?.id,
      fecha: noticia?.fecha || new Date().toISOString(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <SafeMotion className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {noticia ? "Editar Noticia" : "Nueva Noticia"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Autor
          </label>
          <input
            type="text"
            name="autor"
            value={formData.autor}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de la imagen
          </label>
          <input
            type="url"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenido
          </label>
          <textarea
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {noticia ? "Guardar Cambios" : "Crear Noticia"}
          </button>
        </div>
      </form>
    </SafeMotion>
  );
}
