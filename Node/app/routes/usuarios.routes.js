module.exports = app => {
    const usuarios = require("../controllers/usuarios.controller.js");

    //Retrieve all Customers
    app.get("/usuarios", usuarios.findAll);

    //Retrieve a single Customer with customerId
    app.get("/usuarios/:usuariosId", usuarios.findOne);

    //Vaya vaya, met 
}