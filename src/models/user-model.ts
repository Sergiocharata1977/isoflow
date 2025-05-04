export interface UserModel {
    id?: number

    email: string;
    password: string;
    full_name: string;
    role: string;
    department?: string;
    position?: string;
    is_active?: boolean;

    last_login?: string;
    password_reset_token?: string;
    password_reset_expires?: string;

    profile_image?: string;
    phone?: string;
    emergency_contact?: string;

    iso_training_level?: string;
    iso_certifications?: string;

    can_approve_documents?: boolean;
    can_create_processes?: boolean;
    can_edit_indicators?: boolean;

    notes?: string;

    created_at?: string
    updated_at?: string
}