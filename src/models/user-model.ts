export interface UserModel {
    id?: number

    email: string
    full_name: string

    role: string

    departament: string

    position: string
    is_active: string

    profile_image: string

    phone: string
    emergency_contact: string

    created_at?: string
    updated_at?: string
}