const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

module.exports.getAllReports = async (req, res) => {
  try {
    const { admin_id } = req.body;

    const isAdmin = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_USER_COLLECTION_ID}`,
      [Query.and([Query.equal("role", "admin"), Query.equal("$id", admin_id)])]
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        status: "Unauthorized Personnel",
        message:
          "You are forbidden to have this request, only the authorized personnel. Any unprohibited action will be faced against the Law of the Republic of the Philippines",
      });
    }

    const getAllReports = await database.getCollection(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_REPO_COLLECTION_ID}`
    );

    return res.status(200).json(getAllReports);
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
