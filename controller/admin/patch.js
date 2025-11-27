const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");
const { default: Expo } = require("expo-server-sdk");

let expo = new Expo();

module.exports.endisable = async (req, res) => {
  try {
    const { reportedId, status } = req.body;
    const stats = status.toLowerCase();

    const result = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      reportedId,
      {
        status: stats,
      }
    );

    if (!result) {
      return res.status(400).json({
        success: false,
        title: `${stats} user error`,
        message: "There is an error occured, please try again!",
      });
    }

    const docs = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_REPO_COLLECTION_ID}`,
      [Query.equal("reported_id", [reportedId])]
    );

    if (!docs || docs.total === 0) {
      return res.status(404).json({
        success: false,
        message: "No reports found for this reported_id",
      });
    }

    for (let i = 0; i < docs.documents.length; i++) {
      await database.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_REPO_COLLECTION_ID,
        docs.documents[i].$id,
        {
          status: stats,
        }
      );
    }

    const notifyUser = await database.getDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      reportedId
    );

    const token = notifyUser.pushToken;

    if (!Expo.isExpoPushToken(token)) {
      console.error("Invalid Expo push token:", token);
      return;
    }

    let messages = [
      {
        to: token,
        sound: "default",
        title: stats === "enable" ? `Enable User` : `Disable User`,
        body:
          stats === "enable"
            ? `You have been enabled by the admin, please try to follow the proper guidelines to prevent future disable account.`
            : `You have been ${stats} by the admin, please contact help & support to retrieve your account.`,
      },
    ];

    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(messages);
      console.log("Notification sent:", ticketChunk);
    } catch (error) {
      console.error("Error sending notification:", error);
    }

    return res.status(200).json({
      success: true,
      message: `You have successfully ${stats} user.`,
      title: `${stats} user`,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    if (error.code === 404) {
      return res.status(404).json({
        status: "Make sure to logged in first",
        message: "",
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
