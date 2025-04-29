// Servicio simulado para mediciones
const medicionesEjemplo = [
  {
    id: 1,
    indicador: "Tasa de Reclamos",
    fecha: "2024-06-01",
    valor: 5,
    observaciones: "Dentro del rango esperado",
    estado: "Activo",
  },
  {
    id: 2,
    indicador: "Eficiencia Productiva",
    fecha: "2024-06-01",
    valor: 98,
    observaciones: "Mejor que el mes anterior",
    estado: "Activo",
  },
];

let mediciones = [...medicionesEjemplo];

export const medicionesService = {
  getAll: async () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve([...mediciones]), 300)
    );
  },
  create: async (data) => {
    const nuevo = { ...data, id: Date.now() };
    mediciones.push(nuevo);
    return new Promise((resolve) => setTimeout(() => resolve(nuevo), 300));
  },
  update: async (id, data) => {
    mediciones = mediciones.map((obj) =>
      obj.id === id ? { ...obj, ...data } : obj
    );
    return new Promise((resolve) =>
      setTimeout(() => resolve(mediciones.find((obj) => obj.id === id)), 300)
    );
  },
  delete: async (id) => {
    mediciones = mediciones.filter((obj) => obj.id !== id);
    return new Promise((resolve) => setTimeout(() => resolve(true), 300));
  },
};
