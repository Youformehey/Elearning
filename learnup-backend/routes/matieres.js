const express = require("express");
const router = express.Router();
const { getAllMatieres, createMatiere } = require("../controllers/matiereController");

router.get("/",  getAllMatieres);
router.post("/", createMatiere);

module.exports = router;
