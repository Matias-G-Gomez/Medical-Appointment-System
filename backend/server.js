// Para identificar la ruta y manejar solicitudes HTTP
const express = require('express');
// Permite la conexión a MongoDB y permite definir esquemas y modelos
const mongoose = require('mongoose');
// Importo CORS para permitir solicitudes desde el frontend
// y se conecta con el backend
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const citasRoutes = require('./routes/citas');
const obrasSocialesRoutes = require('./routes/obrasSociales');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    });

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/obras-sociales', obrasSocialesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});