const express = require("express");
const router = express.Router({ mergeParams: true });
const { isVerified } = require("../middleware");
const chatHandler = require("../cotrollers/chatHandler");
router.route("/req").post(isVerified, chatHandler.chatHandler);
module.exports = router;
