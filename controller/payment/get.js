const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

module.exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_PAY_COLLECTION_ID}`,
      [Query.equal("user_id", id)]
    );

    if (response.documents.length === 0) {
      return res.status(200).json({
        success: true,
        message: "User does not subscribe yet",
        documents: response.documents,
      });
    }

    console.log(response.documents[0]);

    return res.status(200).json(response.documents[0]);
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
