import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { User } from "@/types/user";

interface PersonalCardProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export const PersonalCard: React.FC<PersonalCardProps> = React.memo(
  ({ user, onView, onEdit, onDelete }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="overflow-hidden transition-colors border rounded-lg cursor-pointer bg-card border-border hover:border-primary"
      onClick={() => onView(user)}
    >
      <div className="relative aspect-square">
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
      <div className="p-4">
        <h3 className="font-semibold">{user.full_name}</h3>
        <p className="text-sm text-muted-foreground">{user.position}</p>
        <p className="text-sm text-muted-foreground">{user.department}</p>
        <div className="flex justify-end mt-4 space-x-2">
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
        </div>
      </div>
    </motion.div>
  )
);

PersonalCard.displayName = "PersonalCard";