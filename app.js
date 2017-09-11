var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var flash         = require('express-flash');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var bodyParser    = require('body-parser');
var sassMiddleWare= require('node-sass-middleware');
var app           = express();
var server        = require('http').Server(app);
var cookieParser  = require('cookie-parser');
var session       = require('client-sessions');
var firebase      = require('firebase');
const OneSignalClient = require('node-onesignal-api');
const push_client = new OneSignalClient({
   appId: '7be96e60-3549-4004-bfc7-a8f191fb8bfe',
   restApiKey: 'OWJkM2EyMDMtZWUwYi00Y2VkLWFjMDYtMGI3YTAzYzM2MWM4'
});

var config = {
  apiKey: "AIzaSyD-8--1ZFgnfx97q9lMq0vPAE52tz_hYFY",
  authDomain: "raffler-fbf05.firebaseapp.com",
  databaseURL: "https://raffler-fbf05.firebaseio.com",
  storageBucket: "gs://raffler-fbf05.appspot.com",
};
firebase.initializeApp(config);

var AWS         = require('aws-sdk');
AWS.config.update({
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        region: 'us-east-1'
    });
AWS.config.apiVersions = {
    s3: '2012-10-17'
};

function Raffler(config) {
    this.init = () => {
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        app.use(logger('dev'));
        app.use(bodyParser.json({limit:"5mb"}));
        app.use(bodyParser.urlencoded({limit:"5mb", extended: true }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(session({
            cookieName: 'session',
            secret: 'eg[isfd-8yF9-7w2315df{}+Ijslito8',
            duration: 30 * 60 * 1000,
            activeDuration: 5 * 60 * 1000,
        }));
        app.use(authCheck);
        app.use(require('./controllers'));
    };

    this.initSassMiddleWare = () => {
        var srcPath = __dirname + "/sass";
        var destPath = __dirname + "/public/css";

        app.use('/css', sassMiddleWare({
            src: srcPath,
            dest: destPath,
            debug: true,
            outputStyle: 'expanded'
        }));
    }

    this.initErrorHandler = () => {
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handler
        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error/error', {'message':err.message});
        });
    };

    this.doBackgroundJob = () => {
        var http = require('https');
        setInterval(function(){
            http.get('https://raffler-admin.herokuapp.com/');
        },300000);

        setInterval(function(){

        }, 60000);

        doManageRaffle();
    }

    function getRandom(num, arr){
        arr.sort( function() { return 0.5 - Math.random() } );
        return arr.splice(0, num);
    }

    function sendPushNotification(userId){
        var query = firebase.database().ref('Users').orderByChild('uid').equalTo(userId);
        query.once('value', function(snapshot){
            if (snapshot.val() != null) {
                snapshot.forEach(function(obj){
                    var key = obj.key;
                    var pushToken = obj.val().pushToken;
                    if (pushToken != null) {
                        // send a notification 
                        push_client.createNotification({
                            contents: {
                                contents: 'Great News! You won the prize.'
                            },
                            specific: {
                                include_player_ids: [pushToken]
                            },
                            attachments: {
                                data: {
                                    hello: "Great News! You won the prize."
                                }
                            }
                        }).then(success => {
                            // .. 
                        })
                    }
                });
            }
        });
    }

    function doManageRaffle(){
        var d = new Date();
        var currentTime = d.getTime();
        console.log("server time", currentTime);
        // check winner for every raffles
        var query = firebase.database().ref('Raffles').orderByChild('isClosed').equalTo(false);
        query.once('value', function(snapshot){
            if (snapshot.val() != null) {
                snapshot.forEach(function(obj){
                    var key = obj.key;
                    var ending_date = obj.val().ending_date;
                    var winners_num = obj.val().winners_num;
                    var raffles_num = obj.val().raffles_num;
                    var isClosed = obj.val().isClosed;
                    var rafflers = obj.val().rafflers;

                    if (ending_date <= currentTime) {
                        
                        if (rafflers != null) {
                            var arr_rafflerIds = new Array();
                            for(var rafflerId in rafflers){
                                arr_rafflerIds.push(rafflerId);
                            }
                            
                            // select random winners among raffler ids
                            var arr_winnerIds = new Array();
                            if (arr_rafflerIds.length > winners_num) {
                                arr_winnerIds = getRandom(winners_num, arr_rafflerIds);
                            } else {
                                arr_rafflerIds = arr_rafflerIds;
                            }
                            
                            var dict = {};
                            for (var i=0; i < arr_winnerIds.length; i++){
                                var rafflerId = arr_rafflerIds[i];
                                dict[rafflerId] = true;

                                //send push notification
                                sendPushNotification(rafflerId);
                            }

                            console.log('winners' , dict);

                            firebase.database().ref('Raffles').child(key).child('winners').set(dict);
                        }
                    
                        // make raffle as expired
                        firebase.database().ref('Raffles').child(key).child('isClosed').set(true);
                    }

                });
            }
        });
    }

    this.start = () => {
        var self = this;
        self.initSassMiddleWare();
        self.init();
        self.initErrorHandler();
        self.doBackgroundJob();
    };
};

authCheck = (req, res, next) => {
    if (req.session.user || req.path=="/signin" || req.path=="/signup") {
        next();     
    } else {
        res.redirect("/signin");
    }
}

Raffler.startInstance = () => {
    var Configuration = require('./config.js');
    var config = Configuration.load();
    var raffler = new Raffler(config);
    raffler.start();
    return raffler;
}

Raffler.startInstance();

module.exports = {app: app, server: server};
