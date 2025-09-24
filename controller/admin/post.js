const { account } = require("../../lib/appwrite");

module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const session = await account.createEmailPasswordSession(email, password);

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: {
        sessionId: session.$id,
        userId: session.userId,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.code === 401) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
