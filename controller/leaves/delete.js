const { database } = require("../../lib/appwrite");

module.exports.deleteTree = async (req, res) => {
  try {
    const { leaf_id } = req.params;
    if (!leaf_id) {
      return res.status(400).json({
        status: "Error",
        message: "There is no leaf, please make sure the plot is existing",
      });
    }

    await database.deleteDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_LEAF_COLLECTION_ID}`,
      leaf_id
    );

    return res.status(200).json({
      status: "Successful",
      message: "Successfully deleted a leaf!",
    });
  } catch (error) {
    console.error("Error fetching Leaf rooms:", error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Leaf collection not found",
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
