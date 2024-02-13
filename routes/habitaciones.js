const express = require('express');
const multer = require('multer');


let Habitacion = require(__dirname + '/../models/habitacion');
let Limpieza = require(__dirname + '/../models/limpieza');
let autenticacion = require(__dirname + '/../utils/auth.js');

let router = express.Router();




let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/habitaciones')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

let storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/incidencias')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

let upload = multer({ storage: storage });
let upload1 = multer({ storage: storage1 });


// servicio principal en la ruta raíz “/” para que redirija al listado de habitaciones.
router.get('/', autenticacion.autenticacion, (req, res) => {
    Habitacion.find().sort({ numero: 1 }).then(resultado => {
        res.render('habitaciones_listado', { habitaciones: resultado });
    }).catch(() => {
        res.render('error', { error: 'Error buscando habitación' });
        // Aquí podríamos renderizar una página de error
    });
});

router.get('/nueva', autenticacion.autenticacion, (req, res) => {
    res.render('habitaciones_nueva');
})

// Formulario de edición de habitación
router.get('/editar/:id', autenticacion.autenticacion, (req, res) => {
    Habitacion.findById(req.params['id']).then(resultado => {
        if (resultado) {
            res.render('habitaciones_editar', {habitacion: resultado});
        } else {
            res.render('error', {error: "Habitación no encontrada"});
        }
    }).catch(error => {
        res.render('error', {error: "habitación no encontrada"});
    });
});

// Servicio de listado por id
router.get('/:id',autenticacion.autenticacion, (req, res) => {
    Habitacion.findById(req.params['id']).then(resultado => {
        if (resultado)
            res.render('habitaciones_ficha', { habitacion: resultado });
        else
            res.render('error', { error: 'Habitación no encontrada' });
    }).catch(error => {
        res.status(400)
            .send({
                ok: false,
                error: "Error buscando la habitacion indicada"
            });
    });
});

// //Obtener detalles de una habitación específica
// router.get('/:id', (req, res) => {
//     Habitacion.findById(req.params['id']).then(resultado => {
//         res.status(200)
//             .send({ habitacion: resultado });
//     }).catch(error => {
//         res.status(400) //Fallo en la petición
//             .send({
//                 error: "No existe el número de habitación"
//             });
//     });
// });

// // Insertar una habitación
router.post('/', (req, res) => {
    let nuevaHabitacion = new Habitacion({
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        ultimaLimpieza: Date.now(),
        precio: req.body.precio,
        incidencias: {
            descripcion: req.body.descripcionIndencia,
            fechaInicio: Date.now(),
            fechaFin: Date.now(),
        },

    })
    nuevaHabitacion.save().then(resultado => {
        res.status(200)
            .send({ habitacion: resultado });
    }).catch(error => {
        res.status(400)
            .send({
                error: "Error insertando la habitación"
            });
    });
});

router.post('/', autenticacion.autenticacion, upload.single('imagen'), (req, res) => {
    let nuevaHabitacion = new Habitacion({
        numero: req.body.numero,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        ultimaLimpieza: Date.now(),
        precio: req.body.precio,
        incidencias: {
            descripcion: req.body.descripcionIndencia,
            fechaInicio: Date.now(),
            fechaFin: Date.now(),
        },

    })
    if (req.file)
        nuevaHabitacion.imagen = req.file.filename;

    nuevaHabitacion.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        let errores = {};
        let mensaje = 'Error añadiendo habitación';

        if (error.errors) {
            errores.general = 'Error de validación';
            if (error.errors.numero) {
                errores.numero = error.errors.numero.message;
            }
            if (error.errors.tipo) {
                errores.tipo = error.errors.tipo.message;
            }
            if (error.errors.descripcion) {
                errores.descripcion = error.errors.descripcion.message;
            }
            if (error.errors.precio) {
                errores.precio = error.errors.precio.message;
            }
        } else {
            errores.general = mensaje;
        }

        res.render('habitaciones_nueva', { errores: errores });
    });
});



// Actualizar los datos de una habitación
router.put('/:id', upload.single('imagen'),(req, res) => {
    Habitacion.findByIdAndUpdate(req.params.id, {
        $set: {
            numero: req.body.numero,
            tipo: req.body.tipo,
            descripcion: req.body.descripcion,
            ultimaLimpieza: Date.now(),
            precio: req.body.precio,
            incidencias: {
                descripcion: req.body.descripcionIndencia,
                fechaInicio: Date.now(),
                fechaFin: Date.now(),
            },
            imagen: req.file.imagen
        }
    }, { new: true })
        .then(resultado => {
            if (resultado) {
                res.render('habitaciones_listado'),({ habitacion: resultado });
            } else {
                res.status(400).send({ error: 'Habitación no encontrada' });
            }
        })
        .catch(error => {
            res.status(400).send({ error: 'Error actualizando los datos de la habitación' });
        });
});

// Eliminar una habitación
// router.delete('/:id',autenticacion.autenticacion, (req, res) => {
//     Habitacion.findByIdAndRemove(req.params.id)
//         .then(resultado => {
//             if (resultado) {
//                 res.status(200).send({ habitacion: resultado });
//             } else {
//                 res.status(400).send({ error: 'Habitación no encontrada' });
//             }
//         })
//         .catch(error => {
//             res.status(400).send({ error: 'Error eliminando la habitación' });
//         });
// });

router.delete('/:id',autenticacion.autenticacion, (req, res) => {
    Habitacion.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', { error: "Error borrando habitación" });
    });
});

//Añadir una incidencia en una habitación
router.post('/:id/incidencias', autenticacion.autenticacion, (req, res) => {
    Habitacion.findByIdAndUpdate(req.params.id, {
        $push: { incidencias: { descripcionIncidencia: req.body.descripcionIncidencia, fechaInicio: Date.now() } }
    }, { new: true })
        .then(resultado => {
            if (resultado) {
                res.status(200).send({ habitacion: resultado });
            } else {
                res.status(400).send({ error: 'Habitación no encontrada' });
            }
        })
        .catch(error => {
            res.status(400).send({ error: 'Error añadiendo la incidencia' });
        });
});

router.post('/:idHabitacion/incidencias', autenticacion.autenticacion, upload1.single('imagen'), async (req, res) => {
    try {
        const habitacion = await Habitacion.findById(req.params.idHabitacion);
        if (!habitacion) {
            return res.status(404).send({ error: 'Habitación no encontrada' });
        }

        const nuevaIncidencia = {
            descripcion: req.body.descripcion,
            fechaInicio: new Date(),
            imagen: req.file ? req.file.path : undefined
        };

        habitacion.incidencias.push(nuevaIncidencia);
        await habitacion.save();

        res.redirect('habitaciones_ficha', { habitacion: habitacion });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al añadir la incidencia' });
    }
});
// Actualizar el estado de una incidencia de una habitación
router.put('/:idH/incidencias/:idI', async (req, res) => {
    try {
        const habitacion = await Habitacion.findById(req.params.idH);
        if (!habitacion) {
            return res.status(400).send({ error: 'Habitación no encontrada' });
        }

        const incidencia = habitacion.incidencias.id(req.params.idI);
        if (!incidencia) {
            return res.status(400).send({ error: 'Incidencia no encontrada' });
        }

        incidencia.fechaFin = new Date();
        await habitacion.save();
        res.status(200).send({ habitacion: habitacion });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error actualizando la incidencia' });
    }
});

// Ruta para cerrar incidencia
router.put('/incidencias/cerrar/:habitacionId/:incidenciaId', async (req, res) => {
    try {
        // Buscar la habitación por ID
        const habitacion = await Habitacion.findById(req.params.habitacionId);

        if (!habitacion) {
            return res.status(404).send('Habitación no encontrada');
        }

        // Encontrar la incidencia específica en la habitación
        const incidencia = habitacion.incidencias.id(req.params.incidenciaId);

        if (!incidencia) {
            return res.status(404).send('Incidencia no encontrada');
        }

        // Asignar la fecha actual como fecha de cierre de la incidencia
        incidencia.fechaFin = new Date();

        // Guardar la habitación con la incidencia actualizada
        await habitacion.save();

        // Redirigir a la ficha de la habitación
        res.render('habitaciones_ficha', { habitacion: habitacion });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al cerrar la incidencia');
    }
});
// //Actualizar ultimaLimpieza de una habitación
// router.put('/:id/ultimalimpieza', (req, res) => {
//     // Obtener la fecha y hora de la última limpieza para esa habitación
//     Limpieza.findOne({ idHabitacion: req.params.id })
//         .sort({ fechaHora: -1 }) // Ordenar por fechaHora descendente para obtener la última limpieza
//         .then(ultimaLimpieza => {
//             if (ultimaLimpieza) {
//                 // Actualizar el campo ultimaLimpieza de la habitación con la fecha y hora de la última limpieza
//                 Habitacion.findByIdAndUpdate(req.params.id, {
//                     $set: { ultimaLimpieza: ultimaLimpieza.fechaHora }
//                 }, { new: true })
//                     .then(resultado => {
//                         res.status(200)
//                             .send({ habitacion: resultado });
//                     })
//                     .catch(error => {
//                         res.status(400)
//                             .send({ error: 'Error actualizando limpieza' });
//                     });
//             } else {
//                 res.status(400)
//                     .send({ error: 'No hay limpiezas registradas para esta habitación' });
//             }
//         })
//         .catch(error => {
//             res.status(400)
//                 .send({ error: 'Error obteniendo la última limpieza' });
//         });
// });

// Actualizar TODAS las últimas limpiezas
router.put('/ultimaLimpieza', (req, res) => {
    Limpieza.updateMany({}, {
        $set: { fechaHora: Date.now() }
    }, { new: true }).sort({ fechaHora: 1 })
        .then(resultado => {
            res.status(200).send({ habitacion: resultado });
        })
        .catch(error => {
            res.status(400).send({ error: 'Error actualizando las últimas limpiezas' });
        });
});

module.exports = router;