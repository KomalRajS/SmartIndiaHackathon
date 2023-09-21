const express = require("express");
const Rescuer = require("../../models/rescue");
const User = require("../../models/user");
module.exports.Profile = async (req, res) => {
  const { id } = req.params;
  const profile_details = await Rescuer.findById(id);
  res.status(200).json(profile_details);
};

module.exports.getTeamMemberData = async (req, res) => {
  const { id } = req.params;
  try {
    const team_members = await User.find({ rescue_team: id });
    res.status(200).json(team_members);
  } catch (e) {
    res.status(500).json(e);
  }
};
