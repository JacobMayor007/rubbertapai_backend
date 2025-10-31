const { ID, database } = require("../../lib/appwrite");

module.exports.addProduct = async (req, res) => {
  try {
    const {
      address,
      userId,
      user_username,
      user_email,
      farmerProfile,
      category,
      productURL,
      user_fullName,
      description,
      price,
      city,
      region,
      country,
    } = req.body;

    const response = await database.createDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_PROD_COLLECTION_ID}`,
      ID.unique(),
      {
        address,
        user_id: userId,
        user_username,
        user_email,
        farmerProfile,
        category,
        productURL,
        user_fullName,
        description,
        price,
        city,
        region,
        country,
        price: Number(price),
      },
      [`write("user:${userId || ""}")`]
    );

    return res.status(200).json({
      status: "Successful",
      message: `Product successfully added at ${response.$createdAt}`,
      product_id: response.$id,
    });
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
        error: "Invalid query body",
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
