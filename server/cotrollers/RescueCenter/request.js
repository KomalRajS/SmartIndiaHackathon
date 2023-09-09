const express = require("express");
const Requests = require("../../models/request");

module.exports.getRequestsData = async (req, res) => {
  const { id } = req.params;
  try {
    const selectedFields = await Requests.find({ rescuer: id });
    res.status(200).json(selectedFields);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
