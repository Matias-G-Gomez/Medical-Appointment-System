const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Obtiene todos los usuarios (solo admin)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// POST /api/users - Crea un nuevo usuario (solo admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // Valida que todos los campos estén presentes
        if (!email || !password || !name || !role) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Valida que el rol sea válido
        if (role !== 'admin' && role !== 'secretary') {
            return res.status(400).json({ message: 'El rol debe ser admin o secretary' });
        }

        // Verifica si el email ya existe
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Hashea la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea el usuario
        const newUser = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            role
        });

        await newUser.save();

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
});

// DELETE /api/users/:id - Elimina un usuario (solo admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // No permite que el admin se elimine a sí mismo
        if (id === req.user.id) {
            return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
});

module.exports = router;