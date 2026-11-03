# Sistema de Gestión de Turnos Médicos

Aplicación web full stack para un consultorio de traumatología. Los pacientes piden turnos online sin registrarse, y el personal del consultorio los gestiona desde un panel protegido con inicio de sesión y permisos por rol.

> 🔗 **Demo online:** [https://medical-appointment-system-rosy.vercel.app/admin](https://medical-appointment-system-rosy.vercel.app/admin)
>
> El backend está en un servidor gratuito: si nadie lo usó en un rato, la primera acción puede tardar alrededor de un minuto. Después funciona normalmente.

![Página principal del consultorio](docs/capturas/inicio.png)

## Probar la demo

Para entrar al panel, tocá **Iniciar sesión** y usá la cuenta de demostración:

| Rol | Email | Contraseña |
|---|---|---|
| Secretaría | `maria.garcia@clinica.com` | `secretaria1` |

Con esta cuenta podés ver todos los turnos y confirmarlos o cancelarlos. Las funciones de administración, como gestionar usuarios y obras sociales, están reservadas al rol de administrador y se muestran en las capturas.

Los turnos de la demo tienen datos inventados.

## Funcionalidades

**Para pacientes**
- Solicitud de turnos sin registro previo.
- Calendario que bloquea fines de semana y muestra solo los horarios libres.
- Selección de motivo de consulta y obra social.

**Para el consultorio**
- Inicio de sesión con **JWT** y contraseñas encriptadas con **bcrypt**.
- **Permisos por rol**: administrador y secretaría.
- Panel para ver, confirmar y cancelar turnos, con actualización al instante.
- Avisos automáticos por **email** al confirmar o cancelar un turno.
- Gestión de obras sociales y de usuarios (solo administrador).

![Formulario para pedir un turno](docs/capturas/turno.png)

![Panel de gestión de turnos](docs/capturas/panel.png)

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React, Material UI, Context API, date-fns |
| Backend | Node.js, Express |
| Base de datos | MongoDB Atlas con Mongoose |
| Seguridad | JWT, bcrypt, control de acceso por roles |
| Emails | Nodemailer |
| Publicación | Vercel (frontend) y Render (backend) |

## Arquitectura

```
Navegador (React en Vercel)  →  API REST (Express en Render)  →  MongoDB Atlas
                                         │
                                 Nodemailer (avisos por email)
```

El frontend se comunica con el backend mediante una API REST. Las rutas del panel están protegidas por un middleware que valida el token JWT y, en las acciones de administración, el rol del usuario.

## API REST

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Inicia sesión y devuelve el token |
| GET | `/api/auth/verify` | Público | Verifica si un token es válido |
| POST | `/api/citas` | Público | Crea un turno |
| GET | `/api/citas/disponibilidad` | Público | Indica si una fecha y hora están libres |
| GET | `/api/citas` | Con sesión | Lista todos los turnos |
| PUT | `/api/citas/:id/estado` | Con sesión | Confirma o cancela un turno |
| GET | `/api/obras-sociales` | Público | Lista las obras sociales |
| POST / PUT / DELETE | `/api/obras-sociales` | Administrador | Gestiona obras sociales |
| GET / POST / DELETE | `/api/users` | Administrador | Gestiona usuarios del panel |

## Cómo ejecutarlo en local

### Requisitos

- Node.js 18 o superior
- Una base MongoDB, local o gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas)

### Backend

1. Entrá a la carpeta e instalá las dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Creá un archivo `.env` dentro de `backend`:
   ```
   MONGO_URI=mongodb+srv://USUARIO:PASSWORD@tu-cluster.mongodb.net/turnos
   JWT_SECRET=una_frase_secreta
   EMAIL_USER=tu_correo@gmail.com
   EMAIL_PASS=tu_contraseña_de_aplicacion
   ```
   `EMAIL_USER` y `EMAIL_PASS` son opcionales: si no están, el sistema funciona igual y omite el envío de emails.
3. Cargá los datos iniciales y arrancá el servidor:
   ```bash
   node initDB.js            # usuarios del panel
   node initObrasSociales.js # obras sociales
   node initDemo.js          # turnos de demostración (opcional)
   npm start
   ```
   La API queda en `http://localhost:5000`.

### Frontend

En otra terminal:
```bash
cd frontend
npm install
npm start
```
La aplicación se abre en `http://localhost:3000`. Para usar otra dirección de API, definí la variable `REACT_APP_API_URL`.

## Estructura del proyecto

```
├── backend/
│   ├── middleware/   Validación de token y de rol
│   ├── models/       Usuario, Cita y Obra Social
│   ├── routes/       Endpoints de la API
│   ├── initDB.js, initObrasSociales.js, initDemo.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/   Secciones de la página, formulario y panel
        ├── context/      Estado global y llamadas a la API
        └── config.js     Dirección de la API
```

## Autor

**Matías Germán Gómez**
[LinkedIn](https://www.linkedin.com/in/matias-german-gomez/) · [GitHub](https://github.com/Matias-G-Gomez) · [Portfolio](https://matias-gomez-black.vercel.app)
