const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "welcome to covid-19 api",
  });
});

module.exports = router
