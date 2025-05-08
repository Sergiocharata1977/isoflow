import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import { MedicionModel } from "@/models/medicion-model";
import MedicionModal from "./MedicionModal";

function MedicionesListing(): JSX.Element {
  const [mediciones, setMediciones] = useState<MedicionModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMedicion, setSelectedMedicion] = useState<MedicionModel | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setMediciones([]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSave = async (medicionData: MedicionModel) => {
    try {
      if (selectedMedicion) {
        // const updatedIndicador = await IndicadoresService.update(medicionData.id!, medicionData);
        // const updatedIndicadors = mediciones.map(a =>
        //   a.id === selectedMedicion.id ? updatedIndicador : a
        // );
        // setMediciones(updatedIndicadors);
        // toast({
        //   title: "Indicador actualizado",
        //   description: "Los datos del indicador han sido actualizados exitosamente",
        // });
      } else {
        // const createdIndicadores = await IndicadoresService.create(medicionData);
        // setMediciones([createdIndicadores, ...mediciones]);
        // toast({
        //   title: "Indicador creado",
        //   description: "Se ha agregado un nuevo indicador exitosamente",
        // });
      }
      setIsModalOpen(false);
      setSelectedMedicion(null);
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "No se pudo guardar el indicador",
      //   variant: "destructive",
      // });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mediciones</h2>
        <Button onClick={() => { setIsModalOpen(true), setSelectedMedicion(null) }}>+ Nueva Medición</Button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar mediciones..."
          className="border rounded px-3 py-2 w-full max-w-sm"
        />
      </div>
      {isLoading ? (
        <div className="text-center">Cargando mediciones...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {mediciones.map((med) => (
            <div
              key={med.id}
              className="border rounded-lg p-6 bg-white shadow flex flex-col justify-between"
            >
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <LineChart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{med.titulo}</h3>
                  <div className="text-xs text-gray-500">{med.created_at}</div>
                </div>
              </div>
              {/* <p className="text-gray-600 mb-2">
                <strong>Valor:</strong> {med.valor}
              </p> */}
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                <span>
                  <strong>Observaciones:</strong> {med.comentarios}
                </span>
              </div>
              {/* <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs capitalize">
                {med.estado}
              </span> */}
            </div>
          ))}
        </div>
      )}

      <MedicionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMedicion(null);
        }}
        onSave={handleSave}
        medicion={selectedMedicion}
      />

    </div>
  );
}

export default MedicionesListing;
