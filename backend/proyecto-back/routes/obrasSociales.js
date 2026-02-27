const express = require('express');
const ObraSocial = require('../models/ObraSocial');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/obras-sociales - Obtiene todas las obras sociales (público)
router.get('/', async (req, res) => {
    try {
        const obrasSociales = await ObraSocial.find().sort({ nombre: 1 });
        res.json(obrasSociales);
    } catch (error) {
        console.error('Error al obtener obras sociales:', error);
        res.status(500).json({ message: 'Error al obtener obras sociales' });
    }
});

// POST /api/obras-sociales - Crea una nueva obra social (solo admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es obligatorio' });
        }

        // Verifica si ya existe
        const existente = await ObraSocial.findOne({ nombre });
        if (existente) {
            return res.status(400).json({ message: 'La obra social ya existe' });
        }

        const nuevaObraSocial = new ObraSocial({ nombre });
        await nuevaObraSocial.save();

        res.status(201).json({
            message: 'Obra social creada exitosamente',
            obraSocial: nuevaObraSocial
        });

    } catch (error) {
        console.error('Error al crear obra social:', error);
        res.status(500).json({ message: 'Error al crear obra social' });
    }
});

// PUT /api/obras-sociales/:id - Actualiza una obra social (solo admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es obligatorio' });
        }

        // Verifica si ya existe otra obra social con ese nombre
        const existente = await ObraSocial.findOne({ 
            nombre,
            _id: { $ne: id }  // Excluir la obra social actual
        });
        
        if (existente) {
            return res.status(400).json({ message: 'Ya existe una obra social con ese nombre' });
        }

        const obraSocial = await ObraSocial.findByIdAndUpdate(
            id,
            { nombre },
            { new: true }  // Devuelve el documento actualizado
        );

        if (!obraSocial) {
            return res.status(404).json({ message: 'Obra social no encontrada' });
        }

        res.json({
            message: 'Obra social actualizada exitosamente',
            obraSocial
        });

    } catch (error) {
        console.error('Error al actualizar obra social:', error);
        res.status(500).json({ message: 'Error al actualizar obra social' });
    }
});

// DELETE /api/obras-sociales/:id - Elimina una obra social (solo admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const obraSocial = await ObraSocial.findByIdAndDelete(id);

        if (!obraSocial) {
            return res.status(404).json({ message: 'Obra social no encontrada' });
        }

        res.json({ message: 'Obra social eliminada exitosamente' });

    } catch (error) {
        console.error('Error al eliminar obra social:', error);
        res.status(500).json({ message: 'Error al eliminar obra social' });
    }
});

module.exports = router;