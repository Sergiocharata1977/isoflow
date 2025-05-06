import { motion } from "framer-motion";
import { PersonalCard } from "./PersonalCard";
import { User } from "@/types/user";

interface PersonalGridViewProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export function PersonalGridView({ users, onView, onEdit, onDelete }: PersonalGridViewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {users.map((user) => (
        <PersonalCard
          key={user.id}
          user={user}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}