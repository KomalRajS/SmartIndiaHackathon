const express = require("express");
const Rescuer = require("../../models/rescue");
module.exports.getRescueData = async (req, res) => {
  try {
    const selectedFields = await Rescuer.find({}, "rest.geometry username _id");
    res.status(200).json(selectedFields);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
