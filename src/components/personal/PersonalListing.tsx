import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagination } from "@/hooks/use-pagination";
import { PersonalService } from "@/services/personal-service";
import { PersonalToolbar } from "./PersonalToolbar";
import { PersonalGridView } from "./PersonalGridView";
import { PersonalListView } from "./PersonalListView";
import { PaginationControls } from "./PaginationControls";
import PersonalModal from "./PersonalModal";
import PersonalSingle from "./PersonalSingle";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "../ui/skeleton";
import { User } from "@/types/user";

function PersonalListing() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersData = await PersonalService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de usuarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.position?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [users, debouncedSearchTerm]);

  const {
    paginatedData: paginatedUsers,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(filteredUsers, viewMode === "grid" ? 12 : 10);

  const handleSave = async (userData: Omit<User, 'id' | 'formacionAcademica' | 'experienciaLaboral'>) => {
    setIsLoading(true);
    try {
      await loadUsers();
      toast({
        title: "Operación exitosa",
        description: selectedUser ? "Usuario actualizado" : "Usuario creado",
      });
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar los datos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const userToDelete = users.find((u) => u.id === id);
    setUserToDelete(userToDelete ?? null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await PersonalService.deletePersonal(userToDelete.id);
      await loadUsers();
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });

      if (showSingle) {
        setShowSingle(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleViewUser = (user: User) => {
    setCurrentUser(user);
    setShowSingle(true);
  };

  const handleExport = () => {
    // Implementar lógica de exportación
  };

  if (showSingle && currentUser) {
    return (
      <PersonalSingle
        persona={currentUser}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  // Componente de carga para la vista de grid
  const GridLoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[180px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-3" />
          </div>
        </div>
      ))}
    </div>
  );

  // Componente de carga para la vista de lista
  const ListLoadingSkeleton = () => (
    <div className="overflow-hidden border rounded-lg bg-card border-border">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="p-4 border-b border-border">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PersonalToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExport={handleExport}
        onAddNew={() => setIsModalOpen(true)}
      />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isLoading ? (
          viewMode === "grid" ? (
            <GridLoadingSkeleton />
          ) : (
            <ListLoadingSkeleton />
          )
        ) : (
          <>
            {viewMode === "grid" ? (
              <PersonalGridView
                users={paginatedUsers}
                onView={handleViewUser}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <PersonalListView
                users={paginatedUsers}
                onView={handleViewUser}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={previousPage}
                onNext={nextPage}
                hasPrevious={hasPreviousPage}
                hasNext={hasNextPage}
              />
            )}
          </>
        )}
      </motion.div>

      <PersonalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSave}
        user={selectedUser}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              usuario {userToDelete?.full_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PersonalListing;