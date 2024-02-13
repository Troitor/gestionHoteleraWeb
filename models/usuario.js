const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true , 'El login es obligatorio'],
        min: 4,  
        unique: [true , 'El login ya existe'],      
        trim: true
    },
    password: {
        type: String,
        required: [true , 'La password es obligatoria'],
        min: [7 , 'La password debe tener al menos 7 caracteres'],
        trim: true
    }
});

//Exportar el modelo de la colección de usuario
let Usuario = mongoose.model('usuarios', usuarioSchema);
module.exports = Usuario;