const express = require("express");

const consign = require("consign");

const bodyParser = require("body-parser");

const morgan = require("morgan");

const mongoose = require("mongoose");

const app = express();

const cors = require("cors");

const errors = require("./../src/utils/errors/errors");

const loadModels = require("./models")

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan("dev"));

mongoose.set("useCreateIndex", true);

loadModels()

app.use("/", require("./../src/routes/authenticate"))
app.use("/", require("./../src/routes/user"))
app.use("/", require("./../src/routes/tracker"))

app.use(errors.processErrors);

app.use((req, res, next) => {
    res.status(404).json({
        message: `msg: Nenhuma rota encontrada para ${req.path}`
    });
});

/* Extraindo variaveis de ambiente. */
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "./env/dev.env" });
}

/* Conecta com o banco de dados e lida com problemas de conexão */
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6

mongoose.connection.on("error", err => {
    console.log(`🙅 🚫 → ${err.message}`);
});

/* exportar o objeto app */
module.exports = app;
