const express = require("express");
const router = express.Router();

const { deletePlot } = require("../controller/plot/delete");
const { checkUserApiKey } = require("../middleware/checkUserApiKey");
const { deleteProduct } = require("../controller/product/delete");
const { deleteTree } = require("../controller/tree/delete");
const { deleteLeaf } = require("../controller/leaves/delete");

//Plots
router.delete("/api/v1/users/plot/:plot_id", checkUserApiKey, deletePlot);

//Products
router.delete("/api/v1/users/products", checkUserApiKey, deleteProduct);

//Trees
router.delete("/api/v1/users/tree", checkUserApiKey, deleteTree);

//Leaf
router.delete("/api/v1/users/leaf", checkUserApiKey, deleteLeaf);

module.exports = router;
