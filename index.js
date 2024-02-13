//CARGAR LIBRERIAS
const mongoose = require('mongoose');
const express = require('express');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const methodOverride = require('method-override');
const session = require('express-session');

 


//ENRUTADORES
const Habitacion = require(__dirname + "/models/habitacion");
const Limpieza = require(__dirname + "/models/limpieza");
const habitaciones = require(__dirname + '/routes/habitaciones');
const limpiezas = require(__dirname + '/routes/limpiezas');
const auth = require(__dirname + '/routes/auth');


//CONEXIÓN BASE DE DATOS
mongoose.connect('mongodb://127.0.0.1:27017/hotel');

// CONEXIÓN DE MIDDLEWARE NECESARIO
let app = express();


// Configuramos motor Nunjucks
const env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

env.addFilter('date', dateFilter);

// Asignación del motor de plantillas
app.set('view engine', 'njk');
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //para formularios
// Configuración de la sesión
app.use(session({
  secret: '1234',
  resave: true,
  saveUninitialized: true,
  expires: new Date(Date.now() + (30 * 60 * 1000))
}));
// Middleware para procesar otras peticiones que no sean GET o POST
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  } 
}));
app.use(methodOverride('_method'));


app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));//enrutador de contenido estático para bootstrap
//para poder acceder a la sesión desde las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


app.use('/auth', auth);
app.use('/habitaciones',habitaciones);
app.use('/limpiezas',limpiezas);


// Ruta para redirigir a las habitaciones desde la raíz
app.get('/', (req, res) => {
  res.redirect('/habitaciones');
});



//Ya se ha guardado el usuario y ahora puedo hacer pruebas
// let user =
//     new Usuario({
//         login:"beatriz",
//         password:"1234567"
//     });
// user.save();

// let habitaciones = [
//     new Habitacion({
//         id: "1a1a1a1a1a1a1a1a1a1a1a1a",
//         numero: 1,
//         tipo: "doble",
//         descripcion: "Habitación doble, cama XL, terraza con vistas al mar",
//         ultimaLimpieza: new Date("2023-09-20T11:24:00Z"),
//         precio: 59.90,
//         incidencias: [
//             {id: "10011a1a1a1a1a1a1a1a1a1a",
//              descripcion: "No funciona el aire acondicionado",
//              fechaInicio: new Date("2023-09-19T18:12:54Z")},
//             {id: "10021a1a1a1a1a1a1a1a1a1a",
//              descripcion: "No funciona el interruptor del aseo",
//              fechaInicio: new Date("2023-09-20T10:15:06Z")}
//         ]
//     }),
//     new Habitacion({
//         id: "2b2b2b2b2b2b2b2b2b2b2b2b",
//         numero: 2,
//         tipo: "familiar",
//         descripcion: "Habitación familiar, cama XL y literas, aseo con bañera",
//         ultimaLimpieza: new Date("2023-08-02T10:35:15Z"),
//         precio: 65.45
//     }),
//     new Habitacion({
//         id: "3c3c3c3c3c3c3c3c3c3c3c3c",
//         numero: 3,
//         tipo: "familiar",
//         descripcion: "Habitación familiar, cama XL y sofá cama, cocina con nevera",
//         precio: 69.15
//     }),
//     new Habitacion({
//         id: "4d4d4d4d4d4d4d4d4d4d4d4d",
//         numero: 4,
//         tipo: "suite",
//         descripcion: "Habitación con dos camas XL, terraza y vistas al mar",
//         ultimaLimpieza: new Date("2023-10-10T12:05:10Z"),
//         precio: 110.20,
//         incidencias: [
//             {id: "10014d4d4d4d4d4d4d4d4d4d",
//              descripcion: "No funciona el jacuzzi",
//              fechaInicio: new Date("2023-10-08T19:24:43Z")}
//         ]
//     }),
//     new Habitacion({
//         id: "5e5e5e5e5e5e5e5e5e5e5e5e",
//         numero: 5,
//         tipo: "individual",
//         descripcion: "Habitación simple, cama 150",
//         precio: 34.65
//     })
// ];

// let limpiezas = [
//     new Limpieza({
//         _id: "20011a1a1a1a1a1a1a1a1a1a",
//         idHabitacion: "1a1a1a1a1a1a1a1a1a1a1a1a",
//         fechaHora: new Date("2023-09-18T10:59:12Z"),
//         observaciones: "Dejan toallas para cambiar"
//     }),
//     new Limpieza({
//         _id: "20021a1a1a1a1a1a1a1a1a1a",        
//         idHabitacion: "1a1a1a1a1a1a1a1a1a1a1a1a",
//         fechaHora: new Date("2023-09-20T11:24:00Z")
//     }),
//     new Limpieza({
//         _id: "20012b2b2b2b2b2b2b2b2b2b",
//         idHabitacion: "2b2b2b2b2b2b2b2b2b2b2b2b",
//         fechaHora: new Date("2023-08-02T10:35:15Z"),
//         observaciones: "Desperfectos en puerta del aseo"
//     }),
//     new Limpieza({
//         _id: "20013c3c3c3c3c3c3c3c3c3c",
//         idHabitacion: "3c3c3c3c3c3c3c3c3c3c3c3c"
//     }),
//     new Limpieza({
//         _id: "20014d4d4d4d4d4d4d4d4d4d",
//         idHabitacion: "4d4d4d4d4d4d4d4d4d4d4d4d",
//         fechaHora: new Date("2023-10-09T11:00:25Z")
//     }),
//     new Limpieza({
//         _id: "20024d4d4d4d4d4d4d4d4d4d",
//         idHabitacion: "4d4d4d4d4d4d4d4d4d4d4d4d",
//         fechaHora: new Date("2023-10-10T12:05:10Z")
//     }),
//     new Limpieza({
//         _id: "20015e5e5e5e5e5e5e5e5e5e",
//         idHabitacion: "5e5e5e5e5e5e5e5e5e5e5e5e"
//     }),
// ]

// habitaciones.forEach(h => h.save());
// limpiezas.forEach(l => l.save());


 //PUESTA EN MARCHA DEL SERVIDOR
app.listen(8080);