const express = require('express')
const app = express();
const port = 3000;

require("./app/routes/usuarios.routes.js")(app);

app.listen(port, () => {
    console.log("ejedcutandose")
})

