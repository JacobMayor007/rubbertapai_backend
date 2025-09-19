const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

require("dotenv").config();

module.exports.getMyTrees = async (req, res) => {
  try {
    const { userId, plotId } = req.params;

    console.log(req.params);

    const response = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_TREE_COLLECTION_ID}`,
      [
        Query.and([
          Query.equal("user_id", userId),
          Query.equal("plot_id", plotId),
        ]),
      ]
    );

    if (response.documents.length === 0) {
      console.log(response.documents.length);

      return res.status(200).json([]);
    }

    const trees = response.documents.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      plot_id: doc.plot_id,
      user_id: doc.user_id,
      status: doc.status,
      image_url: doc.image_url,
    }));

    return res.status(200).json(trees);

    
  } catch (error) {
    console.error("Error fetching tree error:", error);

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

module.exports.MyTrees = async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_TREE_COLLECTION_ID}`,
      [Query.equal("user_id", userId)]
    );

    if (response.documents.length === 0) {
      console.log(response.documents.length);

      return res.status(200).json([]);
    }

    const trees = response.documents.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      plot_id: doc.plot_id,
      user_id: doc.user_id,
      status: doc.status,
      image_url: doc.image_plot,
    }));

    return res.status(200).json(trees);
  } catch (error) {
    console.error("Error fetching tree error:", error);

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
