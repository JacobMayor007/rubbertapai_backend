const { ID, database } = require("../../lib/appwrite");

module.exports.saveLeavesToTrees = async (req, res) => {
  try {
    const data = { ...req.body };

    console.log(data);

    if (!data.userId) {
      return res.status(200).json({
        status: "Error",
        message:
          "The application did not detect any users. Please logged in first.",
      });
    }

    if (!data.plot_id) {
      return res.status(200).json({
        status: "Error",
        message: "The application did not detect any plots.",
      });
    }

    const plot_response = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_PLOT_COLLECTION_ID}`,
      data.plot_id,
      {
        image_plot: data.fileUrl,
      },
      [`write("user:${data.userId}")`]
    );

    if (!plot_response) {
      return res.status(400).json({
        status: "Error",
        message: "There was having an issue of saving it on the plot.",
      });
    }

    const tree_response = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_TREE_COLLECTION_ID}`,
      data.tree_id,
      {
        user_id: data.userId,
        image_url: data.fileUrl,
        status: data.status,
      },
      [`write("user:${data.userId}")`]
    );

    if (!tree_response) {
      return res.status(400).json({
        status: "Error",
        message: "There was having an issue of saving it on the Tree.",
      });
    }

    const leaf_response = await database.createDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_LEAF_COLLECTION_ID}`,
      ID.unique(),
      {
        plot_id: data.plot_id,
        user_id: data.userId,
        tree_id: data.tree_id,
        image_leaf: data.fileUrl,
        status: data.status,
        confidence: Number(data.confidence),
      },
      [`write("user:${data.userId}")`]
    );

    if (!leaf_response) {
      return res.status(400).json({
        status: "Error",
        message: "There is an error in saving the leaves",
      });
    }

    console.log("Successful post request leaf - tree - plot✅");

    return res.status(200).json({
      status: "Successful",
      title: "Successfully Saved leaves to tree",
      message: "Successfully saving leaves to the Tree",
    });
  } catch (error) {
    console.error("Error fetching tree:", error);

    // Handle specific Appwrite errors
    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Tree documents not found",
      });
    }

    if (error.code === 401) {
      return res.status(401).json({
        message: "Unathorized user to query this tree",
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
