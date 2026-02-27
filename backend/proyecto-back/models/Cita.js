// importo el módulo mongoose para usar MongoDB
const mongoose = require('mongoose');

// Defino el esquema de una cita
const citaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    correoElectronico: {
        type: String,
        required: true
    },
    obraSocial: {
        type: String,
        required: true
    },
    motivo: {
        type: String,
        required: true
    },
    fecha: {
        type: String,  // Formato: "2024-11-25"
        required: true
    },
    hora: {
        type: String,  // Formato: "10:00"
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada'],
        default: 'pendiente'
    },
    fechaSolicitud: {
        type: Date,
        default: Date.now
    }
}, {
    // Agrega createdAt (fecha de creación del usuario)
    // Y agrega updatedAt (última modificación) automáticamente
    timestamps: true
});

// Creo el modelo Cita basado en el esquema citaSchema y lo exporto
module.exports = mongoose.model('Cita', citaSchema);