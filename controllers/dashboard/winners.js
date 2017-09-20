var express = require('express');
var router  = express.Router();

var Response    = require("../../helper/response.js");
var WinnerInfo  = require("../../models/winnerinfo.js");

router.get("/", (req, res, next) => {
    Response.render(res, "dashboard/winners");
});

router.post("/getWinnerInfo", (req, res, next) => {
    var idx = req.body.idx;
    WinnerInfo.getData(idx, (err, infos) => {
        if (err) {
            Response.send(res, {success: false, error: err});    
        } else {
            Response.send(res, {success: true, data: infos});
        }
    });
});

module.exports = router;