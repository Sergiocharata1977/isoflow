export interface User {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
    position?: string;
    department?: string;
    image?: string;
    formacionAcademica: any[];
    experienciaLaboral: any[];
    profile_image?: string;

  }