var express = require('express');
var router  = express.Router();

var Response = require("../../helper/response.js");

router.get("/", (req, res, next) => {
    res.render("dashboard/create_raffle");
});

router.post("/", (req, res, next) => {
    var title = req.body.title;
    var endAt = req.body.entAt;

    var session = req.session;
    if (session && session.user){
        Response.send(res, {
            "success": true
        });
    } else {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
            if (user){
                var queryRef = firebase.database().ref('Admins').orderByChild('email').equalTo(email);
                queryRef.once('value', function(snapshot){
                    if (snapshot.val() != null){
                        snapshot.forEach(function(obj){
                            var userId = obj.key;
                            var allowed = obj.val().allowed;

                            if (allowed) {
                                req.session.user = user;
                                Response.send(res, {
                                    "success": true
                                });
                            } else {
                                Response.send(res, {
                                    "success": false,
                                    "error": "account is under review."
                                });    
                            }
                        });

                    } else {
                        Response.send(res, {
                            "success": false,
                            "error": "such user does not exist"
                        });
                    }
                });
                // res.redirect("/dashboard");
            }
        }).catch(function(error){
            console.log("Firebase-Error", error.message);
            Response.send(res, {
                "success": false,
                "error": error.message
            });
        });
    }

});

module.exports = router;