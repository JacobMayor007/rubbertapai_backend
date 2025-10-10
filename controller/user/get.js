const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");
require("dotenv").config();

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await database.getDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      `${id}`
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const doc = response;

    console.log(doc);

    return res.status(200).json(doc);
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

module.exports.getChatMate = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching user:", { id });

    // Get user document
    const response = await database.getDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      `${id}`
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const doc = response;

    return res.status(200).json(doc);
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

module.exports.searchUser = async (req, res) => {
  try {
    const { name } = req.params;

    const response = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      [Query.search("username", name), Query.limit(25)]
    );

    if (response.documents.length === 0) {
      return res.status(200).json([]);
    }

    const doc = response.documents.map((data) => ({
      $id: data.$id,
      $createdAt: data.$createdAt,
      email: data.email,
      username: data.username,
      notifSettings: data.notifSettings,
      themeSettings: data.themeSettings,
      subscription: data.subscription,
      imageURL: data.imageURL,
    }));

    res.status(200).json(doc);
  } catch (error) {
    console.error("Error logging in user:", error.response || error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
