import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";

const indicadoresEjemplo = [
  {
    id: 1,
    nombre: "Tasa de Reclamos",
    codigo: "IND-001",
    descripcion: "Cantidad de reclamos por mes.",
    formula: "Reclamos/Total Ventas",
    frecuencia: "Mensual",
    estado: "activo"
  },
  {
    id: 2,
    nombre: "Eficiencia Productiva",
    codigo: "IND-002",
    descripcion: "Porcentaje de productos sin defectos.",
    formula: "(Productos OK/Total Producidos)*100",
    frecuencia: "Mensual",
    estado: "activo"
  }
];

function IndicadoresListing2() {
  const [indicadores, setIndicadores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIndicadores(indicadoresEjemplo);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Indicadores</h2>
        <Button>+ Nuevo Indicador</Button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar indicadores..."
          className="border rounded px-3 py-2 w-full max-w-sm"
        />
      </div>
      {isLoading ? (
        <div className="text-center">Cargando indicadores...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {indicadores.map(ind => (
            <div
              key={ind.id}
              className="border rounded-lg p-6 bg-white shadow flex flex-col justify-between"
            >
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <BarChart2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{ind.nombre}</h3>
                  <div className="text-xs text-gray-500">{ind.codigo}</div>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{ind.descripcion}</p>
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                <span>
                  <strong>Fórmula:</strong> {ind.formula}
                </span>
                <span>
                  <strong>Frecuencia:</strong> {ind.frecuencia}
                </span>
              </div>
              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs capitalize">
                {ind.estado}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IndicadoresListing2;