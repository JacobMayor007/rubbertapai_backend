const { database } = require("../../lib/appwrite");

module.exports.getAllPayments = async (req, res) => {
  try {
    const getAllPayments = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_PAY_COLLECTION_ID}`
    );

    return res.status(200).json(getAllPayments.documents);
  } catch (error) {
    console.error("Error fetching products:", error);

    if (error.code === 404) {
      return res.status(404).json({
        status: "Make sure to logged in first",
        message: "",
      });
    }

    if (error.code === 400) {
      return res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: error.message,
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

module.exports.subscription = async (req, res) => {
  try {
    const {
      subscriptionType,
      period,
      price,
      benefit_1,
      benefit_2,
      userId,
      paymentMethod,
    } = req.params;

    return res.status(200).json({
      title: subscriptionType,
      message: period,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    if (error.code === 404) {
      return res.status(404).json({
        status: "Make sure to logged in first",
        message: "",
      });
    }

    if (error.code === 400) {
      return res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: error.message,
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
