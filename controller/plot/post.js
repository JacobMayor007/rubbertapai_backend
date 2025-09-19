const { ID, database } = require("../../lib/appwrite");
require("dotenv").config();

module.exports.savePlot = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.userId) {
      return res.status(204).json({
        status: "Saving error",
        message: "No user, please logged in first to save your plots.",
      });
    }

    const response = await database.createDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_PLOT_COLLECTION_ID}`,
      ID.unique(),
      {
        user_id: data.userId,
        name: data.name,
      },
      [`write("user:${data.userId}")`]
    );

    if (!response) {
      console.log(response);

      return res.status(404);
    }

    console.log(data);

    return res.status(200).json({
      status: "Successful",
      message: `Successfully Saved The Plot ${data.name}`,
    });
  } catch (error) {
    console.error(error);
    // Handle specific Appwrite errors
    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Plot collection not found",
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
