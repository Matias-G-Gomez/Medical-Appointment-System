// Carga turnos de demostración con datos inventados.
// Borra TODOS los turnos existentes y crea turnos de prueba en los próximos días hábiles.
// Uso: node initDemo.js


require('dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const Cita = require('./models/Cita');


const pacientes = [
  ['Lucía', 'Fernández'], ['Martín', 'Rodríguez'], ['Sofía', 'López'], ['Juan', 'Pérez'],
  ['Valentina', 'Díaz'], ['Tomás', 'Romero'], ['Camila', 'Sosa'], ['Nicolás', 'Torres'],
  ['Florencia', 'Ruiz'], ['Agustín', 'Álvarez'], ['Micaela', 'Benítez'], ['Federico', 'Acosta'],
];
const motivos = ['Traumatología Deportiva', 'Cirugía Ortopédica', 'Artroscopía', 'Prótesis Articulares'];
const obras = ['OSDE', 'Swiss Medical', 'Galeno', 'Medicus', 'IOMA', 'PAMI', 'Particular'];
const horas = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
const estados = ['pendiente', 'pendiente', 'pendiente', 'confirmada', 'confirmada', 'cancelada'];

// Próximos días hábiles a partir de mañana, en formato AAAA-MM-DD
const diasHabiles = (cantidad) => {
  const dias = [];
  const d = new Date();
  while (dias.length < cantidad) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) dias.push(d.toISOString().slice(0, 10));
  }
  return dias;
};

const quitarTildes = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const crearTurnos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const dias = diasHabiles(10);

    const turnos = pacientes.map(([nombre, apellido], i) => ({
      nombre,
      apellido,
      telefono: `+54 11 5555-${String(1000 + i * 37).padStart(4, '0')}`,
      correoElectronico: `${quitarTildes(nombre)}.${quitarTildes(apellido)}@ejemplo.com`,
      obraSocial: obras[i % obras.length],
      motivo: motivos[i % motivos.length],
      fecha: dias[i % dias.length],
      hora: horas[(i * 3) % horas.length],
      estado: estados[i % estados.length],
    }));

    const borrados = await Cita.deleteMany({});
    await Cita.insertMany(turnos);
    console.log(`Se borraron ${borrados.deletedCount} turnos y se cargaron ${turnos.length} turnos de demostración.`);
  } catch (error) {
    console.error('Error al cargar los turnos de demostración:', error);
  } finally {
    await mongoose.disconnect();
  }
};

crearTurnos();
