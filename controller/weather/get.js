require("dotenv").config();

module.exports.getCurrentWeather = async (req, res) => {
  try {
    const { city } = req.params;

    const response = await fetch(
      `${process.env.WEATHER_ENDPOINT}/current.json?key=${process.env.WEATHER_KEY}&q=${city}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
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

module.exports.getForecastWeather = async (req, res) => {
  try {
    const { city } = req.params;

    const response = await fetch(
      `${process.env.WEATHER_ENDPOINT}/forecast.json?key=${process.env.WEATHER_KEY}&q=${city}&days=7`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json(data);
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
