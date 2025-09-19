const { Query } = require("node-appwrite");
const { database } = require("../lib/appwrite");

const checkUserApiKey = async (req, res, next) => {
  const { userId, API_KEY } = req.body;

  if (!API_KEY) {
    console.log("NO API KEY");
    return res.status(401).json({ error: "Missing API key" });
  }

  try {
    const result = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USER_COLLECTION_ID,
      [Query.equal("API_KEY", API_KEY), Query.equal("$id", userId)]
    );

    if (result.total === 0) {
      console.log("Error: no matching userId/API_KEY");
      return res.status(403).json({ error: "Invalid API key or user ID" });
    }

    console.log("API key validated ✅");
    next();
  } catch (error) {
    console.error("Error checking API key:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { checkUserApiKey };
