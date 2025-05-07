import {
    LayoutGrid,
    Calendar,
    ArrowUpCircle,
    Users,
    Building2,
    FileText,
    ClipboardList,
    Target,
    BarChart2,
    Ruler,
    ClipboardCheck,
  } from "lucide-react";
  import { SectionMenuModel } from "../models/section-menu-model";
  
  export const menuSections: SectionMenuModel[] = [
    {
      id: "noticias",
      title: "Tablero Central",
      icon: LayoutGrid,
    },
    {
      id: "calendario",
      title: "Calendario",
      icon: Calendar,
    },
    {
      id: "mejoras",
      title: "Hallazgos y mejoras",
      icon: ArrowUpCircle,
    },
    {
      id: "rrhh",
      title: "Recursos Humanos",
      icon: Users,
      items: [
        {
          id: "personal",
          title: "Personal",
          icon: Users,
        },
        {
          id: "departamentos",
          title: "Departamentos",
          icon: Building2,
        },
        {
          id: "puestos",
          title: "Puestos",
          icon: Users,
        },
      ],
    },
    {
      id: "procesos",
      title: "Procesos",
      icon: ClipboardList,
      items: [
        {
          id: "procesos",
          title: "Procesos",
          icon: ClipboardList,
        },
        {
          id: "objetivos",
          title: "Objetivos",
          icon: Target,
        },
        {
          id: "indicadores",
          title: "Indicadores",
          icon: BarChart2,
        },
        {
          id: "mediciones",
          title: "Mediciones",
          icon: Ruler,
        },
      ],
    },
    {
      id: "documentos",
      title: "Documentos",
      icon: FileText,
    },
    {
      id: "puntosnorma",
      title: "Puntos de Norma",
      icon: ClipboardCheck,
    },
    {
      id: "auditorias",
      title: "Auditorías",
      icon: ClipboardCheck,
    },
  ];