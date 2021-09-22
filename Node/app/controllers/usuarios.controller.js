const Usuario = require("../models/usuarios.model.js");

//Retrieve all Usuarios from the database
exports.findAll = (req, res) => {
    Usuario.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving usuarios."
            });
        else res.send(data);
    })
};

//Find  a single Usuarios with a id
exports.findOne = (req, res) => {

    if (err) {

        if (err.kind === "nof_found") {
            res.status(404).send({
                message: `Not found Usuarios with id ${req.params.usuarioId}.`
            });
        } else {
            res.status(500).send({
                message: "Error retrieving Usuario with id" + req.params.usuarioId
            });
        }
    } else res.send(data);
};