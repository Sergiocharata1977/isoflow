// Servicio simulado para indicadores
const indicadoresEjemplo = [
  {
    id: 1,
    nombre: "Tasa de Reclamos",
    descripcion: "Cantidad de reclamos por mes.",
    formula: "Reclamos/Total Ventas",
    frecuencia: "Mensual",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Eficiencia Productiva",
    descripcion: "Porcentaje de productos sin defectos.",
    formula: "(Productos OK/Total Producidos)*100",
    frecuencia: "Mensual",
    estado: "Activo",
  },
];

let indicadores = [...indicadoresEjemplo];

export const indicadoresService = {
  getAll: async () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve([...indicadores]), 300)
    );
  },
  create: async (data) => {
    const nuevo = { ...data, id: Date.now() };
    indicadores.push(nuevo);
    return new Promise((resolve) => setTimeout(() => resolve(nuevo), 300));
  },
  update: async (id, data) => {
    indicadores = indicadores.map((obj) =>
      obj.id === id ? { ...obj, ...data } : obj
    );
    return new Promise((resolve) =>
      setTimeout(() => resolve(indicadores.find((obj) => obj.id === id)), 300)
    );
  },
  delete: async (id) => {
    indicadores = indicadores.filter((obj) => obj.id !== id);
    return new Promise((resolve) => setTimeout(() => resolve(true), 300));
  },
};
