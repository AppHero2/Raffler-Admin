var express = require('express');
var router  = express.Router();
var firebase = require('firebase');

var Response  = require("../../helper/response.js");
var News      = require("../../models/news.js");

router.get("/", (req, res, next) => {
    Response.render(res, "dashboard/send_news");
});

router.post("/", (req, res, next) => {
    
    var d = new Date();
    var currentTime = d.getTime();
    News.saveData({
        'title': req.body.title,
        'content': req.body.content,
        'createdAt' : currentTime * 1,
        'updatedAt' : currentTime * 1
      }, (callback) => {
        if (callback.success) {
            Response.send(res, {
                "success": true
            });
        } else {
            Response.send(res, {
                "success": false,
                "error": callback.error
            });
        }
    });
});

router.post("/getData", (req, res, next) => {
    News.getData(null, (err, raffles) => {
        if (err) {
            Response.send(res, {success: false, error: err});    
        } else {
            Response.send(res, {success: true, data: raffles});
        }
    });
});

module.exports = router;