const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

require("dotenv").config();

module.exports.getMyPlot = async (req, res) => {
  try {
    const { userId } = req.params;

    let hasMore = true;
    let lastDocumentId = null;
    const limit = 25;
    const allPlots = [];

    while (hasMore) {
      const queries = [Query.equal("user_id", userId), Query.limit(limit)];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await database.listDocuments(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_PLOT_COLLECTION_ID}`,
        queries
      );

      allPlots.push(...response.documents);

      if (response.documents.length < limit) {
        hasMore = false;
      } else {
        lastDocumentId = response.documents[response.documents.length - 1].$id;
      }
    }

    if (allPlots.length === 0) {
      return res.status(200).json([]);
    }

    const plots = allPlots.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      name: doc.name,
      user_id: doc.user_id,
      status: doc.status,
      image_plot: doc.image_plot,
    }));

    return res.status(200).json(plots);
  } catch (error) {
    console.error("Error fetching plot error:", error);

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
