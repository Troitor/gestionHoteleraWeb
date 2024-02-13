const express = require('express');
const { render } = require('nunjucks');


let Limpieza = require(__dirname + '/../models/limpieza');
let Habitacion = require(__dirname + '/../models/habitacion');
let autenticacion = require(__dirname + '/../utils/auth.js');

let router = express.Router();


//Listados de limpieza de la habitación indicada
router.get('/:id', (req, res) => {
    Limpieza.find({ idHabitacion: req.params['id'] }).sort({ fechaHora: -1 }).populate('idHabitacion').then(limpiezas => {
        if (limpiezas && limpiezas.length > 0) {
            res.render('limpiezas_listado', { limpiezas: limpiezas });
        } else {
            res.render('error', { error: "No existen limpiezas para esta habitación" });
        }
    }).catch(error => {
        res.render('error', { error: "Error obteniendo limpiezas" });
    });
});

router.get('/nueva/:id', autenticacion.autenticacion, (req, res) => {
    res.render('limpiezas_nueva');
})

// // Obtener el estado de limpieza actual de una habitación 
// router.get('/:id/estadolimpieza', (req, res) => {
//     Limpieza.findOne({ idHabitacion: req.params['id'] }).sort({ fechaHora: -1 })
//         .then(ultimaLimpieza => {
//             if (!ultimaLimpieza) {
//                 res.status(400).send({ error: "Error obteniendo estado de limpieza: No se encuentra la habitación" });
//             } else {
//                 const estadoLimpieza = ultimaLimpieza.fechaHora > new Date() ? "limpia" : "pendiente de limpieza";
//                 res.status(200).send({ limpiezas: estadoLimpieza });
//             }
//         })
//         .catch(error => {
//             res.status(400).send({ error: "Error obteniendo estado de limpieza" });
//         });
// });

//Modificamos el servicio POST para que recoja los datos del formulario
router.post('/limpiezas/:id', (req, res) => {
    const idHabitacion = req.params.id;
    const { fechaHora, observaciones } = req.body;

    // Crear y guardar la nueva limpieza
    const nuevaLimpieza = new Limpieza({
        idHabitacion: idHabitacion,
        fechaHora: fechaHora,
        observaciones: observaciones
    });

    nuevaLimpieza.save().then(limpiezaGuardada => {
        // Actualizar la fecha de última limpieza de la habitación con la fecha de la nueva limpieza
        Habitacion.findByIdAndUpdate(idHabitacion, { ultimaLimpieza: fechaHora }, { new: true }).then(habitacionActualizada => {
            // Redirigir a la página de limpiezas de la habitación con los datos actualizados
            res.render('limpiezas_listado', { limpiezas: habitacionActualizada.limpiezas });
        }).catch(error => {
            // Manejar errores al actualizar la habitación
            console.error(error);
            res.render('error', { error: 'Error actualizando la fecha de última limpieza de la habitación.' });
        });
    }).catch(error => {
        // Manejar errores al guardar la nueva limpieza
        console.error(error);
        res.render('error', { error: 'Error al registrar la nueva limpieza.' });
    });
});

module.exports = router;