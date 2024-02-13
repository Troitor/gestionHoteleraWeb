const mongoose = require('mongoose');

//ESQUEMA INCIDENCIAS
let incidenciasSchema = new mongoose.Schema({
    descripcionIncidencia: {
        type: String,
        trim: true, 
        required: true,       
    },
    fechaInicio: {
        type: Date,
        required: true,
        default: Date.now()
    },
    fechaFin: {
        type: Date, 
        required: false       
    },  
    imagen: {
        type: String,
        required: false,
    },  
});

//ESQUEMA HABITACIÓN
let habitacionSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: [true , 'El número de habitación es obligatorio'],
        min: [1 , 'El número de habitación no puede ser negativo'],
        max: [100 , 'El número de habitación no puede ser mayor a 100']
    },
    tipo: {
        type: String,
        enum: ['individual', 'doble', 'familiar', 'suite'],
        required: [true , 'El tipo de habitación es obligatorio'],
    },
    descripcion: {
        type: String,
        required: [true , 'La descripción es obligatoria'],
        minlength: 5
    },
    ultimaLimpieza: {
        type: Date,
        required: [true , 'La fecha de la ultima limpieza es obligatoria'],
        default: Date.now() //se establece por defecto la fecha actual
    },
    precio: {
        type: Number,
        required: [true , 'El precio es obligatorio'],
        min: [0 , 'El precio no puede ser negativo'],
        max: [250 , 'El precio no puede ser mayor a 250']
    },
    imagen: {
        type: String,
        required: false,
    },
    incidencias: [incidenciasSchema],
});


const Habitacion = mongoose.model('habitaciones', habitacionSchema);
module.exports = Habitacion;

