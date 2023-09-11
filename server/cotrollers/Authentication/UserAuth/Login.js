const express = require("express");
const User = require("../../../models/user");

module.exports.login = async (req, res) => {
  res.send({ user: req.user, message: "Logged in successfully" });
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.send({ message: "Logged out successfully" });
};
