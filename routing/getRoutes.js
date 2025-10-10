const express = require("express");
const {
  getUserById,
  searchUser,
  getChatMate,
} = require("../controller/user/get");
const { getUserProduct, getProducts } = require("../controller/product/get");
const { getChatRoom } = require("../controller/chat/get");
const {
  getSentMessages,
  getReceivedMessages,
} = require("../controller/messages/get");
const {
  getCurrentWeather,
  getForecastWeather,
} = require("../controller/weather/get");
const { getMyPlot } = require("../controller/plot/get");
const { getMyLeaves } = require("../controller/leaves/get");
const { getMyTrees, MyTrees } = require("../controller/tree/get");

const { getPaymentById } = require("../controller/payment/get");

const router = express.Router();

router.get("/api/v1/users/user/:id", getUserById);

router.get("/api/v1/users/search-user/:name", searchUser);

router.get("/api/v1/users/chat-mate/:id", getChatMate);

router.get("/api/v1/users/chat-room/:userId", getChatRoom);

router.get("/api/v1/users/my-plot/:userId", getMyPlot);

router.get("/api/v1/users/my-product/:userId", getUserProduct);

router.get("/api/v1/users/products", getProducts);

router.get("/api/v1/users/my-leaves/:plot_id/:treeId/:userId", getMyLeaves);

router.get("/api/v1/users/forecast/:city", getForecastWeather);

router.get("/api/v1/users/current/:city", getCurrentWeather);

router.get("/api/v1/users/trees/:plotId/:userId", getMyTrees);

router.get("/api/v1/users/trees/:userId", MyTrees);

router.get("/api/v1/users/payment/:id", getPaymentById);

router.get("/api/v1/users/sent-messages/:userId/:receiverId", getSentMessages);

router.get(
  "/api/v1/users/received-messages/:userId/:receiverId",
  getReceivedMessages
);

module.exports = router;
