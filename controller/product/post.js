const { ID, database } = require("../../lib/appwrite");

module.exports.addProduct = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    if (
      !data.address ||
      !data.user_id ||
      !data.user_username ||
      !data.user_email ||
      !data.farmerProfile ||
      !data.category ||
      !data.productURL ||
      !data.category ||
      !data.description ||
      !data.price ||
      !data.city ||
      !data.region ||
      !data.country
    ) {
      return res.status(400).json({
        error: "Missing data",
        message: "You have missing data, please input all the necessary fields",
      });
    }

    const response = await database.createDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_PROD_COLLECTION_ID}`,
      ID.unique(),
      {
        ...data,
        price: Number(data.price),
      },
      [`write("user:${data.user_id || ""}")`]
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
