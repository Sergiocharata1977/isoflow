import { SafeMotion } from "@/components/common/SafeMotion";
import { formatDate } from "@/utils/dates";

export default function NoticiaDetalle({ noticia, onBack, onEdit, onDelete }) {
  return (
    <SafeMotion className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-start mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Volver
        </button>
        <div className="space-x-2">
          <button
            onClick={() => onEdit(noticia)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(noticia.id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      <article className="prose lg:prose-xl max-w-none">
        <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>

        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">Por {noticia.autor}</span>
          <span>{formatDate(noticia.fecha)}</span>
        </div>

        {noticia.imagen && (
          <img
            src={noticia.imagen}
            alt={noticia.titulo}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="whitespace-pre-wrap">{noticia.contenido}</div>
      </article>
    </SafeMotion>
  );
}
