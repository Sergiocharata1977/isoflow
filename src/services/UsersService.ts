import db from "./db";
import { UserModel } from "@/models/user-model";

export class UsersService {

    static async getAll(): Promise<UserModel[]> {
        try {
            const result = await db.execute("SELECT * FROM users ORDER BY created_at DESC");

            return result.rows.map((row: any) => ({
                id: row.id ?? null,
                email: row.email ?? '',
                full_name: row.full_name ?? '',
                role: row.role ?? '',
                departament: row.departament ?? '',
                position: row.position ?? '',
                is_active: row.is_active ?? '',
                profile_image: row.profile_image ?? '',
                phone: row.phone ?? '',
                emergency_contact: row.emergency_contact ?? '',
                created_at: row.created_at ?? null,
                updated_at: row.updated_at ?? null,
            }));
        } catch (error) {
            console.error("Error obteniendo auditorías:", error);
            throw error;
        }
    }
}
