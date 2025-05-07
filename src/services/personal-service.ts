import { PersonalData } from "@/models/personal-model";
import db from "./db";
import bcrypt from "bcryptjs";



export class PersonalService {


  static async getAllUsers() {
    try {
      const usersResult = await db.execute('SELECT * FROM users ORDER BY full_name', []);
      const users = usersResult.rows;
      const usersWithDetails = await Promise.all(
        users.map(async (user: any) => {
          const [formacionResult, experienciaResult] = await Promise.all([
            db.execute('SELECT * FROM formacion_academica WHERE user_id = ?', [user.id]),
            db.execute('SELECT * FROM experiencia_laboral WHERE user_id = ?', [user.id])
          ]);
          return {
            ...user,
            formacionAcademica: formacionResult.rows,
            experienciaLaboral: experienciaResult.rows
          };
        })
      );

      return usersWithDetails;
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      throw error;
    }
  }
  static async createPersonal(data: PersonalData) {
    try {

      const plainPassword = data.password || '123456';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const user = await db.execute(
        `INSERT INTO users (
          email, full_name, role, department, position, identificacion, 
          phone, address, hire_date, skills, performance_evaluation, 
          training_received, notes, profile_image, password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
        [
          data.email,
          data.full_name,
          data.role || 'employee',
          data.department,
          data.position,
          data.identificacion,
          data.phone,
          data.address,
          data.hire_date,
          data.skills,
          data.performance_evaluation,
          data.training_received,
          data.notes,
          data.profile_image,
          hashedPassword
        ]
      );

      const userId = user.rows[0]?.id;
      if (typeof userId !== 'number') {
        throw new Error("Failed to create user: Invalid user ID");
      }

      if (data.formacionAcademica?.length) {
        for (const formacion of data.formacionAcademica) {
          await db.execute(
            `INSERT INTO formacion_academica (
              user_id, titulo, institucion, anio_finalizacion, descripcion
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              userId,
              formacion.titulo,
              formacion.institucion,
              formacion.anio_finalizacion,
              formacion.descripcion || null
            ]
          );
        }
      }

      if (data.experienciaLaboral?.length) {
        for (const experiencia of data.experienciaLaboral) {
          await db.execute(
            `INSERT INTO experiencia_laboral (
              user_id, empresa, puesto, fecha_inicio,fecha_fin, descripcion
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              userId,
              experiencia.empresa,
              experiencia.puesto,
              experiencia.fecha_inicio,
              experiencia.fecha_fin || null,
              experiencia.descripcion || null
            ]
          );
        }
      }

      return this.getPersonalById(userId);
    } catch (error) {
      console.error("Error in createPersonal:", error);
      throw error;
    }
  }

  static async updatePersonal(id: number, data: PersonalData) {
    try {
      await db.execute(
        `UPDATE users SET
          email = ?,
          full_name = ?,
          department = ?,
          position = ?,
          identificacion = ?,
          phone = ?,
          address = ?,
          hire_date = ?,
          skills = ?,
          performance_evaluation = ?,
          training_received = ?,
          notes = ?,
          profile_image = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          data.email,
          data.full_name,
          data.department,
          data.position,
          data.identificacion,
          data.phone,
          data.address,
          data.hire_date,
          data.skills,
          data.performance_evaluation,
          data.training_received,
          data.notes,
          data.profile_image,
          id
        ]
      );

      await db.execute(
        'DELETE FROM formacion_academica WHERE user_id = ?',
        [id]
      );

      if (data.formacionAcademica?.length) {
        for (const formacion of data.formacionAcademica) {
          await db.execute(
            `INSERT INTO formacion_academica (
              user_id, titulo, institucion, anio_finalizacion, descripcion
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              id,
              formacion.titulo,
              formacion.institucion,
              formacion.anio_finalizacion,
              formacion.descripcion || null
            ]
          );
        }
      }

      await db.execute(
        'DELETE FROM experiencia_laboral WHERE user_id = ?',
        [id]
      );

      if (data.experienciaLaboral?.length) {
        for (const experiencia of data.experienciaLaboral) {
          await db.execute(
            `INSERT INTO experiencia_laboral (
              user_id, empresa, puesto, fecha_inicio,fecha_fin, descripcion
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              id,
              experiencia.empresa,
              experiencia.puesto,
              experiencia.fecha_inicio,
              experiencia.fecha_fin || null,
              experiencia.descripcion || null
            ]
          );
        }
      }

      return this.getPersonalById(id);
    } catch (error) {
      console.error("Error in updatePersonal:", error);
      throw error;
    }
  }

  static async getPersonalById(id: number) {
    try {
      const userResult = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (userResult.rows.length === 0) return null;

      const user = userResult.rows[0];

      const [formacionResult, experienciaResult] = await Promise.all([
        db.execute(
          'SELECT * FROM formacion_academica WHERE user_id = ?',
          [id]
        ),
        db.execute(
          'SELECT * FROM experiencia_laboral WHERE user_id = ?',
          [id]
        )
      ]);

      return {
        ...user,
        formacionAcademica: formacionResult.rows,
        experienciaLaboral: experienciaResult.rows
      };
    } catch (error) {
      console.error("Error in getPersonalById:", error);
      throw error;
    }
  }

  static async getAllPersonal() {
    try {
      const result = await db.execute(
        'SELECT id, full_name, email, puesto, department FROM users WHERE role = ? ORDER BY full_name',
        ['employee']
      );
      return result.rows;
    } catch (error) {
      console.error("Error in getAllPersonal:", error);
      throw error;
    }
  }

  static async getDepartments() {
    try {
      const result = await db.execute(
        'SELECT id, name FROM departments ORDER BY name',
        []
      );
      return result.rows;
    } catch (error) {
      console.error("Error in getDepartments:", error);
      throw error;
    }
  }

  static async getpuestos() {
    try {
      const result = await db.execute(
        'SELECT DISTINCT puesto FROM users WHERE puesto IS NOT NULL ORDER BY puesto',
        []
      );
      return result.rows.map(row => row.puesto);
    } catch (error) {
      console.error("Error in getpuestos:", error);
      throw error;
    }
  }

  // static async deletePersonal(id: number) {
  //   try {
  //     await db.execute('DELETE FROM formacion_academica WHERE user_id = ?', [id]);
  //     await db.execute('DELETE FROM experiencia_laboral WHERE user_id = ?', [id]);
  
  //     const result = await db.execute('DELETE FROM users WHERE id = ?', [id]);
  
  //     if (result.rowsAffected === 0) {
  //       throw new Error(`User with id ${id} not found or already deleted.`);
  //     }
  
  //     return { success: true, message: 'Usuario eliminado correctamente' };
  //   } catch (error) {
  //     console.error("Error in deletePersonal:", error);
  //     throw error;
  //   }
  // }

  static async deletePersonal(id: number) {
    try {
      const userResult = await db.execute('SELECT email FROM users WHERE id = ?', [id]);
  
      if (userResult.rows.length === 0) {
        throw new Error(`Usuario con id ${id} no encontrado.`);
      }
  
      const email = userResult.rows[0].email;
  
      if (email === 'admin@isoflow.com') {
        throw new Error('No se puede eliminar el usuario administrador.');
      }
  
      await db.execute('DELETE FROM formacion_academica WHERE user_id = ?', [id]);
      await db.execute('DELETE FROM experiencia_laboral WHERE user_id = ?', [id]);
  
      const result = await db.execute('DELETE FROM users WHERE id = ?', [id]);
  
      if (result.rowsAffected === 0) {
        throw new Error(`Usuario con id ${id} no encontrado o ya fue eliminado.`);
      }
  
      return { success: true, message: 'Usuario eliminado correctamente' };
    } catch (error) {
      console.error("Error en deletePersonal:", error);
      throw error;
    }
  }
  
  
}




export default new PersonalService();