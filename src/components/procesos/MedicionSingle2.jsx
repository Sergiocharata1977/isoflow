import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function MedicionSingle2({ medicion, onBack, onEdit }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LineChart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Detalle de la Medición</h1>
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
          <CardTitle className="text-xl">{medicion.indicador || "Medición"}</CardTitle>
          <CardDescription>
            <span className="font-medium">ID:</span> {medicion.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha</h3>
              <p>{medicion.fecha ? format(new Date(medicion.fecha), 'PPP', { locale: es }) : "No definida"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Valor</h3>
              <p>{medicion.valor || "0"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Observaciones</h3>
            <p>{medicion.observaciones || "Sin observaciones"}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Responsable</h3>
              <p>{medicion.responsable || "No definido"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Estado</h3>
              <Badge variant={medicion.estado === "Completada" ? "success" : "default"}>
                {medicion.estado || "Pendiente"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MedicionSingle2;
