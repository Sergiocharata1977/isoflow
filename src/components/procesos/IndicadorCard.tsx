import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart2, Pencil, Trash2 } from "lucide-react";
import { IndicadorModel } from "@/models/indicador-model";

export interface IndicadorCardProps {
    indicador: IndicadorModel;
    onView: (indicador: IndicadorModel) => void;
    onEdit: (indicador: IndicadorModel) => void;
    onDelete: (id: number) => void;
}

const IndicadorCard: React.FC<IndicadorCardProps> = React.memo(
    ({ indicador, onView, onEdit, onDelete }) => {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => onView(indicador)}
            >
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <BarChart2 className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold truncate">{indicador.titulo}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {indicador.descripcion}
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                            {indicador.unidad_medida}
                        </span>
                        <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(indicador);
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(indicador.id!);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }
);

export default IndicadorCard;
