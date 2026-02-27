// importo el módulo mongoose para usar MongoDB
const mongoose = require('mongoose');

const obraSocialSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true  // No puede haber obras sociales duplicadas
    }
}, {
    // Agrega createdAt (fecha de creación del usuario)
    // Y agrega updatedAt (última modificación) automáticamente
    timestamps: true
});

// Creo el modelo ObraSocial basado en el esquema obraSocualSchema y lo exporto
module.exports = mongoose.model('ObraSocial', obraSocialSchema);