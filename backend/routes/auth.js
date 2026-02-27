const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Busca usuario por email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. Verifica contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Crea token JWT
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 4. Envia respuesta exitosa
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// GET /api/auth/verify - Verifica si el token es válido
router.get('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ valid: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ valid: false });
        }

        res.json({ 
            valid: true, 
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;