import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  Download,
  Pencil,
  Trash2,
  ClipboardCheck,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
} from 'recharts';
import AuditoriaModal from "./AuditoriaModal";
import AuditoriaSingle from "./AuditoriaSingle";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { AuditoriaModel } from "@/models/auditoria-model";
import { ProcesoModel } from "@/models/proceso-model";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function AuditoriasListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState<AuditoriaModel | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSingle, setShowSingle] = useState<boolean>(false);
  const [currentAuditoria, setCurrentAuditoria] = useState<AuditoriaModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [auditorias, setAuditorias] = useState<AuditoriaModel[]>([]);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [procesoFiltro, setProcesoFiltro] = useState<string>("");
  const [procesos, setProcesos] = useState<ProcesoModel[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Cargar auditorías
      const savedAuditorias = localStorage.getItem("auditorias");
      const auditoriasData = savedAuditorias ? JSON.parse(savedAuditorias) : [];
      setAuditorias(auditoriasData);

      // Cargar procesos para el filtro
      const savedProcesos = localStorage.getItem("procesos");
      const procesosData = savedProcesos ? JSON.parse(savedProcesos) : [];
      setProcesos(procesosData);

    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (auditoriaData: AuditoriaModel) => {
    try {
      let updatedAuditorias;
      if (selectedAuditoria) {
        updatedAuditorias = auditorias.map(a =>
          a.id === selectedAuditoria.id ? { ...auditoriaData, id: selectedAuditoria.id } : a
        );
        toast({
          title: "Auditoría actualizada",
          description: "Los datos de la auditoría han sido actualizados exitosamente"
        });
      } else {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const numero = `A${year}${month}-${random}`;

        updatedAuditorias = [...auditorias, { ...auditoriaData, id: Date.now(), numero }];
        toast({
          title: "Auditoría creada",
          description: "Se ha agregado una nueva auditoría exitosamente"
        });
      }
      setAuditorias(updatedAuditorias);
      localStorage.setItem("auditorias", JSON.stringify(updatedAuditorias));
      setIsModalOpen(false);
      setSelectedAuditoria(null);
    } catch (error) {
      console.error("Error saving auditoría:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la auditoría",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (auditoria: AuditoriaModel) => {
    setSelectedAuditoria(auditoria);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    try {
      const updatedAuditorias = auditorias.filter(a => a.id !== id);
      setAuditorias(updatedAuditorias);
      localStorage.setItem("auditorias", JSON.stringify(updatedAuditorias));
      toast({
        title: "Auditoría eliminada",
        description: "La auditoría ha sido eliminada exitosamente"
      });

      if (showSingle) {
        setShowSingle(false);
      }
    } catch (error) {
      console.error("Error deleting auditoría:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la auditoría",
        variant: "destructive"
      });
    }
  };

  const handleViewAuditoria = (auditoria: AuditoriaModel) => {
    setCurrentAuditoria(auditoria);
    setShowSingle(true);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Planificada':
        return 'bg-blue-100 text-blue-800';
      case 'En Ejecución':
        return 'bg-yellow-100 text-yellow-800';
      case 'Terminada':
        return 'bg-green-100 text-green-800';
      case 'Controlada':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text('Lista de Auditorías', 20, 20);

    // Table
    const tableColumn = ["Número", "Fecha", "Responsable", "Estado"];
    const tableRows = auditorias.map(auditoria => [
      auditoria.numero,
      new Date(auditoria.fecha_programada).toLocaleDateString(),
      auditoria.responsable,
      auditoria.estado
    ]);

    // doc.autoTable({
    //   startY: 30,
    //   head: [tableColumn],
    //   body: tableRows,
    // });

    doc.save('auditorias.pdf');
  };

  const filteredAuditorias = auditorias.filter(auditoria =>
    (auditoria.responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auditoria.objetivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auditoria.procesos_evaluar?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!procesoFiltro || auditoria.procesos_evaluar === procesoFiltro)
  );

  // Datos para gráficos
  const estadoData = [
    { name: 'Planificada', value: auditorias.filter(a => a.estado === 'Planificada').length },
    { name: 'En Ejecución', value: auditorias.filter(a => a.estado === 'En Ejecución').length },
    { name: 'Terminada', value: auditorias.filter(a => a.estado === 'Terminada').length },
    { name: 'Controlada', value: auditorias.filter(a => a.estado === 'Controlada').length }
  ];

  const calificacionData = [
    { name: 'Muy Bueno', value: 0 },
    { name: 'Bueno', value: 0 },
    { name: 'Regular', value: 0 },
    { name: 'Malo', value: 0 }
  ];

  auditorias.forEach(auditoria => {
    auditoria.puntos?.forEach(punto => {
      const index = calificacionData.findIndex(c => c.name === punto.calificacion);
      if (index !== -1) {
        calificacionData[index].value++;
      }
    });
  });

  if (showSingle && currentAuditoria) {
    return (
      <AuditoriaSingle
        auditoria={currentAuditoria}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Auditorías</h2>
        <Button
          variant="default"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus />
          Agregar Auditoría
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          className="input input-bordered w-1/2"
          placeholder="Buscar Auditorías"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select select-bordered"
          value={procesoFiltro}
          onChange={(e) => setProcesoFiltro(e.target.value)}
        >
          <option value="">Filtrar por proceso</option>
          {procesos.map((proceso) => (
            <option key={proceso.id} value={proceso.titulo}>
              {proceso.titulo}
            </option>
          ))}
        </select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="list">Lista de Auditorías</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg p-4 bg-white shadow-md">
              <h3 className="font-semibold text-lg">Estado de Auditorías</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={estadoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg p-4 bg-white shadow-md">
              <h3 className="font-semibold text-lg">Calificación de Auditorías</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={calificacionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {calificacionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>Acciones</th>
                  <th>Fecha Programada</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Objetivo</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditorias.map((auditoria) => (
                  <tr key={auditoria.id}>
                    <td className="flex gap-2">
                      <Button variant="outline" onClick={() => handleEdit(auditoria)}>
                        <Pencil />
                      </Button>
                      <Button variant="outline" onClick={() => handleDelete(auditoria.id!)}>
                        <Trash2 />
                      </Button>
                      <Button variant="outline" onClick={() => handleViewAuditoria(auditoria)}>
                        <ClipboardCheck />
                      </Button>
                    </td>
                    <td>{new Date(auditoria.fecha_programada).toLocaleDateString()}</td>
                    <td>{auditoria.responsable}</td>
                    <td>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(auditoria.estado)}`}>
                        {auditoria.estado}
                      </span>
                    </td>
                    <td>{auditoria.objetivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <Button variant="default" onClick={exportToPDF}>
        <Download className="mr-2" />
        Exportar a PDF
      </Button>

      <AuditoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        auditoria={selectedAuditoria!}
      />
    </div>
  );
}

export default AuditoriasListing;
