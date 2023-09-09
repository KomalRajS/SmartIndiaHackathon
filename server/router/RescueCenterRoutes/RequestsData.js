const express = require("express");
const router = express.Router({ mergeParams: true });
const RequestsData = require("../../cotrollers/RescueCenter/request");

router.route("/requests/:id").get(RequestsData.getRequestsData);

module.exports = router;
