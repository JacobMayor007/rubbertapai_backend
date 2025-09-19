const { database } = require("../../lib/appwrite");

module.exports.editProduct = async (req, res) => {
  try {
    const {
      address,
      userId,
      user_username,
      user_email,
      farmerProfile,
      productURL,
      category,
      description,
      price,
      city,
      region,
      country,
      plot_id,
    } = req.body;

    console.log(req.body);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "There is no address, please input address",
        title: "Address Not Found",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You are unauthorized to have this request",
        title: "Request Unauthorized",
      });
    }

    if (!user_username) {
      return res.status(401).json({
        success: false,
        message: "You are unauthorized to have this request",
        title: "Request Unauthorized",
      });
    }

    if (!user_email) {
      return res.status(401).json({
        success: false,
        message: "You are unauthorized to have this request",
        title: "Request Unauthorized",
      });
    }

    if (!farmerProfile) {
      return res.status(401).json({
        success: false,
        message: "You are unauthorized to have this request",
        title: "Request Unauthorized",
      });
    }

    if (!productURL) {
      return res.status(404).json({
        success: false,
        message:
          "There is no new image of the product, please input new image to update your product.",
        title: "Product Image Not Found",
      });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "There is no new category of the product, please input new category to update your product.",
        title: "Category Not Found",
      });
    }

    if (!description) {
      return res.status(404).json({
        success: false,
        message:
          "There is no new description of the product, please input new description to update your product.",
        title: "Description Not Found",
      });
    }

    if (!price) {
      return res.status(404).json({
        success: false,
        message:
          "There is no new price of the product, please input new price to update your product.",
        title: "Price Not Found",
      });
    }

    if (!city) {
      return res.status(401).json({
        success: false,
        message: "You are unauthorized to have this request",
        title: "Request Unauthorized",
      });
    }

    if (!region) {
      return res.status(401).json({
        success: false,
        message: "You are unauthorized to have this request",
        title: "Request Unauthorized",
      });
    }

    if (!country) {
      return res.status(401).json({
        success: false,
        message: "You are unauthorized to have this request",
        title: "Request Unauthorized",
      });
    }

    await database.updateDocument(
      `${process.env.APPWRITE_DATABASE_ID}`,
      `${process.env.APPWRITE_PROD_COLLECTION_ID}`,
      plot_id,
      {
        address: address,
        user_id: userId,
        user_username: user_username,
        user_email: user_email,
        productURL: productURL,
        description: description,
        price: price,
        farmerProfile: farmerProfile,
        category: category,
        city: city,
        country: country,
        region: region,
      }
    );

    console.log("Successful!");

    return res.status(200).json({
      success: true,
      title: "Successfully updated your product",
      message: "You have successfully updated your product.",
    });
  } catch (error) {
    console.error(error);

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
