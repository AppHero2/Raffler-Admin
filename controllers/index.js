var express = require('express');
var router  = express.Router();

router.use("/dashboard", require("./dashboard/index"));
router.use("/login", require("./login/index"));

router.get("/", (req, res, next) => {
    if (checkSession()) {
        res.redirect("/dashboard");   
    } else {
        res.redirect("/login");
    }
    // res.render("index");
});

module.exports = router;

checkSession = () => {
    return false;
}