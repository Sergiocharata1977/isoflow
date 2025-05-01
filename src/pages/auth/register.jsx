import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { registerUser } from "@/services/userService";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    position: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        position: formData.position
      });

      toast({
        title: "Éxito",
        description: "Usuario registrado correctamente",
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Error en el registro:", error);
      toast({
        title: "Error",
        description: error.message || "Error al registrar el usuario",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Imagen a la izquierda */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Campo agrícola al atardecer"
          src="https://images.unsplash.com/photo-1511846859610-ea7712ac1c3d" 
        />
      </div>

      {/* Formulario a la derecha */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <img 
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/8dbf3f66-6a64-4665-ae25-f32f332f4fba/cc9b1df2cd322a7d7fae6946d9b31b50.jpg"
              alt="SGC ISO 9001"
              className="mx-auto h-16 w-auto mb-6"
            />
            <h2 className="text-2xl font-bold tracking-tight">
              Crear una nueva cuenta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete el formulario para registrarse
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Puesto</Label>
              <Input
                id="position"
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⭮</span>
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tiene una cuenta?{" "}
              <a href="/login" className="font-medium text-primary hover:text-primary/90">
                Iniciar sesión
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage;
