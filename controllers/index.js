var express = require('express');
var router  = express.Router();

router.get("/dashboard", require("./dashboard/index"));
router.get("/", (req, res, next) => {
    res.render("index");
});

module.exports = router;
