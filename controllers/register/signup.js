var express = require('express');
var router  = express.Router();

router.get("/", (req, res, next) => {
    console.log("signup");
    res.render("register/signup");
});

module.exports = router;