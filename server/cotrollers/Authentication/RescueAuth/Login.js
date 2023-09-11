const express = require("express");
const Rescuer = require("../../../models/rescue");

module.exports.login = async (req, res) => {
  res.send({ user: req.user, message: "Logged in successfully" });
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.send({ message: "logged out successfully" });
};
