const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");
const bcrypt = require("bcrypt");
const saltRounds = 15;

module.exports.createUser = async (req, res) => {
  try {
    const {
      userId,
      username,
      fullName,
      fName,
      lName,
      email,
      imageURL,
      role,
      notifSettings,
      themeSettings,
      subscription,
    } = req.body;

    const salt = bcrypt.genSaltSync(saltRounds);
    const user_api_key = bcrypt.hashSync(userId + email, salt);

    await database.createDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      userId,
      {
        username: username,
        fullName: fullName,
        fName: fName,
        lName: lName,
        email: email,
        imageURL: imageURL,
        role: role,
        notifSettings: notifSettings,
        themeSettings: themeSettings,
        subscription: subscription,
        API_KEY: user_api_key,
      }
    );

    return res.status(200).json({
      success: true,
      title: "Create account successful",
      message:
        "You successfully created an account, please feel free to explore our application",
    });
  } catch (error) {
    console.error("Error fetching tree:", error);

    // Handle specific Appwrite errors
    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Tree documents not found",
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

module.exports.isBuyer = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(req.body);

    const isBuyer = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      [Query.equal("email", email)]
    );

    const role = isBuyer.documents[0].role;

    console.log(role);

    if (role !== "buyer") {
      return res.status(401).json({
        success: true,
        message:
          "Your account is not registered to this application. Make sure to register as a buyer.",
        title: "Account Unauthorized!",
        role,
      });
    }

    if (role === "buyer") {
      return res.status(200).json({
        title: "Found",
        success: true,
        role: "buyer",
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);

    // Handle specific Appwrite errors
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

module.exports.isFarmer = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(req.body);

    const isBuyer = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      [Query.equal("email", email)]
    );

    const role = isBuyer.documents[0].role;

    console.log(role);

    if (role !== "buyer") {
      return res.status(401).json({
        success: true,
        message:
          "Your account is not registered to this application. Make sure to register as a buyer.",
        title: "Account Unauthorized!",
        role,
      });
    }

    if (role === "farmer") {
      return res.status(200).json({
        title: "Found",
        success: true,
        role: "buyer",
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);

    // Handle specific Appwrite errors
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
