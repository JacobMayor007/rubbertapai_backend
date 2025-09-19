const { database, ID } = require("../../lib/appwrite");

module.exports.saveTrees = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.userId) {
      return res.status(204).json({
        status: "Saving error",
        message: "No user, please logged in first to save your trees.",
      });
    }

    const response = await database.createDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_TREE_COLLECTION_ID}`,
      ID.unique(),
      {
        plot_id: data.plot_id,
        user_id: data.userId,
      },
      [`write("user:${data.userId}")`]
    );

    if (!response) {
      console.log(response);
      return res.status(404).json({
        title: "Error Occured",
        message: "There is an error occured. Please try again.",
      });
    }

    console.log(data);

    return res.status(200).json({
      title: "Successful",
      message: `Successfully Saved The Tree `,
    });
  } catch (error) {
    console.error(error);
    // Handle specific Appwrite errors
    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Tree collection not found",
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
