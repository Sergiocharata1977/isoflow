import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  User,
  Share2,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  Tag,
  Printer,
  Download,
} from "lucide-react";

function NoticiaSingle({ noticia, onBack, onEdit, onDelete }) {
  return (
    <div className="flex gap-8">
      {/* Contenido Principal (60%) */}
      <div className="flex-[0.6]">
        {/* Header con navegación y acciones */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border mb-6 py-4"
        >
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Noticias
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(noticia)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete(noticia.id);
                  onBack();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Contenido principal */}
        <div className="space-y-8">
          {/* Cabecera de la noticia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold leading-tight">
              {noticia.titulo}
            </h1>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(noticia.fecha_publicacion).toLocaleDateString(
                  "es-ES",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {noticia.autor || "Anónimo"}
              </span>
            </div>
          </motion.div>

          {/* Imagen destacada */}
          {noticia.imagen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative aspect-video rounded-lg overflow-hidden"
            >
              <img
                src={noticia.imagen}
                alt={noticia.titulo}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Contenido de la noticia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <p className="whitespace-pre-line leading-relaxed">
              {noticia.contenido}
            </p>
          </motion.div>

          {/* Barra de acciones principales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-t border-border pt-6"
          >
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Me gusta
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comentar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Columna Lateral (35%) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-[0.35] space-y-6"
      >
        {/* Panel de Estadísticas */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Estadísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>238 vistas</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>5 min lectura</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>12 comentarios</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              <span>45 me gusta</span>
            </div>
          </div>
        </div>

        {/* Panel de Etiquetas */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Tag className="h-3 w-3 mr-2" />
              ISO 9001
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Tag className="h-3 w-3 mr-2" />
              Calidad
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Tag className="h-3 w-3 mr-2" />
              Noticias
            </Button>
          </div>
        </div>

        {/* Panel de Acciones */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Acciones</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Bookmark className="h-4 w-4 mr-2" />
              Guardar para más tarde
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir noticia
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default NoticiaSingle;
