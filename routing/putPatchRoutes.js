const express = require("express");
const router = express.Router();
const { checkUserApiKey } = require("../middleware/checkUserApiKey");
const { editPlot } = require("../controller/plot/patch");
const { editProduct } = require("../controller/product/patch");
const {
  changeEmail,
  changeName,
  upsertPushTokenUser,
  updateCity,
  updateProfile,
  updateWeatherAlert,
  updateNotif,
  updateMarketAlert,
  updateMessageAlert,
} = require("../controller/user/patch");
const { isAdmin } = require("../controller/user/post");
const { endisable } = require("../controller/admin/patch");
const { updateRead } = require("../controller/notifications/patch");

{
  /* Plots */
}
router.patch("/api/v1/users/plots", checkUserApiKey, editPlot);

{
  /* Products */
}

//Edit Product
router.patch("/api/v1/users/products", checkUserApiKey, editProduct);

{
  /* Users */
}

//Profile Update
router.patch("/api/v1/users/profile", checkUserApiKey, updateProfile);

//Weather
router.patch(
  "/api/v1/users/weather-alert",
  checkUserApiKey,
  updateWeatherAlert
);

router.patch("/api/v1/users/notifications", checkUserApiKey, updateRead);

//Notification Alert
router.patch("/api/v1/users/notif", checkUserApiKey, updateNotif);

//Message Alert
router.patch(
  "/api/v1/users/message-alert",
  checkUserApiKey,
  updateMessageAlert
);

//Market Alert
router.patch("/api/v1/users/market-alert", checkUserApiKey, updateMarketAlert);

//Email Update
router.patch("/api/v1/users/email", checkUserApiKey, changeEmail);

//Name Update
router.patch("/api/v1/users/name", checkUserApiKey, changeName);

//Token Update
router.patch("/api/v1/users/push-token", checkUserApiKey, upsertPushTokenUser);

//City Update
router.patch("/api/v1/users/city", checkUserApiKey, updateCity);

{
  /* Admin */
}

//User Enable/Disable
router.patch("/api/v1/admin/user", checkUserApiKey, isAdmin, endisable);

module.exports = router;
