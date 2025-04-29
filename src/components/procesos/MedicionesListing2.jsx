import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";

const medicionesEjemplo = [
  {
    id: 1,
    indicador: "Tasa de Reclamos",
    fecha: "2024-06-01",
    valor: 5,
    observaciones: "Dentro del rango esperado",
    estado: "activo"
  },
  {
    id: 2,
    indicador: "Eficiencia Productiva",
    fecha: "2024-06-01",
    valor: 98,
    observaciones: "Mejor que el mes anterior",
    estado: "activo"
  }
];

function MedicionesListing2() {
  const [mediciones, setMediciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setMediciones(medicionesEjemplo);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mediciones</h2>
        <Button>+ Nueva Medición</Button>
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
          {mediciones.map(med => (
            <div
              key={med.id}
              className="border rounded-lg p-6 bg-white shadow flex flex-col justify-between"
            >
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <LineChart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{med.indicador}</h3>
                  <div className="text-xs text-gray-500">{med.fecha}</div>
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                <strong>Valor:</strong> {med.valor}
              </p>
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                <span>
                  <strong>Observaciones:</strong> {med.observaciones}
                </span>
              </div>
              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs capitalize">
                {med.estado}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicionesListing2;