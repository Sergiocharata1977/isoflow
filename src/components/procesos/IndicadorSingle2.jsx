import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function IndicadorSingle2({ indicador, onBack, onEdit }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Detalle del Indicador</h1>
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
          <CardTitle className="text-xl">{indicador.nombre}</CardTitle>
          <CardDescription>
            <span className="font-medium">ID:</span> {indicador.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h3>
            <p>{indicador.descripcion}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Fórmula</h3>
              <p>{indicador.formula}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Frecuencia</h3>
              <p>{indicador.frecuencia}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Meta</h3>
              <p>{indicador.meta || "No definida"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Unidad de Medida</h3>
              <p>{indicador.unidadMedida || "No definida"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Estado</h3>
            <Badge variant={indicador.estado === "Activo" ? "success" : "default"}>
              {indicador.estado || "No definido"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default IndicadorSingle2;
