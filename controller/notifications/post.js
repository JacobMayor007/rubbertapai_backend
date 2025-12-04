const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

module.exports.getMyNotifications = async (req, res) => {
  try {
    const { userId } = req.body;

    let hasMore = true;
    let lastDocumentId = null;
    const allNotifs = [];
    const limit = 25;

    while (hasMore) {
      const queries = [Query.equal("receiverId", userId), Query.limit(limit)];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await database.listDocuments(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_NOTIF_COLLECTION_ID}`,
        queries
      );

      if (!response) {
        return res.status(200).json({
          documents: [],
        });
      }

      console.log(response.documents[0].$id);

      allNotifs.push(...response.documents);

      if (response.documents.length < limit) {
        hasMore = false;
      } else {
        lastDocumentId = response.documents[response.documents.length - 1].$id;
      }
    }

    if (allNotifs.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(allNotifs);
  } catch (error) {
    console.error("Error fetching user:", error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User not found",
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
