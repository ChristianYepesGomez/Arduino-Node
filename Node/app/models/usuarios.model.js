const sql = require("./db.js");

const Usuario = function (usuario) {
    this.email = usuario.email;
    this.name = usuario.name;
    this.password = usuario.password;
};

Usuario.getAll = result => {
    sql.query("SELECT * FROM usuarios", (err, res) => {
        if (err) {
            console.log("Error: ", err);
            result(null, err);
            return;
        }
        console.log("Usuarios: ", res);
        result(null, res);
    });
}

Usuario.findById = (usuarioId, result) => {

    sql.query(`SELECT * FROM usuarios WHERE id = ${usuarioId}`, (err, res) => {

        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.lenght) {
            console.log("Usuario encontrado: ", res[0]);
            result(null, res[0]);
            return;
        }
        //not found Usuario with the id
        result({ kind: "not found" }, null);
    });

};

module.exports = Usuario;