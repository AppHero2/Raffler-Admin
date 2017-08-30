var express = require('express');
var router  = express.Router();
var firebase = require('firebase');

var Response = require("../../helper/response.js");

router.get("/", (req, res, next) => {
    req.session.reset();
    Response.redirect(res, "/signin");
});