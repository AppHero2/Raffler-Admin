var express = require('express');
var router  = express.Router();

router.use("/dashboard", require("./dashboard/index"));
router.use("/signin", require("./register/signin"));
router.use("/signup", require("./register/signup"));
router.use("/signout", require("./register/signout"));

router.get("/", (req, res, next) => {
    res.redirect("/dashboard");   
});

module.exports = router;