import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Target, Search, Edit } from "lucide-react";
import ObjetivoModal from "./ObjetivoModal";

const objetivosEjemplo = [
  {
    id: 1,
    titulo: "Aumentar la satisfacción del cliente",
    codigo: "OBJ-001",
    descripcion: "Mejorar la atención y los tiempos de respuesta.",
    responsable: "Juan Pérez",
    procesos: "Atención al Cliente",
    estado: "activo",
  },
  {
    id: 2,
    titulo: "Reducir costos operativos",
    codigo: "OBJ-002",
    descripcion: "Optimizar el uso de recursos en producción.",
    responsable: "María García",
    procesos: "Producción",
    estado: "activo",
  },
];

function ObjetivosListing2() {
  const [objetivos, setObjetivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentObjetivo, setCurrentObjetivo] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setObjetivos(objetivosEjemplo);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredObjetivos = objetivos.filter(
    (obj) =>
      obj.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.procesos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewObjetivo = () => {
    setCurrentObjetivo(null);
    setModalOpen(true);
  };

  const handleEditObjetivo = (objetivo) => {
    setCurrentObjetivo(objetivo);
    setModalOpen(true);
  };

  const handleSaveObjetivo = (objetivoData) => {
    if (currentObjetivo) {
      // Editar objetivo existente
      setObjetivos(
        objetivos.map((obj) =>
          obj.id === currentObjetivo.id ? { ...obj, ...objetivoData } : obj
        )
      );
    } else {
      // Crear nuevo objetivo
      const newObjetivo = {
        ...objetivoData,
        id: Date.now(),
        estado: "activo",
      };
      setObjetivos([...objetivos, newObjetivo]);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Objetivos de Calidad</h2>
        <Button onClick={handleNewObjetivo}>+ Nuevo Objetivo</Button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-8 p-2 border rounded"
            placeholder="Buscar objetivo..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredObjetivos.map((obj) => (
              <div
                key={obj.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{obj.titulo}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {obj.descripcion}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm">
                          <b>Código:</b> {obj.codigo}
                        </p>
                        <p className="text-sm">
                          <b>Responsable:</b> {obj.responsable}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">
                          <b>Procesos:</b> {obj.procesos}
                        </p>
                        <p className="text-sm">
                          <b>Estado:</b> {obj.estado}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditObjetivo(obj)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredObjetivos.length === 0 && (
              <p className="text-center text-muted-foreground">
                No se encontraron objetivos
              </p>
            )}
          </div>
        )}
      </div>

      <ObjetivoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveObjetivo}
        objetivo={currentObjetivo}
      />
    </div>
  );
}

export default ObjetivosListing2;
