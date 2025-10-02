const { database } = require("../../lib/appwrite");

module.exports.endisable = async (req, res) => {
  try {
    const { reportedId, status } = req.body;
    const stats = status.toLowerCase();

    const result = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      reportedId,
      {
        status: stats,
      }
    );

    if (!result) {
      return res.status(400).json({
        success: false,
        title: `${stats} user error`,
        message: "There is an error occured, please try again!",
      });
    }

    return res.status(200).json({
      success: true,
      message: `You have successfully ${stats} user.`,
      title: `${stats} user`,
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
