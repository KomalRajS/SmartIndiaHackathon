const express = require("express");
const router = express.Router({ mergeParams: true });
const RescueCenter = require("../../cotrollers/RescueCenter/dashBoard");

router
  .route("/requestboard/req/teammembers/:id")
  .get(RescueCenter.getTeamMemberData);
module.exports = router;
