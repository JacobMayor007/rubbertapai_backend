const { database } = require("../../lib/appwrite");

module.exports.changeEmail = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;

    console.log(userId);
    console.log(newEmail);

    if (!userId) {
      return res.status(404).json({
        success: false,
        title: "Unauthorized",
        message: "You are unauthorized to have this request!",
      });
    }

    if (!newEmail) {
      return res.status(401).json({
        success: false,
        title: "Lacking Data",
        message: "There is no new email to update your email",
      });
    }

    await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        email: newEmail,
        subscription: false,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "You have successfully updated your email, please check your email to verified!\nYou will be logged out.",
      title: "Email Updated!",
    });
  } catch (error) {
    console.error(error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User collection not found",
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

module.exports.changeName = async (req, res) => {
  try {
    const { userId, newName } = req.body;

    if (!userId) {
      return res.status(404).json({
        success: false,
        title: "Unauthorized",
        message: "You are unauthorized to have this request!",
      });
    }

    if (!newName) {
      return res.status(401).json({
        success: false,
        title: "Lacking Data",
        message: "There is no new email to update your email",
      });
    }

    await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        fullName: newName,
      }
    );

    return res.status(200).json({
      success: true,
      message: "You have successfully updated your name",
      title: "Name Updated!",
    });
  } catch (error) {
    console.error(error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User collection not found",
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

module.exports.upsertPushTokenUser = async (req, res) => {
  try {
    const { token, userId } = req.body;

    if (!userId) {
      return res.status(404).json({
        success: false,
        title: "Unauthorized",
        message: "You are unauthorized to have this request!",
      });
    }

    if (!token) {
      return res.status(404).json({
        success: false,
        title: "Token Not Found",
        message: "There are no token",
      });
    }

    const response = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        pushToken: token,
      }
    );
    if (response) {
      return res.status(200).json({
        success: true,
        status: "ok",
      });
    }
    
  } catch (error) {
    console.error(error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User collection not found, failed to register token",
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
