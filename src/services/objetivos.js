// Servicio simulado para objetivos
const objetivosEjemplo = [
  {
    id: 1,
    titulo: "Aumentar la satisfacción del cliente",
    descripcion: "Mejorar la atención y los tiempos de respuesta.",
    responsable: "Juan Pérez",
    procesos: "Atención al Cliente",
    estado: "Activo",
  },
  {
    id: 2,
    titulo: "Reducir costos operativos",
    descripcion: "Optimizar el uso de recursos en producción.",
    responsable: "María García",
    procesos: "Producción",
    estado: "Activo",
  },
];

let objetivos = [...objetivosEjemplo];

export const objetivosService = {
  getAll: async () => {
    return new Promise((resolve) =>
      setTimeout(() => resolve([...objetivos]), 300)
    );
  },
  create: async (data) => {
    const nuevo = { ...data, id: Date.now() };
    objetivos.push(nuevo);
    return new Promise((resolve) => setTimeout(() => resolve(nuevo), 300));
  },
  update: async (id, data) => {
    objetivos = objetivos.map((obj) =>
      obj.id === id ? { ...obj, ...data } : obj
    );
    return new Promise((resolve) =>
      setTimeout(() => resolve(objetivos.find((obj) => obj.id === id)), 300)
    );
  },
  delete: async (id) => {
    objetivos = objetivos.filter((obj) => obj.id !== id);
    return new Promise((resolve) => setTimeout(() => resolve(true), 300));
  },
};
