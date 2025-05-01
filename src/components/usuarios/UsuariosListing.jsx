import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UsuarioForm from "./UsuarioForm";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "@/services/usuarios";

function UsuariosListing() {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await createUsuario(userData);
      setShowForm(false);
      loadUsuarios(); // Recargar la lista después de crear
      toast({
        title: "Éxito",
        description: "Usuario creado correctamente",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      await updateUsuario(userData.id, userData);
      setEditingUser(null);
      loadUsuarios(); // Recargar la lista después de actualizar
      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("¿Está seguro de eliminar este usuario?")) return;

    try {
      await deleteUsuario(userId);
      loadUsuarios(); // Recargar la lista después de eliminar
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "supervisor":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <>
      <Dialog
        open={showForm || editingUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingUser(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <UsuarioForm
              user={editingUser}
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              onCancel={() => {
                setShowForm(false);
                setEditingUser(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.full_name}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(usuario.role)}>
                      {usuario.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{usuario.department}</TableCell>
                  <TableCell>{usuario.position}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingUser(usuario)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(usuario.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {usuarios.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              )}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Cargando usuarios...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </>
  );
}

export default UsuariosListing;
