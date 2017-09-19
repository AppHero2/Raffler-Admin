var express = require('express');
var router  = express.Router();

var Response    = require("../../helper/response.js");
var Prize       = require("../../models/prize.js");

router.get("/", (req, res, next) => {
    Response.render(res, "dashboard/winners");
});

router.post("/getPrizes", (req, res, next) => {
    var idx = req.body.idx;
    Prize.getData(idx, (err, raffles) => {
        if (err) {
            Response.send(res, {success: false, error: err});    
        } else {
            Response.send(res, {success: true, data: raffles});
        }
    });
});

module.exports = router;