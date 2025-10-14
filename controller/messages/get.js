const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

require("dotenv").config();

module.exports.getSentMessages = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;

    const allMessages = [];
    let lastDocumentId = null;
    let hasMore = true;
    const limit = 25;

    while (hasMore) {
      const queries = [
        Query.equal("sender_id", userId),
        Query.equal("receiver_id", receiverId),
        Query.limit(limit),
      ];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await database.listDocuments(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_MESS_COLLECTION_ID}`,
        queries
      );

      allMessages.push(...response.documents);

      if (response.documents.length < limit) {
        hasMore = false;
      } else {
        lastDocumentId = response.documents[response.documents.length - 1].$id;
      }
    }

    const messages = allMessages.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      content: doc.content,
      product_id: doc.product_id,
      sender_id: doc.sender_id,
      receiver_id: doc.receiver_id,
      imageUrl: doc.imageUrl,
    }));

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching user messages:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports.getReceivedMessages = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;

    const allMessages = [];
    let lastDocumentId = null;
    let hasMore = true;
    const limit = 25;

    while (hasMore) {
      const queries = [
        Query.equal("sender_id", receiverId),
        Query.equal("receiver_id", userId),
        Query.limit(limit),
      ];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await database.listDocuments(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_MESS_COLLECTION_ID}`,
        queries
      );

      allMessages.push(...response.documents);

      if (response.documents.length < limit) {
        hasMore = false;
      } else {
        lastDocumentId = response.documents[response.documents.length - 1].$id;
      }
    }

    const messages = allMessages.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      product_id: doc.product_id,
      content: doc.content,
      sender_id: doc.sender_id,
      receiver_id: doc.receiver_id,
      imageUrl: doc.imageUrl,
    }));

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching received messages:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports.getConversationMessages = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;

    const response = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_MESS_COLLECTION_ID,
      [
        Query.or([
          Query.and([
            Query.equal("sender_id", userId),
            Query.equal("receiver_id", receiverId),
          ]),
          Query.and([
            Query.equal("sender_id", receiverId),
            Query.equal("receiver_id", userId),
          ]),
        ]),
        Query.orderAsc("$createdAt"), // Ensures oldest → newest order
      ]
    );

    const messages = response.documents.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      content: doc.content,
      product_id: doc.product_id,
      sender_id: doc.sender_id,
      receiver_id: doc.receiver_id,
      imageUrl: doc.imageUrl,
    }));

    res.status(200).json({
      success: true,
      total: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Messages not found",
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
