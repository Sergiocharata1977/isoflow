# Sistema de Gestión de Usuarios

Sistema de gestión de usuarios con autenticación y roles, utilizando una base de datos Turso.

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta en Turso para la base de datos

## Configuración

1. Clonar el repositorio:

```bash
git clone [url-del-repositorio]
cd [nombre-del-directorio]
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto con:

```
PORT=3001
NODE_ENV=development
```

## Estructura del Proyecto

```
src/
├── components/     # Componentes React
├── config/         # Configuraciones
├── server/         # Backend Express
│   ├── api/        # Lógica de API
│   └── routes/     # Rutas Express
├── services/       # Servicios
└── styles/         # Estilos
```

## Iniciar el Proyecto

1. Iniciar el servidor backend:

```bash
npm run server
```

2. Iniciar el frontend:

```bash
npm run dev
```

El frontend correrá en `http://localhost:3002` y el backend en `http://localhost:3001`.

## Endpoints API

### Usuarios

- `GET /api/usuarios` - Listar todos los usuarios
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario
- `GET /api/usuarios/test-connection` - Probar conexión a la base de datos

### Salud

- `GET /health` - Verificar estado del servidor

## Base de Datos

El sistema utiliza Turso como base de datos. La configuración se encuentra en `src/config/database.js`.

### Estructura de la Tabla Users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  position TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Manejo de Errores

El sistema implementa un manejo de errores robusto tanto en el frontend como en el backend. Los errores se registran en la consola y se devuelven al cliente con mensajes descriptivos.

## Monitoreo

El sistema incluye:

- Logging de todas las peticiones HTTP
- Monitoreo de la conexión a la base de datos
- Endpoint de salud para verificar el estado del servidor

## Seguridad

- Las contraseñas se almacenan hasheadas usando bcrypt
- Implementación de CORS
- Validación de datos en el backend
- Manejo seguro de tokens de autenticación

## Desarrollo

Para desarrollo, se recomienda:

1. Usar el modo desarrollo de Vite
2. Mantener el servidor backend corriendo
3. Utilizar las herramientas de desarrollo del navegador para debugging

## Producción

Para despliegue en producción:

1. Configurar `NODE_ENV=production`
2. Construir el frontend: `npm run build`
3. Configurar un servidor web para servir los archivos estáticos
4. Configurar un proxy inverso para el backend
