const { account, database } = require("../../lib/appwrite");

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
    const result = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_RATE_FEED_COLLECTION_ID}`
    );

    if (result.documents < 0) {
      return res.status(200).json([]);
    }

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
