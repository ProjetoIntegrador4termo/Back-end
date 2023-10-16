const express = require("express");
const router = express.Router();
const { Alunos } = require("../models");

router.post("/", async(req, res) => {
    const { name, restriction, series } = req.body;
    Alunos.create({
        name: name,
        restriction: restriction,
        series: series
    });
    res.json("SUCCESS");
});

module.exports = router;