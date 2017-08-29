var express = require('express');
var router  = express.Router();
var firebase = require('firebase');

router.get("/", (req, res, next) => {
    console.log("signup");
    res.render("register/signup");
});

router.post("/", (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
        if (user) {
            firebase.database().ref('Admins').child(user.uid).set({
                'name' : name,
                'role' : 0,
                'allowed': false
            });
            res.redirect("/dashboard");
        }
    }).catch(function(error){
        console.log("Firebase-Error", error.message);
    });

});

module.exports = router;