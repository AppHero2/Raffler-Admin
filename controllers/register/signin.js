var express = require('express');
var router  = express.Router();

router.get("/", (req, res, next) => {
    res.render("register/signin");
});

router.post("/", (req, res, next) => {
    var email = req.body.email;
    
});
module.exports = router;