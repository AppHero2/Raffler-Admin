var express = require('express');
var router  = express.Router();

var Response = require("../../helper/response.js");

router.get("/", (req, res, next) => {
    res.render("dashboard/create_raffle");
});

router.post("/", (req, res, next) => {
    var title = req.body.title;
    var endAt = req.body.entAt;

    

});

module.exports = router;