
//Middelware de autenticacion
let autenticacion = (req, res, next) => {
    if (req.session && req.session.usuario)
        return next();

    else
    res.redirect('/auth/login');
};
//middelware de rol para rutas protegidas
let rol = (rol) => {
    return (req, res, next) => {
        if (rol === req.session.rol)
            next();
        else
        res.redirect('/auth/login');
    }
};
module.exports = {
    autenticacion: autenticacion    
};