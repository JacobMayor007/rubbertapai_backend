const { database } = require("../../lib/appwrite");

module.exports.editPlot = async (req, res) => {
  try {
    const { id, newName, userId } = req.body;

    if (!id) {
      return res.status(401).json({
        success: false,
        title: "Lacking Data",
        message:
          "There is no plot you have chosen to update, please chose a plot",
      });
    }

    if (!newName) {
      return res.status(401).json({
        success: false,
        title: "Lacking Data",
        message: "There is no new name to update a plot",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        title: "Unauthorized",
        message: "You are not authorized to get this endpoint",
      });
    }

    const result = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_PLOT_COLLECTION_ID}`,
      id,
      {
        name: newName,
      },
      [`update("user:${userId}")`]
    );

    if (result) {
      return res.status(200).json({
        success: true,
        title: "Update Plot Successful",
        message: "You have successfully updated your plot.",
      });
    }
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
