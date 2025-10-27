const { Query } = require("node-appwrite");
const { database, ID } = require("../../lib/appwrite");
const bcrypt = require("bcrypt");
const saltRounds = 15;
const { Expo } = require("expo-server-sdk");

let expo = new Expo();

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
        subscription: subscription,
        API_KEY: user_api_key,
        status: "enable",
        notif: true,
        weatherAlert: true,
        marketAlert: true,
        messageAlert: true,
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
    // Validate request body
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    console.log("Request body:", req.body);

    const isBuyer = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USER_COLLECTION_ID,
      [Query.equal("email", email)]
    );

    if (!isBuyer.documents || isBuyer.documents.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const user = isBuyer.documents[0];
    const role = user.role;
    const status = user.status;

    if (status === "disable") {
      return res.status(401).json({
        success: false,
        message: "Your account is disabled. Please contact support.",
        title: "Account Disabled",
        role,
      });
    }

    console.log("User role:", role);

    if (role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Your account is not registered as a buyer.",
        title: "Access Denied",
        role,
      });
    }

    return res.status(200).json({
      title: "Success",
      success: true,
      role: "buyer",
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    // Handle specific Appwrite errors
    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (error.code === 401) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access",
      });
    }

    if (error.code === 400) {
      return res.status(400).json({
        success: false,
        error: "Invalid request parameters",
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
    const status = isBuyer.documents[0].status;

    console.log(status);

    if (status === "disable") {
      return res.status(401).json({
        success: false,
        message: "Your account is disabled. Please contact support.",
        title: "Account Disabled",
        role,
      });
    }

    if (role === "buyer") {
      return res.status(401).json({
        success: true,
        message:
          "Your account is not registered to this application. Make sure to register as a farmer.",
        title: "Account Unauthorized!",
        role,
      });
    }

    return res.status(200).json({
      title: "Found",
      success: true,
      role: "farmer",
    });
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

module.exports.isAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;

    console.log(req.body);

    const isAdmin = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      [Query.equal("email", email)]
    );

    const role = isAdmin.documents[0].role;

    console.log(role);

    if (role !== "admin") {
      return res.status(401).json({
        success: false,
        message:
          "Your account is not registered to this application. Make sure to register as an admin.",
        title: "Account Unauthorized!",
        role,
      });
    }

    next();
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

module.exports.postNotification = async (req, res) => {
  let { token, title, body } = req.body;

  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).send("Invalid Expo push token.");
  }

  let messages = [
    {
      to: token,
      sound: "default",
      title: title,
      body: body,
    },
  ];

  try {
    let ticketChunk = await expo.sendPushNotificationsAsync(messages);
    console.log(ticketChunk);
    res.status(200).send({ success: true, tickets: ticketChunk });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports.analyticsSaveToDB = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      className,
      probability,
      city,
      region,
      subregion,
      country,
      address,
    } = req.body;

    if (!userId || !className || probability === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert probability to percentage if needed (e.g., 0.85 → 85.00)
    const probPercent =
      probability > 1
        ? probability
        : parseFloat((probability * 100).toFixed(2));

    const record = {
      userId,
      fullName,
      className,
      probability: probPercent,
      city: city,
      region: region,
      subregion: subregion,
      country: country,
      address: address,
    };

    await database.createDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_ANALYTICS_COLLECTION_ID}`,
      ID.unique(),
      record
    );

    res.status(201).json({ success: true });
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
