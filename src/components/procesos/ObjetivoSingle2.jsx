import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function ObjetivoSingle2({ objetivo, onBack, onEdit }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Detalle del Objetivo</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{objetivo.titulo}</CardTitle>
          <CardDescription>
            <span className="font-medium">ID:</span> {objetivo.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h3>
            <p>{objetivo.descripcion}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Responsable</h3>
              <p>{objetivo.responsable}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Procesos</h3>
              <p>{objetivo.procesos}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Estado</h3>
            <Badge variant={objetivo.estado === "Activo" ? "success" : "default"}>
              {objetivo.estado || "No definido"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ObjetivoSingle2;
