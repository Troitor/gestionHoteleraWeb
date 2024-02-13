const mongoose = require('mongoose');

//ESQUEMA LIMPIEZA
let limpiezaSchema = new mongoose.Schema({
    idHabitacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'habitaciones',
        required: [true , 'La habitación es obligatoria'],       
    },
    fechaHora: {
        type: Date,       
        required: [true , 'La fecha es obligatoria'],
        default: Date.now()
    },
    observaciones: {
        type: String,
        trim: true,
        required: [false, 'Las observaciones son obligatorias'],       
    },   
   
});


const Limpieza = mongoose.model('limpiezas', limpiezaSchema);
module.exports = Limpieza;

