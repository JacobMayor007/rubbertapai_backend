const { Query } = require("node-appwrite");
const { database } = require("../../lib/appwrite");
require("dotenv").config();

module.exports.getUserProduct = async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_PROD_COLLECTION_ID,
      [Query.equal("user_id", userId)]
    );

    if (response.documents.length === 0) {
      return res.status(200).json([]);
    }

    const product = response.documents.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      address: doc.address,
      user_id: doc.user_id,
      user_username: doc.user_username,
      user_email: doc.user_email,
      productURL: doc.productURL,
      description: doc.description,
      price: doc.price,
      farmerProfile: doc.farmerProfile,
      category: doc.category,
      city: doc.city,
      country: doc.country,
      region: doc.region,
    }));

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching products:", error);

    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Chat collection not found",
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

module.exports.getProducts = async (req, res) => {
  try {
    const response = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_PROD_COLLECTION_ID
    );

    const product = response.documents.map((doc) => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      address: doc.address,
      user_id: doc.user_id,
      user_username: doc.user_username,
      user_email: doc.user_email,
      user_fullName: doc.user_fullName,
      productURL: doc.productURL,
      description: doc.description,
      price: doc.price,
      farmerProfile: doc.farmerProfile,
      category: doc.category,
      city: doc.city,
      country: doc.country,
      region: doc.region,
    }));

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching products:", error);

    // Handle specific Appwrite errors
    if (error.code === 404) {
      return res.status(404).json({
        success: false,
        error: "Chat collection not found",
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
