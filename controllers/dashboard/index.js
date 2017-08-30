var express = require('express');
var router  = express.Router();

var Response = require("../../helper/response.js");

router.get("/", (req, res, next) => {
    var session = req.session;
    
    res.render("dashboard/index");
});

router.get("/create", (req, res, next) => {
    Response.redirect(res, "/dashboard");
});

module.exports = router;