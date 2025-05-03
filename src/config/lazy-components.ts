import { lazy } from "react";

export const lazyComponents = {
  NoticiasListing: lazy(() => {
    const component = import("../components/noticias/NoticiasListing");
    component.catch((error) => console.error("Error cargando NoticiasListing:", error));
    return component;
  }),
  CalendarView: lazy(() => {
    const component = import("../components/calendar/CalendarView");
    component.catch((error) => console.error("Error cargando CalendarView:", error));
    return component;
  }),
  MejorasListing: lazy(() => {
    const component = import("../components/mejoras/MejorasListing");
    component.catch((error) => console.error("Error cargando MejorasListing:", error));
    return component;
  }),
  PersonalListing: lazy(() => import("../components/personal/PersonalListing")),
  DepartamentosListing: lazy(() => import("../components/rrhh/DepartamentosListing")),
  PuestosListing: lazy(() => import("../components/rrhh/PuestosListing")),
  ProcesosListing: lazy(() => import("../components/procesos/ProcesosListing")),
  ObjetivosListing2: lazy(() => import("../components/procesos/ObjetivosListing2")),
  IndicadoresListing2: lazy(() => import("../components/procesos/IndicadoresListing2")),
  MedicionesListing2: lazy(() => import("../components/procesos/MedicionesListing2")),
  DocumentosListing: lazy(() => import("../components/documentos/DocumentosListing")),
  AuditoriasListing: lazy(() => import("../components/auditorias/AuditoriasListing")),
  PuntosNormaListing: lazy(() => import("../components/norma/PuntosNormaListing"))
};