const express = require("express");
const router = express.Router();
const { Alunos } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Rota para criar um novo aluno
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

        res.json({ message: "Aluno criado com sucesso", aluno });
    } catch (error) {
        console.error("Erro ao criar um novo aluno:", error);
        res.status(500).json({ message: "Erro ao criar um novo aluno" });
    }
});

module.exports = router;
