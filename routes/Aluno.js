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

router.get("/cadastrados", validateToken, async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const alunos = await Alunos.findAll({
      where: {
        UserId: usuarioId,
      },
    });

    res.json({ message: "Alunos cadastrados pelo usuário encontrados com sucesso", alunos });
  } catch (error) {
    console.error("Erro ao buscar alunos cadastrados pelo usuário:", error);
    res.status(500).json({ message: "Erro ao buscar alunos cadastrados pelo usuário" });
  }
});


router.put("/editar/:id", validateToken, async (req, res) => {
  try {
    const alunoId = req.params.id;
    const { name, restriction, series } = req.body;
    const userId = req.user.id; // ID do usuário logado

    // Verifique se o aluno com o ID especificado pertence ao usuário logado
    const aluno = await Alunos.findOne({
      where: {
        id: alunoId,
        UserId: userId,
      },
    });

    if (!aluno) {
      return res.status(403).json({ error: "Você não tem permissão para editar este aluno." });
    }

    await Alunos.update(
      {
        name,
        restriction,
        series,
      },
      {
        where: { id: alunoId },
      }
    );

    res.json({ message: "Aluno atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao editar aluno:", error);
    res.status(500).json({ error: "Erro ao editar aluno" });
  }
});

router.get("/aluno/:id", validateToken, async (req, res) => {
  try {
    const alunoId = req.params.id;
    const userId = req.user.id;

    const aluno = await Alunos.findOne({
      where: {
        id: alunoId,
        UserId: userId,
      },
    });

    if (!aluno) {
      return res.status(403).json({ error: "Você não tem permissão para acessar este aluno." });
    }

    res.json({ message: "Aluno encontrado com sucesso", aluno });
  } catch (error) {
    console.error("Erro ao buscar aluno por ID:", error);
    res.status(500).json({ error: "Erro ao buscar aluno por ID" });
  }
});

router.delete("/excluir/:id", validateToken, async (req, res) => {
  try {
    const alunoId = req.params.id;
    const userId = req.user.id;

    const aluno = await Alunos.findOne({
      where: {
        id: alunoId,
        UserId: userId,
      },
    });

    if (!aluno) {
      return res.status(403).json({ error: "Você não tem permissão para excluir este aluno." });
    }

    await Alunos.destroy({
      where: {
        id: alunoId,
      },
    });

    res.json({ message: "Aluno excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    res.status(500).json({ error: "Erro ao excluir aluno" });
  }
});

module.exports = router;


