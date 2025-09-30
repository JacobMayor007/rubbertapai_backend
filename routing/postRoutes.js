const express = require("express");
const router = express.Router();
const { sentMessages } = require("../controller/messages/post");
const { savePlot } = require("../controller/plot/post");
const { addProduct } = require("../controller/product/post");
const { postReport } = require("../controller/report/post");
const {
  createUser,
  isBuyer,
  isFarmer,
  postNotification,
} = require("../controller/user/post");
const { checkRubberTapApiKey } = require("../middleware/checkRubberTapKey");
const { saveLeavesToTrees } = require("../controller/leaves/post");
const { checkUserApiKey } = require("../middleware/checkUserApiKey");
const { saveTrees } = require("../controller/tree/post");
const { adminLogin } = require("../controller/admin/post");
const { RateFeedbackUser } = require("../controller/rateAndFeedback/post");

{
  /* MESSAGES */
}
//Sent A Message
router.post("/api/v1/users/sent-message", checkUserApiKey, sentMessages);

//Report a user
router.post("/api/v1/users/report", checkUserApiKey, postReport);

{
  /* PLOTS */
}
//Save Plot
router.post("/api/v1/users/plots", checkUserApiKey, savePlot);

{
  /* TREES */
}

// Save Leaf Image To Tree Collection in Appwrite
router.post("/api/v1/users/leaves", checkUserApiKey, saveLeavesToTrees);

//Save Tree to Tree Collection
router.post("/api/v1/users/trees", checkUserApiKey, saveTrees);

{
  /*Saved A Product */
}
//Add A Product
router.post("/api/v1/users/product", checkUserApiKey, addProduct);

{
  /* User */
}
// Create A New User
router.post("/api/v1/users", checkRubberTapApiKey, createUser);

//Role Checking Buyer
router.post("/api/v1/users/role", checkRubberTapApiKey, isBuyer);

//Role Checking Farmer
router.post("/api/v1/users/farmer", checkRubberTapApiKey, isFarmer);

//Admin Login
router.post("/api/v1/admin", adminLogin);

{
  /* Notifications */
}
//Weather Rain Alert
router.post(
  "/api/v1/users/weather-notification",
  checkUserApiKey,
  postNotification
);

{
  /* Rate And Feedback */
}

//Rate User
router.post("/api/v1/users/rate", checkUserApiKey, RateFeedbackUser);

module.exports = router;
