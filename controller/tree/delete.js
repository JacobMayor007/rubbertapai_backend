const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");

module.exports.deleteTree = async (req, res) => {
  try {
    const { tree_id } = req.body;
    console.log(req.body);

    if (!tree_id) {
      return res.status(400).json({
        status: "Error",
        message: "There is no tree, please make sure the tree is existing",
      });
    }

    await database.deleteDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_TREE_COLLECTION_ID}`,
      tree_id
    );

    await database.deleteDocuments(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_LEAF_COLLECTION_ID}`,
      [Query.equal("tree_id", tree_id)]
    );
 
    return res.status(200).json({
      status: "Successful",
      message: "Successfully deleted a tree!",
    });
  } catch (error) {
    console.error("Error fetching Tree rooms:", error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Plot collection not found",
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
