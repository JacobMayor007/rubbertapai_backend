const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

module.exports.updateRead = async (req, res) => {
  try {
    const { userId } = req.body;

    const response = await database.updateDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_NOTIF_COLLECTION_ID}`,
      {
        isRead: false,
      },
      [Query.equal("receiverId", userId)]
    );

    res.status(200).json(response.documents);
  } catch (error) {
    console.error(error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User collection not found, failed to register token",
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
