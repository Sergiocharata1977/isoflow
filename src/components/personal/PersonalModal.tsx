import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Camera } from "lucide-react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { PersonalService } from "@/services/personal-service";
import { AcademicFormation, PersonalData, WorkExperience } from "@/models/personal-model";

interface PersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  userId?: number;
}

function PersonalModal({ isOpen, onClose, onSave, userId }: PersonalModalProps) {
  const [formData, setFormData] = useState<PersonalData>({
    email: "",
    full_name: "",
    role: "employee",
    position: "",
    department: "",
    phone: "",
    hire_date: "",
    identificacion: "",
    address: "",
    formacionAcademica: [],
    experienciaLaboral: [],
    skills: "",
    performance_evaluation: "",
    training_received: "",
    notes: "",
    profile_image: "",
    password: ""
  });

  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      const depts = [
        { id: 1, name: "Dirección General" },
        { id: 2, name: "Gestión de Calidad" },
        { id: 3, name: "Gestión Ambiental" },
        { id: 4, name: "Seguridad y Salud en el Trabajo" },
        { id: 5, name: "Auditoría Interna" },
        { id: 6, name: "Documentación y Control de Registros" },
        { id: 7, name: "Mejora Continua" },
        { id: 8, name: "Procesos Operativos" },
        { id: 9, name: "Recursos Humanos" },
        { id: 10, name: "Infraestructura y Mantenimiento" }
      ];
      
      const pos = [
        "Representante de la Dirección",
        "Responsable del SGC",
        "Auditor Interno ISO",
        "Coordinador de Calidad",
        "Especialista en Gestión Ambiental",
        "Responsable de SST",
        "Documentador de Procesos",
        "Analista de Mejora Continua",
        "Responsable de Indicadores",
        "Coordinador de No Conformidades",
        "Responsable de Acciones Correctivas",
        "Gestor de Riesgos",
        "Especialista en Normalización",
        "Coordinador de Capacitaciones",
        "Responsable de Proveedores"
      ];
      
      setDepartments(depts);
      setPositions(pos);

      if (userId) {
        const userData = await PersonalService.getPersonalById(userId);
        if (userData) {
          setFormData({
            ...userData,
            formacionAcademica: userData.formacionAcademica?.map((row) => ({
              user_id: Number(row.user_id) || 0,
              titulo: String(row.titulo) || "",
              institucion: String(row.institucion) || "",
              anio_finalizacion: String(row.anio_finalizacion) || "",
              descripcion: String(row.descripcion) || "",
            })) || [],
            experienciaLaboral: userData.experienciaLaboral || []
          });
        }
      } else {
        setFormData({
          email: "",
          full_name: "",
          role: "employee",
          position: "",
          department: "",
          phone: "",
          hire_date: "",
          identificacion: "",
          address: "",
          formacionAcademica: [],
          experienciaLaboral: [],
          skills: "",
          performance_evaluation: "",
          training_received: "",
          notes: "",
          profile_image: "",
          password: ""

        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isOpen) {
    loadData();
  }
}, [isOpen, userId]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profile_image: reader.result as string
        }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 5242880,
    multiple: false,
  });

  const addFormacionAcademica = () => {
    setFormData(prev => ({
      ...prev,
      formacionAcademica: [
        ...(prev.formacionAcademica || []),
        { user_id: userId || 0, titulo: "", institucion: "", anio_finalizacion: "", descripcion: "" }
      ]
    }));
  };

  const removeFormacionAcademica = (index: number) => {
    setFormData((prev: PersonalData) => ({
      ...prev,
      formacionAcademica: (prev.formacionAcademica || []).filter((_, i: number) => i !== index)
    }));
  };

  const updateFormacionAcademica = (index: number, field: keyof AcademicFormation, value: string) => {
    setFormData(prev => ({
      ...prev,
      formacionAcademica: (prev.formacionAcademica || []).map((formacion, i) =>
        i === index ? { ...formacion, [field]: value } : formacion
      )
    }));
  };

  const addExperienciaLaboral = () => {
    setFormData(prev => ({
      ...prev,
      experienciaLaboral: [
        ...(prev.experienciaLaboral || []),
        { user_id: userId || 0, empresa: "", puesto: "", fecha_inicio: "", fecha_fin: "", descripcion: "" }
      ]
    }));
  };

  const removeExperienciaLaboral = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experienciaLaboral: (prev.experienciaLaboral || []).filter((_, i) => i !== index)
    }));
  };

  const updateExperienciaLaboral = (index: number, field: keyof WorkExperience, value: string) => {
    setFormData(prev => ({
      ...prev,
      experienciaLaboral: (prev.experienciaLaboral || []).map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ) as WorkExperience[]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (userId) {
        await PersonalService.updatePersonal(userId, formData);
      } else {
        await PersonalService.createPersonal(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving personal data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {userId ? "Editar Personal" : "Nuevo Personal"}
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Cargando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="informacion" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="informacion">Información General</TabsTrigger>
                <TabsTrigger value="formacion">Formación Académica</TabsTrigger>
                <TabsTrigger value="experiencia">Experiencia Laboral</TabsTrigger>
              </TabsList>

              <TabsContent value="informacion" className="mt-4 space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div {...getRootProps()} className="flex items-center justify-center w-32 h-32 overflow-hidden transition-colors border-2 border-dashed rounded-full cursor-pointer border-primary/50 hover:border-primary bg-muted">
                      <input {...getInputProps()} />
                      {formData.profile_image ? (
                        <img src={formData.profile_image} alt="Foto de perfil" className="object-cover w-full h-full" />
                      ) : (
                        <div className="text-center">
                          <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Haz clic para subir foto</p>
                        </div>
                      )}
                    </div>
                    {formData.profile_image && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute w-8 h-8 rounded-full -bottom-2 -right-2"
                        onClick={(e) => {
                          e.preventDefault();
                            setFormData((prev: PersonalData) => ({ ...prev, profile_image: "" }));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre Completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="identificacion">Documento de Identidad</Label>
                    <Input
                      id="identificacion"
                      value={formData.identificacion || ""}
                      onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Puesto</Label>
                    <select
                      id="position"
                      className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background"
                      value={formData.position || ""}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      required
                    >
                      <option value="">Seleccione un puesto</option>
                      {positions.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <select
                      id="department"
                      className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background"
                      value={formData.department || ""}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    >
                      <option value="">Seleccione un departamento</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hire_date">Fecha de Ingreso</Label>
                    <Input
                      id="hire_date"
                      type="date"
                      value={formData.hire_date || ""}
                      onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Competencias/Habilidades</Label>
                  <Input
                    id="skills"
                    value={formData.skills || ""}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="performance_evaluation">Evaluación de Desempeño</Label>
                    <Input
                      id="performance_evaluation"
                      value={formData.performance_evaluation || ""}
                      onChange={(e) => setFormData({ ...formData, performance_evaluation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training_received">Capacitaciones Recibidas</Label>
                    <Input
                      id="training_received"
                      value={formData.training_received || ""}
                      onChange={(e) => setFormData({ ...formData, training_received: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observaciones</Label>
                  <Input
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="formacion" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Formación Académica</h3>
                  <Button type="button" onClick={addFormacionAcademica} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Formación
                  </Button>
                </div>

                {(formData.formacionAcademica || []).map((formacion: AcademicFormation, index: number) => (
                  <div key={index} className="p-4 space-y-4 border rounded-lg border-border">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium">Formación #{index + 1}</h4>
                    <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFormacionAcademica(index)}
                    >
                    <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={formacion.titulo}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormacionAcademica(index, 'titulo', e.target.value)}
                      required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label>Institución</Label>
                    <Input
                      value={formacion.institucion}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormacionAcademica(index, 'institucion', e.target.value)}
                      required
                    />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Año de Finalización</Label>
                    <Input
                      type="number"
                      min="1900"
                      max="2100"
                      value={formacion.anio_finalizacion}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormacionAcademica(index, 'anio_finalizacion', e.target.value)}
                      required
                    />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input
                    value={formacion.descripcion || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormacionAcademica(index, 'descripcion', e.target.value)}
                    placeholder="Descripción adicional..."
                    />
                  </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="experiencia" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Experiencia Laboral</h3>
                  <Button type="button" onClick={addExperienciaLaboral} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Experiencia
                  </Button>
                </div>

                {(formData.experienciaLaboral || []).map((experiencia: WorkExperience, index: number) => (
                  <div key={index} className="p-4 space-y-4 border rounded-lg border-border">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium">Experiencia #{index + 1}</h4>
                    <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperienciaLaboral(index)}
                    >
                    <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input
                      value={experiencia.empresa}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperienciaLaboral(index, 'empresa', e.target.value)}
                      required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label>Puesto</Label>
                    <Input
                      value={experiencia.puesto}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperienciaLaboral(index, 'puesto', e.target.value)}
                      required
                    />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Fecha de Inicio</Label>
                    <Input
                      type="date"
                      value={experiencia.fecha_inicio}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperienciaLaboral(index, 'fecha_inicio', e.target.value)}
                      required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label>Fecha de Fin</Label>
                    <Input
                      type="date"
                      value={experiencia.fecha_fin || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperienciaLaboral(index, 'fecha_fin', e.target.value)}
                    />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input
                    value={experiencia.descripcion || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperienciaLaboral(index, 'descripcion', e.target.value)}
                    placeholder="Descripción de responsabilidades..."
                    />
                  </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {userId ? "Guardar Cambios" : "Crear Personal"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PersonalModal;