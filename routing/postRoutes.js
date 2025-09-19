const express = require("express");
const router = express.Router();
const { sentMessages } = require("../controller/messages/post");
const { savePlot } = require("../controller/plot/post");
const { addProduct } = require("../controller/product/post");
const { postReport } = require("../controller/report/post");
const { createUser, isBuyer, isFarmer } = require("../controller/user/post");
const { checkRubberTapApiKey } = require("../middleware/checkRubberTapKey");
const { saveLeavesToTrees } = require("../controller/leaves/post");
const { checkUserApiKey } = require("../middleware/checkUserApiKey");
const { saveTrees } = require("../controller/tree/post");
const { adminLogin } = require("../controller/admin/post");

router.post("/api/v1/users/sent-message", checkUserApiKey, sentMessages);

router.post("/api/v1/users/plots", checkUserApiKey, savePlot);

router.post("/api/v1/users/trees", checkUserApiKey, saveTrees);

router.post("/api/v1/users/product", checkUserApiKey, addProduct);

router.post("/api/v1/users/report", checkUserApiKey, postReport);

router.post("/api/v1/users/leaves", checkUserApiKey, saveLeavesToTrees);

router.post("/api/v1/users", checkRubberTapApiKey, createUser);

router.post("/api/v1/users/role", checkRubberTapApiKey, isBuyer);

router.post("/api/v1/users/farmer", checkRubberTapApiKey, isFarmer);

router.post("/api/v1/admin", adminLogin);

module.exports = router;
