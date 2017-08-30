var express = require('express');
var router  = express.Router();

var Response = require("../../helper/response.js");

router.get("/", (req, res, next) => {
    res.render("dashboard/create_raffle");
});

module.exports = router;