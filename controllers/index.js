var express = require('express');
var router  = express.Router();

router.use("/dashboard", require("./dashboard/index"));
router.use("/signin", require("./register/signin"));
router.use("/signup", require("./register/signup"));

router.get("/", (req, res, next) => {
    if (checkSession()) {
        res.redirect("/dashboard");   
    } else {
        res.redirect("/signin");
    }
    // res.render("index");
});

module.exports = router;

checkSession = () => {
    return false;
}