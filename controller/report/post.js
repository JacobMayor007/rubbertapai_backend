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
        Query.equal("reportedBy", reportedBy),
        Query.equal("reported_id", reported_id),
      ]
    );

    if (done.documents.length === 1) {
      return res.status(409).json({
        success: false,
        title: "Already reported",
        message: "You have already reported this user",
      });
    }

    // Create document
    const response = await database.createDocument(
      process.env.APPWRITE_DATABASE_ID,
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

module.exports.getAllReports = async (req, res) => {
  try {
    let hasMore = true;
    let lastDocumentId = null;
    const limit = 25;
    const allReports = [];

    while (hasMore) {
      const queries = [Query.limit(limit)];

      if (lastDocumentId) {
        queries.push(Query.cursorAfter(lastDocumentId));
      }

      const getAllReports = await database.listDocuments(
        `${process.env.APPWRITE_DATABASE_ID}`,
        `${process.env.APPWRITE_REPO_COLLECTION_ID}`,
        queries
      );

      allReports.push(...getAllReports.documents);

      if (getAllReports.documents.length < limit) {
        hasMore = false;
      } else {
        lastDocumentId =
          getAllReports.documents[getAllReports.documents.length - 1].$id;
      }
    }
    return res.status(200).json(allReports);
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
