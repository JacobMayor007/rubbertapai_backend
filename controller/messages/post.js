const { Query } = require("node-appwrite");
const { ID, database } = require("../../lib/appwrite");

module.exports.sentMessages = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    const existingChats = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_CHAT_COLLECTION_ID}`,
      [
        Query.or([
          Query.and([
            Query.equal("senderId", req.body.userId),
            Query.equal("receiverId", req.body.receiver_id),
          ]),
          Query.and([
            Query.equal("senderId", req.body.receiver_id),
            Query.equal("receiverId", req.body.userId),
          ]),
        ]),
      ]
    );

    const chatRoomID = existingChats.documents[0]?.$id;

    if (existingChats.total === 0) {
      await database.createDocument(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_CHAT_COLLECTION_ID}`,
        ID.unique(),
        {
          participants: [data.userId, data.receiver_id],
          participants_profile: [data.senderProfile, data.receiverProfile],
          participants_username: [data.senderName, data.receiverName],
          lastMessage: data.lastMessage,
          senderId: data.userId,
          receiverId: data.receiver_id,
        },
        [`write("user:${data.userId}")`]
      );
    } else {
      await database.updateDocument(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_CHAT_COLLECTION_ID}`,
        chatRoomID,
        {
          lastMessage: data.lastMessage,
          senderId: data.userId,
          receiverId: data.receiver_id,
        },
        [`write("user:${data.userId}")`]
      );
    }

    await database.createDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_MESS_COLLECTION_ID}`,
      ID.unique(),
      {
        product_id: "",
        content: data.lastMessage,
        sender_id: data.userId,
        receiver_id: data.receiver_id,
        imageUrl: data?.fileUrl || "",
      },
      [`write("user:${data.userId}")`]
    );

    return res.status(200);
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
