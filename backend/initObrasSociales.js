require('dotenv').config();
const mongoose = require('mongoose');
const ObraSocial = require('./models/ObraSocial');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    });

// Crear obras sociales iniciales
const createObrasSociales = async () => {
    try {
        // Verificar si ya existen obras sociales
        const existentes = await ObraSocial.countDocuments();
        
        if (existentes > 0) {
            console.log('Ya existen obras sociales en la base de datos.');
            console.log(`Total: ${existentes} obras sociales`);
            process.exit(0);
        }

        // Crear obras sociales iniciales
        const obrasSociales = [
            { nombre: 'OSDE' },
            { nombre: 'Swiss Medical' },
            { nombre: 'Galeno' },
            { nombre: 'PAMI' },
            { nombre: 'Medicus' },
            { nombre: 'IOMA' },
            { nombre: 'Particular' }
        ];

        await ObraSocial.insertMany(obrasSociales);

        console.log('Obras sociales creadas exitosamente:');
        obrasSociales.forEach(os => console.log(`   - ${os.nombre}`));
        
        process.exit(0);

    } catch (error) {
        console.error('Error creando obras sociales:', error);
        process.exit(1);
    }
};

createObrasSociales();