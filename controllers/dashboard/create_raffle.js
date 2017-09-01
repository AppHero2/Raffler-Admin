var express = require('express');
var router  = express.Router();
var b64toBlob = require('b64-to-blob');
var firebase = require('firebase');
var AWS         = require('aws-sdk');
var bucket_name = 'raffler-admin/raffles';

var Response = require("../../helper/response.js");

router.get("/", (req, res, next) => {
    res.render("dashboard/create_raffle");
});

router.post("/", (req, res, next) => {
    var description = req.body.description;
    var ending_date = req.body.ending_date;
    var raffles_num = req.body.raffles_num;
    var winners_num = req.body.winners_num;
    var base64Image = req.body.base64Image;

    var file_name = randomString(8) + ".jpg";
    
    var awsS3Client = new AWS.S3({
        params:{
            Bucket: bucket_name,
        }
    });

    var buf = new Buffer(base64Image.replace(/^data:image\/\w+;base64,/, ""),'base64')
    var data = {
        Key: file_name, 
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };
    awsS3Client.putObject(data, function(err, data){
        if (err) { 
            console.log(err);
            console.log('Error uploading data: ', data); 
            Response.send(res, {
                "success": false,
                "error": err
            });
        } else {
            Response.send(res, {
                "success": true
            });
            console.log('succesfully uploaded the image!', data);
            var imageLink = "https://s3.amazonaws.com/raffler-admin/raffles/" + file_name;

            writeNewPost(description, ending_date, raffles_num, winners_num, imageLink);
        }
    });

});

function writeNewPost(description, ending_date, raffles_num, winners_num, imageLink) {
  // A post entry.
  var postData = {
    description: description,
    ending_date: ending_date,
    raffles_num: raffles_num,
    winners_num: winners_num,
    imageLink: imageLink,
    isClosed: false
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('Raffles').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/Raffles/' + newPostKey] = postData;
//   updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

module.exports = router;