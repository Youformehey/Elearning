const express = require("express");
const router = express.Router();

const { associateOldSeancesWithCourses } = require("../controllers/adminController"); // 👈 CORRECT

router.get("/associate-old-seances", associateOldSeancesWithCourses); // 👈 ROUTE

module.exports = router;
