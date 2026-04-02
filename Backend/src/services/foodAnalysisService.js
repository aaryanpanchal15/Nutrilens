const httpClient = require("./httpClient");
const { analysisApiUrl, analysisApiKey } = require("../config/env");

async function fetchProductByBarcode(barcode) {
  const response = await httpClient.get(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`
  );

  if (!response.data || response.data.status !== 1) {
    const error = new Error("Product not found for the provided barcode.");
    error.statusCode = 404;
    throw error;
  }

  const product = response.data.product;

  return {
    barcode,
    name: product.product_name || null,
    brand: product.brands || null,
    ingredientsText: product.ingredients_text || null,
    nutritionGrade: product.nutriscore_grade || null,
    imageUrl: product.image_url || null
  };
}

async function analyzeIngredientList(ingredients) {
  const normalizedIngredients = Array.isArray(ingredients)
    ? ingredients.join(", ")
    : ingredients;

  if (analysisApiUrl) {
    const response = await httpClient.post(
      analysisApiUrl,
      { ingredients: normalizedIngredients },
      {
        headers: analysisApiKey
          ? {
              Authorization: `Bearer ${analysisApiKey}`
            }
          : {}
      }
    );

    return response.data;
  }

  return buildFallbackAnalysis(normalizedIngredients);
}

function buildFallbackAnalysis(ingredientsText) {
  const ingredientList = ingredientsText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const flaggedIngredients = ingredientList.filter((item) =>
    /sugar|corn syrup|preservative|artificial|flavor|color/i.test(item)
  );

  return {
    ingredients: ingredientList,
    summary:
      "No external analysis API is configured, so this response uses a simple built-in ingredient review.",
    flaggedIngredients,
    riskLevel:
      flaggedIngredients.length >= 3 ? "high" : flaggedIngredients.length > 0 ? "medium" : "low"
  };
}

module.exports = {
  fetchProductByBarcode,
  analyzeIngredientList
};
