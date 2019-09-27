const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/api/users", (req, res, next) => {
  User.find()
  .then(user => {
    res.json(user);
  })
});

module.exports = router;
