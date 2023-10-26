const express = require("express");
const router = express.Router();
const { Alunos, Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
    try {
        const { name, restriction, series } = req.body;
        const UserId = req.user.id;

        const aluno = await Alunos.create({
            name: name,
            restriction: restriction,
            series: series,
            UserId,
        });

        const user = await Users.findByPk(UserId, {
            attributes: ["username"],
        });

        const response = {
            message: "Aluno criado com sucesso",
            aluno: {
                id: aluno.id,
                name: aluno.name,
                restriction: aluno.restriction,
                series: aluno.series,
                UserId: aluno.UserId,
                updatedAt: aluno.updatedAt,
                createdAt: aluno.createdAt,
            },
            user: {
                username: user.username,
            },
        };

        res.json(response);
    } catch (error) {
        console.error("Erro ao criar um novo aluno:", error);
        res.status(500).json({ message: "Erro ao criar um novo aluno" });
    }
});


// Rota para buscar todos os alunos
router.get("/alunos", async (req, res) => {
    try {
        // Busque todos os alunos no banco de dados
        const alunos = await Alunos.findAll();

        res.json({ message: "Alunos encontrados com sucesso", alunos });
    } catch (error) {
        console.error("Erro ao buscar todos os alunos:", error);
        res.status(500).json({ message: "Erro ao buscar todos os alunos" });
    }
});

  
module.exports = router;


