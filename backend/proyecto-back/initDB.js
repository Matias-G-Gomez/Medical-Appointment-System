require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Me conecto a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    });

// Crea usuarios iniciales
const createInitialUsers = async () => {
    try {
        // Verifica si ya existen usuarios
        const existingUsers = await User.countDocuments();
        
        if (existingUsers > 0) {
            console.log('Ya existen usuarios en la base de datos. No se crearon usuarios nuevos.');
            process.exit(0);
        }

        // Hashea contraseñas
        const hashedPassword1 = await bcrypt.hash('admin123', 10);
        const hashedPassword2 = await bcrypt.hash('secretaria1', 10);
        const hashedPassword3 = await bcrypt.hash('secretaria2', 10);

        // Crea usuarios
        const users = [
            {
                email: 'dr.gomez@clinica.com',
                password: hashedPassword1,
                name: 'Dr. Marcos Gómez',
                role: 'admin'
            },
            {
                email: 'maria.garcia@clinica.com',
                password: hashedPassword2,
                name: 'María García',
                role: 'secretary'
            },
            {
                email: 'ana.lopez@clinica.com',
                password: hashedPassword3,
                name: 'Ana López',
                role: 'secretary'
            }
        ];

        await User.insertMany(users);

        console.log('Usuarios creados exitosamente:');
        console.log('Dr. Marcos Gómez (admin)');
        console.log('María García (secretaria)');
        console.log('Ana López (secretaria)');
        
        process.exit(0);

    } catch (error) {
        console.error('Error creando usuarios:', error);
        process.exit(1);
    }
};

createInitialUsers();