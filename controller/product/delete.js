const { database } = require("../../lib/appwrite");

module.exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "There is no product, please choose a product to delete",
        title: "Product Not Found!",
      });
    }

    await database.deleteDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_PROD_COLLECTION_ID}`,
      productId
    );

    return res.status(200).json({
      success: true,
      message: "You have successfully deleted you product.",
      title: "Deleted Product Successful!",
    });
  } catch (error) {
    console.error("Error fetching Plot id:", error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Product collection not found",
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
