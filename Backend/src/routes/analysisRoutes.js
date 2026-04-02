const express = require("express");

const {
  scanFoodByBarcode,
  analyzeIngredients
} = require("../controllers/analysisController");

const router = express.Router();

router.post("/scan", scanFoodByBarcode);
router.post("/analyze", analyzeIngredients);

module.exports = router;
