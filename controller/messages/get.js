const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

require("dotenv").config();

module.exports.getSentMessages = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;

    const response = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_MESS_COLLECTION_ID}`,
      [Query.equal("sender_id", userId), Query.equal("receiver_id", receiverId)]
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

    res.status(200).json(messages);
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

module.exports.getReceivedMessages = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;

    const response = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_MESS_COLLECTION_ID}`,
      [Query.equal("sender_id", receiverId), Query.equal("receiver_id", userId)]
    );

    const messages = response.documents.map((doc) => ({
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
