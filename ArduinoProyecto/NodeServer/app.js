//app.js

//Import al the required things to the node server
//Express
const express = require('express');
const app = express();
//Port
const port = process.env.PORT || 3000;
//Server
const server = app.listen(port, function () { console.log("Servidor Node Express en el puerto: " + port); })
//SocketIO - Open Connection
const socketIO = require("socket.io");
const io = socketIO(server);
//Cors - Auth
const cors = require("cors");
//Axios - Request
const axios = require('axios');
//NodeMailer - Mails
const nodeMailer = require("nodemailer");
//information from the email that sends emails
const main_Email = 'nodeMailGenerator@gmail.com';
const main_Pass = 'guTdtFg4';
//
var path = require('path');
//Mysql - Database
var mysql = require('mysql');
var con = mysql.createConnection({
    //How the app its on local and work with docker I can use the name that i have given to the container to call it and connect as host
    host: "mysql-container",
    user: "admin",
    password: "123",
    database: "Proyecto"
});

//start using express and cors
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//Make the conecction with the database
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql;

    //Interval to refresh the data every second, simulate real time
    setInterval(function () {
        //I do a get for every kind of data i have with sensors
        axios.get('http://84.121.186.190/temperature')
            .then(res => {
                const data = res.data;
                io.emit("temperatura", data);
                /* sql = "INSERT INTO temperatura_sensor_datos (valor, unidad_medida, sensor_id) VALUES (" + res.data.value + ",'" + res.data.unit + "','1')"; */
                sql = "UPDATE temperatura_sensor_datos SET valor = " + res.data.value + " WHERE sensor_id = 1 "
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Temperatura actualizada");
                });
            })
            .catch(err => {
                console.log('Error: ', err.message);
            });
        axios.get('http://84.121.186.190/humidity')
            .then(res => {
                const data = res.data;
                io.emit("humedad", data);
                sql = "UPDATE humedad_sensor_datos SET valor_ambiental = " + res.data.value + " WHERE sensor_id = 3 "
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Humedad Ambiental Actualizada");
                });
            })
            .catch(err => {
                console.log('Error: ', err.message);
            });
        axios.get('http://84.121.186.190/light')
            .then(res => {
                const data = res.data;
                io.emit("luz", data);
                sql = "UPDATE luz_sensor_datos SET valor = " + res.data.value + " WHERE sensor_id = 2 "
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Luz Actualizada");
                });
            })
            .catch(err => {
                console.log('Error: ', err.message);
            });
        axios.get('http://84.121.186.190/flow')
            .then(res => {
                const data = res.data;
                io.emit("flujo", data);
                sql = "UPDATE flujo_sensor_datos SET valor = " + res.data.value + " WHERE sensor_id = 4 "
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Flujo actualizado");
                });
            })
            .catch(err => {
                console.log('Error: ', err.message);
            });
        axios.get('http://84.121.186.190/earth_humidity')
            .then(res => {
                const data = res.data;
                io.emit("humedad_tierra", data);
                sql = "UPDATE humedad_sensor_datos SET valor_terrestre = " + res.data.value + " WHERE sensor_id = 3 "
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Humedad Terrestre actualizada");
                });
            })
            .catch(err => {
                console.log('Error: ', err.message);
            });
    }, 1500);

});

//I add the headers to the cors to avoid problems with auth
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Start webpage with data on public folder
app.use("/", express.static(__dirname + "/public"))

app.get('/vista_enviado', function(req, res){
    res.sendFile(path.join(__dirname, '/public', 'send.html'));
  });

//Using nodeMailer on /send sends an email to me
app.post("/send", (req, res) => {

    //Internal content for the email
    const output = `<p> you have a new contact <p>
         <h3> Message Details </h3>
         <ul> <li> Name: ${req.body.name} </li>
         <li> Email: ${req.body.email} </li>
         <li> Message: ${req.body.message} </li> </ul>`;

    //Information for the connection 
    const transporter = nodeMailer.createTransport({
        service: "Gmail",
        port: 587,
        secure: false,
        auth: {
            user: main_Email,
            pass: main_Pass
        }
    });

    //Options for the email
    let mailOptions = {
        from: '"Nodemailer Contact" <nodeMailGenerator@gmail.com>',
        to: 'christianyepesgomez@gmail.com',
        subject: 'Nueva Sugerencia',
        text: 'Hellow World',
        //Adding previous output created
        html: output
    }

    //Sends the email with NodeMailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log()
    });
    res.redirect('/vista_enviado');
});



//Start io connection
io.on("connection", function (socket) {
    console.log("Nuevo cliente conectado");
});




