require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(require("./routes/index"));

//Conexion a mongodb
mongoose
  .connect("mongodb://localhost:27017/chakrashop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch(() => {
    console.log("Ocurrio un error al conectarse a la base de datos");
  });

app.listen(process.env.PORT, () => {
  console.log("Servidor escuchando en el puerto " + process.env.PORT);
});
