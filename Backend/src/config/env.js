const port = process.env.PORT || 5000;

module.exports = {
  port,
  analysisApiUrl: process.env.ANALYSIS_API_URL || "",
  analysisApiKey: process.env.ANALYSIS_API_KEY || ""
};
