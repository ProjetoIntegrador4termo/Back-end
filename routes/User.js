const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");
router.post("/", async (req, res) => {
    try {
      const { username, password, cpf, tipo } = req.body;
  
      const existingUser = await Users.findOne({ where: { cpf: cpf } });
      if (existingUser) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
  
      const hash = await bcrypt.hash(password, 10);
  
      await Users.create({
        username: username,
        password: hash,
        cpf: cpf,
        tipo: tipo,
      });
  
      res.json("SUCCESS");
    } catch (error) {
      console.error("Erro durante o processamento da solicitação:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
  

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Users.findOne({ where: { username: username } });

        if (!user) {
            res.json({ error: "Usuario não existe" });
            return;
        }

        bcrypt.compare(password, user.password).then(async (match) => {
            if (!match) {
                res.json({ error: "Senha incorreta" });
                return;
            }
            const accessToken = sign(
                { username: user.username, id: user.id, tipo: user.tipo },
                "importantsecret"
            );
            
            res.json({ token: accessToken, username: username, id: user.id });
        });
    } catch (error) {
        console.error("Erro durante a autenticação:", error);
        res.status(500).json({ error: "Erro durante a autenticação" });
    }
});


router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});


module.exports = router;