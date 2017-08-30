var express = require('express');
var router  = express.Router();

var Response = require("../../helper/response.js");

router.get("/", (req, res, next) => {
    var session = req.session;
    
    if (session && session.user) {
        res.render("dashboard/create_raffle");
    } else {
        Response.redirect(res, "/signin");
    }
});

module.exports = router;