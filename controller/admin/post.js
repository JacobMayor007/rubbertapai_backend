const { Query } = require("node-appwrite");
const { account, database } = require("../../lib/appwrite");
const { default: Expo } = require("expo-server-sdk");

let expo = new Expo();

module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const session = await account.createEmailPasswordSession(email, password);

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        sessionId: session.$id,
        userId: session.userId,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === 401) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.getRatesAndFeedbacks = async (req, res) => {
  try {
    const allFeedbacks = [];
    let lastDocumentId = null;
    let hasMore = true;
    const limit = 2;

    while (hasMore) {
      const queries = [Query.orderDesc("$createdAt"), Query.limit(limit)];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_RATE_FEED_COLLECTION_ID,
        queries
      );

      allFeedbacks.push(...response.documents);

      if (response.documents.length < limit) {
        hasMore = false;
      } else {
        lastDocumentId = response.documents[response.documents.length - 1].$id;
      }
    }

    if (allFeedbacks.length < 1) {
      return res.status(200).json([]);
    }

    return res.status(200).json(allFeedbacks);
  } catch (error) {
    console.error("Error fetching rates and feedbacks:", error);

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

module.exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = [];
    let lastDocumentId = null;
    let hasMore = true;
    const limit = 25; // You can change this value

    while (hasMore) {
      const queries = [
        Query.or([Query.equal("role", "farmer"), Query.equal("role", "buyer")]),
        Query.limit(limit),
      ];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_USER_COLLECTION_ID,
        queries
      );

      allUsers.push(...response.documents);

      if (response.documents.length < limit) {
        hasMore = false;
      } else {
        lastDocumentId = response.documents[response.documents.length - 1].$id;
      }
    }

    if (allUsers.length < 1) {
      return res.status(200).json([]);
    }

    return res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);

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

module.exports.getUserReportUsingId = async (req, res) => {
  try {
    const { reportedId } = req.body;

    if (!reportedId) {
      return res.status(404).json({
        success: false,
        message: "There is no reported Id",
        title: "Not Found",
      });
    }

    const result = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_REPO_COLLECTION_ID}`,
      [Query.equal("reported_id", reportedId)]
    );

    return res.status(200).json(result);
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

module.exports.analytics = async (req, res) => {
  try {
    console.log(req.body);

    const allAnalytics = [];
    let lastDocumentId = null;
    let hasMore = true;
    const limit = 25;

    while (hasMore) {
      const queries = [Query.limit(limit)];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const response = await database.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_ANALYTICS_COLLECTION_ID,
        queries
      );

      allAnalytics.push(...response.documents);

      if (response.documents.length < limit) {
        hasMore = false;
      } else {
        lastDocumentId = response.documents[response.documents.length - 1].$id;
      }
    }

    const analytics = allAnalytics.map((doc) => ({
      ...doc,
    }));

    res.status(200).json(analytics);
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

module.exports.warnUser = async (req, res) => {
  try {
    const { warnedId } = req.body;

    console.log(req.body);

    const notifyUser = await database.getDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      warnedId
    );

    const token = notifyUser.pushToken;

    let messages = [
      {
        to: token,
        sound: "default",
        title: "Warning ⚠️",
        body: "You have been warned, too many users have reported you.",
      },
    ];

    if (!Expo.isExpoPushToken(token)) {
      console.error("Invalid Expo push token:", token);
      return;
    }

    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(messages);
      console.log("Notification sent:", ticketChunk);
    } catch (error) {
      console.error("Error sending notification:", error);
    }

    return res.status(200).json({
      success: true,
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
