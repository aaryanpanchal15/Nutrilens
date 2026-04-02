const {
  fetchProductByBarcode,
  analyzeIngredientList
} = require("../services/foodAnalysisService");

async function scanFoodByBarcode(req, res, next) {
  try {
    const { barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({ error: "Barcode is required." });
    }

    const product = await fetchProductByBarcode(barcode);
    const { ingredientsText } = product;

    if (!ingredientsText) {
      return res.json({
        success: true,
        data: {
          product,
          analysis: null,
          message: "Product found, but no ingredients_text was available to analyze."
        }
      });
    }

    const analysis = await analyzeIngredientList(ingredientsText);

    return res.json({
      success: true,
      data: {
        product,
        analysis
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function analyzeIngredients(req, res, next) {
  try {
    const { ingredients } = req.body;

    if (!ingredients || (Array.isArray(ingredients) && ingredients.length === 0)) {
      return res.status(400).json({ error: "Ingredients are required." });
    }

    const analysis = await analyzeIngredientList(ingredients);

    return res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  scanFoodByBarcode,
  analyzeIngredients
};
