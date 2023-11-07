const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json())

const db = require("./models");

const authUser = require("./routes/User");
app.use("/auth", authUser);

const createAlunos = require("./routes/Aluno");
app.use("/aluno", createAlunos);

db.sequelize.sync().then(() => {
    app.listen(8080, () => {
        console.log("server rodando na porta 8080")
    })
})