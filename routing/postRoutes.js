const express = require("express");
const router = express.Router();
const { sentMessages } = require("../controller/messages/post");
const { savePlot } = require("../controller/plot/post");
const { addProduct } = require("../controller/product/post");
const { postReport, getAllReports } = require("../controller/report/post");
const {
  createUser,
  isBuyer,
  isFarmer,
  postNotification,
  isAdmin,
} = require("../controller/user/post");
const { checkRubberTapApiKey } = require("../middleware/checkRubberTapKey");
const { saveLeavesToTrees } = require("../controller/leaves/post");
const { checkUserApiKey } = require("../middleware/checkUserApiKey");
const { saveTrees } = require("../controller/tree/post");
const {
  adminLogin,
  getRatesAndFeedbacks,
  getAllUsers,
  getUserReportUsingId,
} = require("../controller/admin/post");
const { RateFeedbackUser } = require("../controller/rateAndFeedback/post");
const { getAllPayments, subscription } = require("../controller/payment/post");
const { getMyNotifications } = require("../controller/notifications/post");

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
  /*Payment*/
}

router.post("/api/v1/users/payment", checkUserApiKey, subscription);

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
router.post("/api/v1/admin", isAdmin, adminLogin);

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

router.post("/api/v1/users/notifications", checkUserApiKey, getMyNotifications);

{
  /* Admin */
}

//Get Reports
router.post("/api/v1/admin/reports", checkUserApiKey, isAdmin, getAllReports);

//Get Payments
router.post("/api/v1/admin/payments", checkUserApiKey, isAdmin, getAllPayments);

//Get Rates and Feedbacks
router.post(
  "/api/v1/admin/rates",
  checkUserApiKey,
  isAdmin,
  getRatesAndFeedbacks
);

router.post("/api/v1/admin/users", checkUserApiKey, isAdmin, getAllUsers);

router.post(
  "/api/v1/admin/user",
  checkUserApiKey,
  isAdmin,
  getUserReportUsingId
);

module.exports = router;
