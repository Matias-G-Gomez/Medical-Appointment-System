const express = require('express');
const nodemailer = require('nodemailer');
const Cita = require('../models/Cita');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Configura transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// GET /api/citas - Obtiene todas las citas (requiere login)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const citas = await Cita.find().sort({ fechaSolicitud: -1 });
        res.json(citas);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ message: 'Error al obtener citas' });
    }
});

// POST /api/citas - Crea una nueva cita (público, no requiere login)
router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, telefono, correoElectronico, obraSocial, motivo, fecha, hora } = req.body;

        // Valida campos obligatorios
        if (!nombre || !apellido || !telefono || !correoElectronico || !obraSocial || !motivo || !fecha || !hora) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verifica si ya existe una cita confirmada O pendiente en ese horario
        const citaExistente = await Cita.findOne({
            fecha,
            hora,
            estado: { $in: ['confirmada', 'pendiente'] }
        });

        if (citaExistente) {
            return res.status(400).json({ message: 'El horario ya está ocupado' });
        }

        // Crea la cita
        const nuevaCita = new Cita({
            nombre,
            apellido,
            telefono,
            correoElectronico,
            obraSocial,
            motivo,
            fecha,
            hora
        });

        await nuevaCita.save();

        res.status(201).json({
            message: 'Cita creada exitosamente',
            cita: nuevaCita
        });

    } catch (error) {
        console.error('Error al crear cita:', error);
        res.status(500).json({ message: 'Error al crear cita' });
    }
});

// PUT /api/citas/:id/estado - Actualiza estado de una cita (requiere login)
router.put('/:id/estado', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Valida estado
        if (!['pendiente', 'confirmada', 'cancelada'].includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }

        // Busca la cita antes de actualizar
        const cita = await Cita.findById(id);

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        // Actualiza estado
        cita.estado = estado;
        await cita.save();

        // Enviar emails según el estado
        if (estado === 'confirmada') {
            // Email de confirmación
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: cita.correoElectronico,
                subject: 'Confirmación de Cita - Dr. Marcos Gómez',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #1e3a8a;">¡Cita Confirmada!</h2>
                        <p>Estimado/a <strong>${cita.nombre} ${cita.apellido}</strong>,</p>
                        <p>Su cita ha sido <strong>confirmada</strong> con los siguientes detalles:</p>
                        <ul>
                            <li><strong>Fecha:</strong> ${cita.fecha}</li>
                            <li><strong>Hora:</strong> ${cita.hora}</li>
                            <li><strong>Motivo:</strong> ${cita.motivo}</li>
                        </ul>
                        <p>Ubicación: Tte. Gral. Juan Domingo Perón 4190, CABA</p>
                        <p>Teléfono: +54 11 4959-0200</p>
                        <hr>
                        <p style="color: #6b7280; font-size: 12px;">
                            Si necesita cancelar o reprogramar, por favor contacte con nosotros.
                        </p>
                        <p style="color: #6b7280; font-size: 12px;">
                            Dr. Marcos Gómez - Traumatología y Ortopedia
                        </p>
                    </div>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`Email de confirmación enviado a ${cita.correoElectronico}`);
            } catch (emailError) {
                console.error('Error al enviar email de confirmación:', emailError);
            }
        } else if (estado === 'cancelada') {
            // Email de cancelación
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: cita.correoElectronico,
                subject: 'Cita Cancelada - Dr. Marcos Gómez',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #dc2626;">Cita Cancelada</h2>
                        <p>Estimado/a <strong>${cita.nombre} ${cita.apellido}</strong>,</p>
                        <p>Lamentamos informarle que su cita ha sido <strong>cancelada</strong>.</p>
                        <p>Si desea reagendar, puede solicitar una nueva cita a través de nuestra web o contactarnos:</p>
                        <p>Teléfono: +54 11 4959-0200</p>
                        <p>Email: consultas@drgomez.com.ar</p>
                        <hr>
                        <p style="color: #6b7280; font-size: 12px;">
                            Dr. Marcos Gómez - Traumatología y Ortopedia
                        </p>
                    </div>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`Email de cancelación enviado a ${cita.correoElectronico}`);
            } catch (emailError) {
                console.error('Error al enviar email de cancelación:', emailError);
            }
        }

        res.json({
            message: 'Estado actualizado exitosamente',
            cita
        });

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ message: 'Error al actualizar estado' });
    }
});

// GET /api/citas/disponibilidad - Verifica disponibilidad de horario (público)
router.get('/disponibilidad', async (req, res) => {
    try {
        const { fecha, hora } = req.query;

        if (!fecha || !hora) {
            return res.status(400).json({ message: 'Fecha y hora son requeridas' });
        }

        // Verifica si existe una cita confirmada O pendiente
        const citaExistente = await Cita.findOne({
            fecha,
            hora,
            estado: { $in: ['confirmada', 'pendiente'] }
        });

        res.json({
            disponible: !citaExistente
        });

    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        res.status(500).json({ message: 'Error al verificar disponibilidad' });
    }
});

module.exports = router;