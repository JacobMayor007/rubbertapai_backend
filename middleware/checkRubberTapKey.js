const checkRubberTapApiKey = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key" });
  }

  try {
    if (apiKey !== `${process.env.RUBBERTAPAI_API_KEY}`) {
      return res
        .status(403)
        .json({ error: "", message: "It does not equal to API Key" });
    }

    next();
  } catch (error) {
    console.error("Error checking API key:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { checkRubberTapApiKey };
