const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

module.exports.getMyLeaves = async (req, res) => {
  try {
    const { userId, treeId, plot_id } = req.params;

    const allLeaves = [];
    let lastDocumentId = null;
    let hasMore = true;
    const limit = 10;

    while (hasMore) {
      const queries = [
        Query.and([
          Query.equal("user_id", userId),
          Query.equal("plot_id", plot_id),
          Query.equal("tree_id", treeId),
        ]),
        Query.limit(limit),
      ];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await database.listDocuments(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_LEAF_COLLECTION_ID}`,
        queries
      );

      allLeaves.push(...response.documents);

      if (response.documents.length < limit) {
        hasMore = false; // No more chat rooms to fetch
      } else {
        lastDocumentId = response.documents[response.documents.length - 1].$id;
      }
    }

    if (response.documents.length === 0) {
      return res.status(200).json([]);
    }

    const leaves = allLeaves.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      user_id: doc.user_id,
      status: doc.status,
      image_leaf: doc.image_leaf,
      confidence: doc.confidence,
      tree_id: doc.tree_id,
      plot_id: doc.plot_id,
    }));

    return res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);

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
