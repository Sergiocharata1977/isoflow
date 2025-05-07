import { motion } from "framer-motion";
import { ChevronRight, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

interface PersonalListViewProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export function PersonalListView({ users, onView, onEdit, onDelete }: PersonalListViewProps) {
  return (
    <div className="overflow-hidden border rounded-lg bg-card border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="p-4 text-left">Foto</th>
            <th className="p-4 text-left">Nombre</th>
            <th className="hidden p-4 text-left md:table-cell">Puesto</th>
            <th className="hidden p-4 text-left lg:table-cell">Departamento</th>
            <th className="hidden p-4 text-left xl:table-cell">Email</th>
            <th className="hidden p-4 text-left xl:table-cell">Teléfono</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-b cursor-pointer border-border hover:bg-accent/50"
              onClick={() => onView(user)}
            >
              <td className="p-4">
                <div className="w-10 h-10 overflow-hidden rounded-full">
                  <img
                    className="object-cover w-full h-full"
                    alt={`Foto de ${user.full_name}`}
                    src={
                      user.profile_image ||
                      "https://images.unsplash.com/photo-1578390432942-d323db577792"
                    }
                    loading="lazy"
                  />
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <span>{user.full_name}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </td>
              <td className="hidden p-4 md:table-cell">{user.position}</td>
              <td className="hidden p-4 lg:table-cell">{user.department}</td>
              <td className="hidden p-4 xl:table-cell">{user.email}</td>
              <td className="hidden p-4 xl:table-cell">{user.phone}</td>
              <td className="p-4 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(user.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="py-12 text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            No hay usuarios registrados. Haz clic en "Nuevo Usuario" para comenzar.
          </p>
        </div>
      )}
    </div>
  );
}