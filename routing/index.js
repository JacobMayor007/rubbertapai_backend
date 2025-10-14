const express = require("express");
const router = express.Router();

const getRoutes = require("./getRoutes");
const postRoutes = require("./postRoutes");
const putPatchRoutes = require("./putPatchRoutes");
const deleteRoutes = require("./deleteRoutes");

router.use(getRoutes);
router.use(postRoutes);
router.use(putPatchRoutes);
router.use(deleteRoutes);

module.exports = router;
