module.exports.rubberPrice = async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.COMMODITY_PRICE_ENDPOINT}/commodity_prices?key=${process.env.COMMODITY_PRICE_API_KEY}&name=rubber`
    );

    const data = await response.json();

    return res.status(200).json(data.result.output[0]);
  } catch (error) {
    console.error("Error fetching user:", error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "API endpoint not found",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
