const { Query } = require("node-appwrite");
const { database, ID } = require("../../lib/appwrite");

module.exports.RateFeedbackUser = async (req, res) => {
  try {
    const { userId, receivedId, rate, feedback } = req.body;
    console.log(req.body);

    if (feedback.length > 1549) {
      return res.status(406).json({
        success: false,
        title: "Text reached its limit",
        message:
          "Sorry, but we only accept 1550 characters only, please try again.",
      });
    }

    const duplicateCheck = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_RATE_FEED_COLLECTION_ID,
      [Query.equal("rated", receivedId), Query.equal("ratedBy", userId)]
    );

    if (duplicateCheck.documents.length > 0) {
      return res.status(400).json({
        success: false,
        title: "Already rated",
        message: "You have already rated this user.",
      });
    }

    const result = await database.createDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_RATE_FEED_COLLECTION_ID}`,
      ID.unique(),
      {
        ratedBy: userId,
        rated: receivedId,
        rate: Number(rate),
        feedback: feedback || "",
      }
    );

    if (!result) {
      console.log(result);

      return res.status(400).json({
        success: false,
        title: "Error occured",
        message: "Please try again.",
      });
    }

    const averageRate = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_RATE_FEED_COLLECTION_ID,
      [Query.equal("rated", receivedId)]
    );

    if (averageRate.documents.length > 0) {
      const average =
        averageRate.documents.reduce((sum, data) => sum + data.rate, 0) /
        averageRate.documents.length;

      await database.updateDocument(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_USER_COLLECTION_ID}`,
        receivedId,
        { rate: average }
      );
    }

    return res.status(200).json({
      success: true,
      title: "Rate user successful",
      message: "You have successfully rated user",
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User Document not found",
      });
    }

    if (error.code === 401) {
      return res.status(401).json({
        message: "Unathorized user to query this tree",
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
