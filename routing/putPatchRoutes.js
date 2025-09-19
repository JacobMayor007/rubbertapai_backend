const express = require("express");
const router = express.Router();
const { checkUserApiKey } = require("../middleware/checkUserApiKey");
const { editPlot } = require("../controller/plot/patch");
const { editProduct } = require("../controller/product/patch");
const { changeEmail, changeName } = require("../controller/user/patch");

router.patch("/api/v1/users/plots", checkUserApiKey, editPlot);

router.patch("/api/v1/users/products", checkUserApiKey, editProduct);

router.patch("/api/v1/users/email", checkUserApiKey, changeEmail);

router.patch("/api/v1/users/name", checkUserApiKey, changeName);

module.exports = router;
