const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

//Create connection to the database
const connection = mysql.createConnection({

    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB

});

//open the MYSQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("De locos, conectado");
});

module.exports = connection;