var express = require('express');
var router  = express.Router();

router.use("/signin", require("./register/signin"));
router.use("/signup", require("./register/signup"));
router.use("/signout", require("./register/signout"));
router.use("/dashboard", require("./dashboard/index"));
router.use("/create_raffle", require("./dashboard/create_raffle"));
router.use("/winners", require("./dashboard/winners"));

router.get("/", (req, res, next) => {
    res.redirect("/dashboard");   
});

module.exports = router;