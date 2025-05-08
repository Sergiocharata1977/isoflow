import { Routes, Route } from "react-router-dom";
import { lazyComponents } from "../../config/lazy-components";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<lazyComponents.NoticiasListing />} />
    <Route path="/noticias" element={<lazyComponents.NoticiasListing />} />
    <Route path="/calendario" element={<lazyComponents.CalendarView />} />
    <Route path="/mejoras" element={<lazyComponents.MejorasListing />} />
    <Route path="/personal" element={<lazyComponents.PersonalListing />} />
    <Route path="/departamentos" element={<lazyComponents.DepartamentosListing />} />
    <Route path="/puestos" element={<lazyComponents.PuestosListing />} />
    <Route path="/procesos" element={<lazyComponents.ProcesosListing />} />
    <Route path="/objetivos" element={<lazyComponents.ObjetivosListing />} />
    <Route path="/indicadores" element={<lazyComponents.IndicadoresListing />} />
    <Route path="/mediciones" element={<lazyComponents.MedicionesListing />} />
    <Route path="/documentos" element={<lazyComponents.DocumentosListing />} />
    <Route path="/puntosnorma" element={<lazyComponents.PuntosNormaListing />} />
    <Route path="/auditorias" element={<lazyComponents.AuditoriasListing />} />
    <Route path="*" element={
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Página no encontrada</p>
      </div>
    } />
  </Routes>
);