var express = require('express');
var router  = express.Router();

var Response = require("../../helper/response.js");

router.get("/", (req, res, next) => {
    var session = req.session;
    
    if (session && session.user) {
        res.render("dashboard/index");
    } else {
        Response.redirect(res, "/signin");
    }
});

router.get("/home", (req, res, next) => {
    res.render("dashboard/index");
});

module.exports = router;