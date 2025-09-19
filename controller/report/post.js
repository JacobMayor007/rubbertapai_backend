const { Query } = require("node-appwrite");
const { database, ID } = require("../../lib/appwrite");

module.exports.postReport = async (req, res) => {
  try {
    const { reported_id, reportedBy, type, description } = req.body;

    // Validation
    if (!reported_id || !reportedBy || !type || !description) {
      return res.status(400).json({
        // Changed from 404 to 400
        success: false,
        error: "Missing data",
        message: "Please fill out all required fields",
      });
    }

    const done = await database.listDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_REPO_COLLECTION_ID}`,
      [
        Query.and([
          Query.equal("reportedBy", reportedBy),
          Query.equal("reported_id", reported_id),
        ]),
      ]
    );
    

    // Create document
    const response = await database.createDocument(
      process.env.APPWRITE_DATABASE_ID, // Removed template literals - not needed
      process.env.APPWRITE_REPO_COLLECTION_ID,
      ID.unique(),
      {
        status: "pending",
        reported_id,
        reportedBy,
        type,
        description,
      },
      [`write("user:${reportedBy}")`]
    );

    if (!response.$id) {
      return res.status(500).json({
        success: false,
        error: "Document creation failed",
        message: "Failed to create report document",
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error("Report creation error:", error);

    // Handle specific Appwrite errors
    if (error.code === 401 || error.code === 404) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please log in first",
      });
    }

    if (error.code === 400) {
      return res.status(400).json({
        success: false,
        error: "Invalid request",
        message: error.message,
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to process report",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
