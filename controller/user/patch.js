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

module.exports.updateCity = async (req, res) => {
  try {
    const { userId, city } = req.body;

    if (!userId) {
      return res.status(404).json({
        success: false,
        title: "Unauthorized",
        message: "You are unauthorized to have this request!",
      });
    }

    if (!city) {
      return res.status(404).json({
        success: false,
        title: "City Not Found",
        message: "There are no City",
      });
    }

    const response = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        city: city,
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

module.exports.updateNotif = async (req, res) => {
  try {
    const { userId, notif, message, weather, market } = req.body;

    const response = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        notif: notif,
        marketAlert: market,
        weatherAlert: weather,
        messageAlert: message,
      }
    );

    if (!response) {
      return res.status(400).json({
        success: false,
        title: "Error occured",
        message:
          "There is an error occured when updating notification, please try again!",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Successfully updated weather",
      message: "You have successfully updated notification",
    });
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
module.exports.updateWeatherAlert = async (req, res) => {
  try {
    const { userId, weather } = req.body;

    const response = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        weatherAlert: weather,
      }
    );

    if (!response) {
      return res.status(400).json({
        success: false,
        title: "Error occured",
        message:
          "There is an error occured when updating weather alert, please try again!",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Successfully updated weather",
      message: "You have successfully updated weather notification",
    });
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
module.exports.updateMarketAlert = async (req, res) => {
  try {
    const { userId, market } = req.body;

    const response = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        marketAlert: market,
      }
    );

    if (!response) {
      return res.status(400).json({
        success: false,
        title: "Error occured",
        message:
          "There is an error occured when updating market alert, please try again!",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Successfully updated weather",
      message: "You have successfully updated market notification",
    });
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

module.exports.updateMessageAlert = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const response = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        messageAlert: message,
      }
    );

    if (!response) {
      return res.status(400).json({
        success: false,
        title: "Error occured",
        message: "There is an error occured when updating, please try again!",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Successfully updated weather",
      message: "You have successfully updated weather notification",
    });
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

module.exports.updateProfile = async (req, res) => {
  try {
    const { file, userId } = req.body;

    const response = await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        imageURL: file,
      }
    );

    if (!response) {
      return res.status(400).json({
        success: false,
        title: "Error occured",
        message: "There is an error occured, please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      title: "Profile Picture Updated",
      message: "You have successfully updated your profile picture",
    });
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
