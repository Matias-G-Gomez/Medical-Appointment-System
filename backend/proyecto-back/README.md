# Backend – Sistema de Gestión de Citas Médicas

Este proyecto corresponde al backend del Sistema de Gestión de Citas Médicas desarrollado para un consultorio de traumatología.

El backend expone una API REST desarrollada con Node.js y Express, encargada de la gestión de usuarios, citas médicas y obras sociales, así como de la autenticación y el envío de notificaciones por correo electrónico.


## Requisitos

- Node.js (versión 18 o superior recomendada)
- npm
- Base de datos MongoDB (local o MongoDB Atlas)
- Cuenta de Gmail para envío de emails mediante SMTP


## Instalación

Desde la carpeta del proyecto backend, ejecutar:

npm install

Este comando descarga todas las dependencias necesarias y genera automáticamente la carpeta node_modules.


## Configuración

Antes de iniciar el servidor, se debe crear un archivo .env en la raíz del proyecto backend, utilizando como referencia el archivo .env.example, y completar las variables de entorno correspondientes:

MONGO_URI

JWT_SECRET

EMAIL_USER

EMAIL_PASS


## Inicialización de la Base de Datos

El proyecto incluye scripts de inicialización para cargar datos básicos necesarios para el funcionamiento del sistema.

Para inicializar los usuarios del sistema, ejecutar:

node initDB.js

Para inicializar las obras sociales, ejecutar:

node initObrasSociales.js

Estos scripts verifican la existencia previa de datos y evitan duplicaciones.


## Ejecución

Para iniciar el servidor backend, ejecutar:

npm start

El servidor se iniciará por defecto en:

http://localhost:5000


## Observaciones

La carpeta node_modules no se incluye en la entrega del proyecto, ya que se genera automáticamente mediante el comando npm install.
El archivo .env no se incluye en la entrega para proteger información sensible, y se reemplaza por un archivo .env como plantilla de configuración.