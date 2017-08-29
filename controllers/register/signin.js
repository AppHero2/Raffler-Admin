var express = require('express');
var router  = express.Router();
var firebase = require('firebase');

router.get("/", (req, res, next) => {
    res.render("register/signin");
});

router.post("/", (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
        if (user){
            res.redirect("/dashboard");
        }
    }).catch(function(error){
        console.log("Firebase-Error", error.message);
    });

});
module.exports = router;