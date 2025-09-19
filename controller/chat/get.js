const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");
module.exports.getChatRoom = async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_CHAT_COLLECTION_ID,
      [Query.contains("participants", [userId])]
    );

    if (response.documents.length === 0) {
      return res.status(200).json([]);
    }

    const chatRooms = response.documents.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      participants: doc.participants,
      participants_profile: doc.participants_profile,
      participants_username: doc.participants_username,
      lastMessage: doc.lastMessage,
      senderId: doc.senderId,
      receiverId: doc.receiverId,
    }));

    return res.status(200).json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);

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
