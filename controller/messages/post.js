const { Query } = require("node-appwrite");
const { ID, database } = require("../../lib/appwrite");
const { default: Expo } = require("expo-server-sdk");

let expo = new Expo();

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

    const notifyUser = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      [Query.equal("$id", req.body.receiver_id)]
    );

    const token = notifyUser.documents[0].pushToken;
    const messageAlert = notifyUser.documents[0].messageAlert;

    const chatRoomID = existingChats.documents[0]?.$id;

    console.log(token);
    console.log(messageAlert);

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

    if (messageAlert) {
      await database.createDocument(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_NOTIF_COLLECTION_ID}`,
        ID.unique(),
        {
          type: "Message Notifications",
          message: `${data.senderName.split(" ")[0]} has sent you a message`,
          isRead: false,
          userId: `${data.userId}`,
          senderProfile: `${data.senderProfile}`,
          receiverId: `${data.receiver_id}`,
        }
      );

      let messages = [
        {
          to: token,
          sound: "default",
          title: "New Message",
          body: `You have a new message from ${data.senderName.split(" ")[0]}`,
        },
      ];

      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(messages);
        console.log("Notification sent:", ticketChunk);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }

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
