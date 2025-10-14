const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

module.exports.getChatRoom = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing userId parameter.",
      });
    }

    const allChatRooms = [];
    let lastDocumentId = null;
    let hasMore = true;
    const limit = 1;

    while (hasMore) {
      const queries = [
        Query.contains("participants", [userId]),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_CHAT_COLLECTION_ID,
        queries
      );

      allChatRooms.push(...response.documents);

      if (response.documents.length < limit) {
        hasMore = false; // No more chat rooms to fetch
      } else {
        lastDocumentId = response.documents[response.documents.length - 1].$id;
      }
    }

    const chatRooms = allChatRooms.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      participants: doc.participants || [],
      participants_profile: doc.participants_profile || [],
      participants_username: doc.participants_username || [],
      lastMessage: doc.lastMessage || null,
      senderId: doc.senderId || null,
      receiverId: doc.receiverId || null,
    }));

    return res.status(200).json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
