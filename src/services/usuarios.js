// Servicios para manejar usuarios en el frontend
export async function getUsuarios() {
  try {
    console.log("Iniciando petición GET /api/usuarios");
    const response = await fetch('/api/usuarios');
    console.log("Respuesta recibida:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en respuesta:", errorText);
      throw new Error(errorText || 'Error al obtener usuarios');
    }
    
    const data = await response.json();
    console.log("Datos recibidos:", data);
    return data;
  } catch (error) {
    console.error('Error en getUsuarios:', error);
    throw error;
  }
}

export async function createUsuario(userData) {
  try {
    console.log("Iniciando petición POST /api/usuarios");
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    console.log("Respuesta recibida:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en respuesta:", errorText);
      throw new Error(errorText || 'Error al crear usuario');
    }
    
    const data = await response.json();
    console.log("Usuario creado:", data);
    return data;
  } catch (error) {
    console.error('Error en createUsuario:', error);
    throw error;
  }
}

export async function updateUsuario(id, userData) {
  try {
    console.log(`Iniciando petición PUT /api/usuarios/${id}`);
    const response = await fetch(`/api/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    console.log("Respuesta recibida:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en respuesta:", errorText);
      throw new Error(errorText || 'Error al actualizar usuario');
    }
    
    const data = await response.json();
    console.log("Usuario actualizado:", data);
    return data;
  } catch (error) {
    console.error('Error en updateUsuario:', error);
    throw error;
  }
}

export async function deleteUsuario(id) {
  try {
    console.log(`Iniciando petición DELETE /api/usuarios/${id}`);
    const response = await fetch(`/api/usuarios/${id}`, {
      method: 'DELETE',
    });
    
    console.log("Respuesta recibida:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en respuesta:", errorText);
      throw new Error(errorText || 'Error al eliminar usuario');
    }
    
    return true;
  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    throw error;
  }
} 